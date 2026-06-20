import { MOCK_PROJECTS } from "@/data/mockProjects";
import { Project } from "@/types";

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
  return MOCK_PROJECTS.filter((p) => !isExpired(p.deadline)).sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );
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
