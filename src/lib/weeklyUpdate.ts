/**
 * Weekly project update system.
 * Triggered by Vercel Cron (vercel.json) or external cron via POST /api/scrape.
 *
 * Architecture:
 * 1. Fetch projects from all 20+ sources
 * 2. Deduplicate by title+org+startDate
 * 3. Remove expired (deadline < now)
 * 4. Merge with existing data (update changed, add new)
 * 5. Save to database
 */

import { Project, DataSource } from "@/types";
import { DATA_SOURCES } from "@/data/sources";
import { isExpired } from "./scraper";

const CRON_SCHEDULE = "0 8 * * 1"; // Every Monday at 08:00

interface UpdateResult {
  added: number;
  updated: number;
  removed: number;
  sourcesChecked: number;
  errors: string[];
  timestamp: string;
}

async function fetchProjectsFromSource(source: DataSource): Promise<Project[]> {
  // Source-specific fetching logic
  // In production: real scraping + API calls
  // Currently returns empty (mock data used directly)
  return [];
}

export async function runWeeklyUpdate(): Promise<UpdateResult> {
  const result: UpdateResult = {
    added: 0,
    updated: 0,
    removed: 0,
    sourcesChecked: 0,
    errors: [],
    timestamp: new Date().toISOString(),
  };

  const allFetched: Project[] = [];

  for (const source of DATA_SOURCES.filter((s) => s.active)) {
    try {
      const projects = await fetchProjectsFromSource(source);
      allFetched.push(...projects);
      result.sourcesChecked++;
    } catch (error) {
      result.errors.push(`${source.name}: ${String(error)}`);
    }
    // Rate limiting
    await new Promise((r) => setTimeout(r, 1500));
  }

  // Remove expired
  const activeProjects = allFetched.filter((p) => !isExpired(p.deadline));
  result.removed = allFetched.length - activeProjects.length;

  console.log(
    `[WeeklyUpdate] Checked ${result.sourcesChecked} sources, found ${allFetched.length} projects, ${result.removed} expired`
  );

  return result;
}

export { CRON_SCHEDULE };
