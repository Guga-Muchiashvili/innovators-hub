export interface Project {
  id: string;
  title: string;
  titleEn: string;
  organization: string;
  organizationLogo?: string;
  type: ProjectType;
  /** "world" = takes place abroad; "georgia" = local, inside Georgia */
  scope: ProjectScope;
  country: string;
  countryCode: string;
  city: string;
  lat: number;
  lng: number;
  deadline: string;
  startDate: string;
  endDate: string;
  ageMin: number;
  ageMax: number;
  cost: number | "free";
  currency?: string;
  grantCovered: boolean;
  grantAmount?: number;
  description: string;
  descriptionGe?: string;
  requirements: string[];
  languages: string[];
  spots?: number;
  sourceUrl: string;
  sourceOrg: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type ProjectScope = "world" | "georgia";

export type ProjectType =
  | "erasmus_plus"
  | "youth_exchange"
  | "volunteering"
  | "training"
  | "seminar"
  | "workcamp"
  | "internship"
  | "scholarship"
  | "conference"
  | "model_un"
  | "camp"
  | "hackathon"
  | "forum"
  | "summit"
  | "competition"
  | "other";

export interface FilterState {
  types: ProjectType[];
  countries: string[];
  /** Georgian cities (used when scope = "georgia") */
  cities: string[];
  ageRange: [number, number];
  maxCost: number | null;
  grantOnly: boolean;
  languages: string[];
  dateRange: [string | null, string | null];
  searchQuery: string;
}

export interface DataSource {
  id: string;
  name: string;
  url: string;
  type: "scrape" | "api" | "rss";
  country: string;
  active: boolean;
}
