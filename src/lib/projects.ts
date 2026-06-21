import { MOCK_PROJECTS } from "@/data/mockProjects";
import { WORLD_EXTRA } from "@/data/worldExtra";
import { GEORGIA_PROJECTS } from "@/data/georgiaProjects";
import { Project, ProjectScope } from "@/types";
import { TYPE_LABEL } from "@/lib/constants";

export const ALL_PROJECTS: Project[] = [
  ...MOCK_PROJECTS,
  ...WORLD_EXTRA,
  ...GEORGIA_PROJECTS,
];

/**
 * Strong, multi-word search. Builds a haystack from every meaningful field
 * (title, org, city, country, type label, tags, description) and requires
 * each whitespace-separated token in the query to appear somewhere.
 */
export function matchesQuery(p: Project, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [
    p.titleEn,
    p.title,
    p.organization,
    p.city,
    p.country,
    TYPE_LABEL[p.type],
    p.description,
    p.descriptionGe ?? "",
    p.sourceOrg.replace(/_/g, " "),
    ...p.tags,
  ]
    .join(" ")
    .toLowerCase();
  return q.split(/\s+/).every((tok) => hay.includes(tok));
}

export function isExpired(deadline: string): boolean {
  if (!deadline) return false;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(deadline) < today;
  } catch {
    return false;
  }
}

/** All non-expired projects, sorted by nearest deadline first. */
export function getActiveProjects(): Project[] {
  return ALL_PROJECTS.filter((p) => !isExpired(p.deadline)).sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );
}

/** Active projects for a given scope ("world" or "georgia"). */
export function getProjectsByScope(scope: ProjectScope): Project[] {
  return getActiveProjects().filter((p) => p.scope === scope);
}

export function getProjectById(id: string): Project | null {
  return getActiveProjects().find((p) => p.id === id) ?? null;
}

export function getProjectsByOrg(orgId: string): Project[] {
  return getActiveProjects().filter((p) => p.sourceOrg === orgId);
}

export interface OrgSummary {
  id: string;
  name: string;
  count: number;
  countries: string[];
}

export function getOrganizations(): OrgSummary[] {
  const map = new Map<string, OrgSummary>();
  for (const p of getActiveProjects()) {
    const existing = map.get(p.sourceOrg);
    if (existing) {
      existing.count++;
      if (!existing.countries.includes(p.country)) existing.countries.push(p.country);
    } else {
      map.set(p.sourceOrg, {
        id: p.sourceOrg,
        name: p.organization,
        count: 1,
        countries: [p.country],
      });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function getOrgSummary(orgId: string): OrgSummary | null {
  return getOrganizations().find((o) => o.id === orgId) ?? null;
}
