import { NextRequest, NextResponse } from "next/server";
import { MOCK_PROJECTS } from "@/data/mockProjects";
import { filterExpiredProjects } from "@/lib/scraper";
import { FilterState } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  let projects = await filterExpiredProjects(MOCK_PROJECTS);

  const types = searchParams.getAll("type");
  if (types.length > 0) {
    projects = projects.filter((p) => types.includes(p.type));
  }

  const countries = searchParams.getAll("country");
  if (countries.length > 0) {
    projects = projects.filter((p) => countries.includes(p.country));
  }

  const ageMin = searchParams.get("ageMin");
  const ageMax = searchParams.get("ageMax");
  if (ageMin) {
    projects = projects.filter((p) => p.ageMax >= parseInt(ageMin));
  }
  if (ageMax) {
    projects = projects.filter((p) => p.ageMin <= parseInt(ageMax));
  }

  const grantOnly = searchParams.get("grantOnly");
  if (grantOnly === "true") {
    projects = projects.filter((p) => p.grantCovered);
  }

  const maxCost = searchParams.get("maxCost");
  if (maxCost) {
    const max = parseFloat(maxCost);
    projects = projects.filter(
      (p) => p.cost === "free" || (typeof p.cost === "number" && p.cost <= max)
    );
  }

  const query = searchParams.get("q");
  if (query) {
    const q = query.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.titleEn.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.organization.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({ projects, total: projects.length });
}
