import axios from "axios";
import * as cheerio from "cheerio";
import { Project, ProjectType } from "@/types";
import { DATA_SOURCES } from "@/data/sources";

const SCRAPE_CONFIG: Record<string, ScrapeConfig> = {
  salto_youth: {
    listUrl: "https://www.salto-youth.net/tools/otlas-partner-finding/",
    itemSelector: ".training-item",
    fields: {
      title: "h3.title",
      deadline: ".deadline",
      country: ".country",
      description: ".description",
    },
  },
  european_youth_portal: {
    listUrl:
      "https://youth.europa.eu/solidarity/corps/activities_en?field_activity_type_target_id=All&page=0",
    itemSelector: ".activity-card",
    fields: {
      title: "h2.activity-title",
      deadline: ".deadline-date",
      country: ".hosting-country",
      description: ".activity-description",
    },
  },
};

interface ScrapeConfig {
  listUrl: string;
  itemSelector: string;
  fields: Record<string, string>;
}

interface ScrapedItem {
  title?: string;
  deadline?: string;
  country?: string;
  description?: string;
  url?: string;
  [key: string]: string | undefined;
}

async function scrapeUrl(url: string): Promise<cheerio.CheerioAPI | null> {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      timeout: 15000,
    });
    return cheerio.load(response.data);
  } catch (error) {
    console.error(`Failed to scrape ${url}:`, error);
    return null;
  }
}

async function scrapeSource(sourceId: string): Promise<ScrapedItem[]> {
  const config = SCRAPE_CONFIG[sourceId];
  if (!config) return [];

  const $ = await scrapeUrl(config.listUrl);
  if (!$) return [];

  const items: ScrapedItem[] = [];

  $(config.itemSelector).each((_, el) => {
    const item: ScrapedItem = {};
    for (const [field, selector] of Object.entries(config.fields)) {
      item[field] = $(el).find(selector).text().trim();
    }
    const link = $(el).find("a").attr("href");
    if (link) {
      item.url = link.startsWith("http")
        ? link
        : new URL(link, config.listUrl).href;
    }
    if (item.title) items.push(item);
  });

  return items;
}

function inferProjectType(title: string, description: string): ProjectType {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("volunteer") || text.includes("solidarity corps"))
    return "volunteering";
  if (text.includes("training") || text.includes("capacity")) return "training";
  if (text.includes("seminar") || text.includes("workshop")) return "seminar";
  if (text.includes("workcamp") || text.includes("work camp"))
    return "workcamp";
  if (text.includes("internship") || text.includes("traineeship"))
    return "internship";
  if (text.includes("scholarship") || text.includes("fellowship"))
    return "scholarship";
  if (text.includes("conference") || text.includes("forum"))
    return "conference";
  if (
    text.includes("youth exchange") ||
    text.includes("exchange") ||
    text.includes("mobility")
  )
    return "youth_exchange";
  if (text.includes("erasmus")) return "erasmus_plus";
  return "other";
}

function isExpired(deadline: string): boolean {
  if (!deadline) return false;
  try {
    return new Date(deadline) < new Date();
  } catch {
    return false;
  }
}

export async function runWeeklyScrape(): Promise<{
  added: number;
  removed: number;
  errors: string[];
}> {
  const results = { added: 0, removed: 0, errors: [] as string[] };

  for (const source of DATA_SOURCES) {
    if (!source.active) continue;
    try {
      const items = await scrapeSource(source.id);
      results.added += items.length;
      console.log(`[${source.name}] Found ${items.length} items`);
    } catch (error) {
      const msg = `Error scraping ${source.name}: ${error}`;
      console.error(msg);
      results.errors.push(msg);
    }
    await new Promise((r) => setTimeout(r, 2000));
  }

  return results;
}

export async function filterExpiredProjects(
  projects: Project[]
): Promise<Project[]> {
  return projects.filter((p) => !isExpired(p.deadline));
}

export { isExpired, inferProjectType };
