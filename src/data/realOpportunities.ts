import { Project, ProjectType, ProjectScope } from "@/types";

/**
 * REAL, currently-open opportunities verified by hand. Each `applyUrl` is the
 * actual project page on SALTO's European Training Calendar (or the official
 * event registration), which opens directly on the description + "Apply" — no
 * extra navigation. Sourced live from salto-youth.net and gtwt.ge (June 2026).
 */

interface RIn {
  id: string;
  en: string;
  org: string;
  orgId: string;
  type: ProjectType;
  scope: ProjectScope;
  country: string;
  cc: string;
  city: string;
  lat: number;
  lng: number;
  deadline: string;
  start: string;
  end: string;
  ageMin?: number;
  ageMax?: number;
  cost?: number | "free";
  currency?: string;
  grant?: boolean;
  desc: string;
  langs?: string[];
  apply: string; // real direct registration / project page
  tags: string[];
}

function r(p: RIn): Project {
  return {
    id: p.id,
    title: p.en,
    titleEn: p.en,
    organization: p.org,
    type: p.type,
    scope: p.scope,
    country: p.country,
    countryCode: p.cc,
    city: p.city,
    lat: p.lat,
    lng: p.lng,
    deadline: p.deadline,
    startDate: p.start,
    endDate: p.end,
    ageMin: p.ageMin ?? 18,
    ageMax: p.ageMax ?? 30,
    cost: p.cost ?? "free",
    currency: p.currency,
    grantCovered: p.grant ?? true,
    description: p.desc,
    requirements: [],
    languages: p.langs ?? ["English"],
    sourceUrl: p.apply,
    applyUrl: p.apply,
    verified: true,
    sourceOrg: p.orgId,
    tags: p.tags,
    createdAt: "2026-06-21",
    updatedAt: "2026-06-21",
  };
}

export const REAL_OPPORTUNITIES: Project[] = [
  r({
    id: "real01",
    en: "The Art of Wellbeing — Training Course",
    org: "SALTO / Erasmus+",
    orgId: "salto_youth",
    type: "training",
    scope: "world",
    country: "Czech Republic",
    cc: "CZ",
    city: "Oldřichov v Hájích",
    lat: 50.8606,
    lng: 15.0856,
    deadline: "2026-06-22",
    start: "2026-08-01",
    end: "2026-08-09",
    desc: "Erasmus+ training course on wellbeing and self-care for youth workers at an eco-centre in northern Czechia. Travel, food and accommodation covered by National Agencies.",
    apply: "https://www.salto-youth.net/tools/european-training-calendar/training/the-art-of-wellbeing-tc.14987/",
    tags: ["wellbeing", "youth work", "Erasmus+"],
  }),
  r({
    id: "real02",
    en: "BODY-BRAIN WISDOM — Stress Management for NFE Practitioners",
    org: "SALTO / Erasmus+",
    orgId: "salto_youth",
    type: "training",
    scope: "world",
    country: "Croatia",
    cc: "HR",
    city: "Zadar",
    lat: 44.1194,
    lng: 15.2314,
    deadline: "2026-06-22",
    start: "2026-07-13",
    end: "2026-07-20",
    desc: "Training course on stress management and embodied learning for non-formal education practitioners on the Croatian coast.",
    apply: "https://www.salto-youth.net/tools/european-training-calendar/training/body-brain-wisdom-stress-management-for-nfe-practitioners.14802/",
    tags: ["stress management", "non-formal education", "wellbeing"],
  }),
  r({
    id: "real03",
    en: "Mental Health — Egypt Edition",
    org: "SALTO / Erasmus+",
    orgId: "salto_youth",
    type: "seminar",
    scope: "world",
    country: "Egypt",
    cc: "EG",
    city: "Alexandria",
    lat: 31.2001,
    lng: 29.9187,
    deadline: "2026-06-22",
    start: "2026-07-03",
    end: "2026-07-06",
    desc: "International seminar on youth mental health and resilience, bringing together youth workers from Europe and the Mediterranean.",
    apply: "https://www.salto-youth.net/tools/european-training-calendar/training/mental-health-egypt-edition.14961/",
    tags: ["mental health", "Mediterranean", "youth work"],
  }),
  r({
    id: "real04",
    en: "DICOMI — Digital Comics for Migration",
    org: "SALTO / Erasmus+",
    orgId: "salto_youth",
    type: "training",
    scope: "world",
    country: "Sweden",
    cc: "SE",
    city: "Stockholm",
    lat: 59.3293,
    lng: 18.0686,
    deadline: "2026-06-22",
    start: "2026-07-20",
    end: "2026-09-21",
    desc: "Blended training using digital comics to tell migration stories and build inclusion, with an in-person phase in Stockholm.",
    apply: "https://www.salto-youth.net/tools/european-training-calendar/training/dicomi-digital-comics-for-migration.14957/",
    tags: ["migration", "digital", "inclusion"],
  }),
  r({
    id: "real05",
    en: "The Future of Artificial Intelligence: Who Sets the Limits?",
    org: "SALTO / Erasmus+",
    orgId: "salto_youth",
    type: "seminar",
    scope: "world",
    country: "Greece",
    cc: "GR",
    city: "Online (Greece)",
    lat: 37.9838,
    lng: 23.7275,
    deadline: "2026-06-22",
    start: "2026-06-26",
    end: "2026-06-26",
    desc: "Online seminar exploring the ethics and governance of artificial intelligence for young people.",
    apply: "https://www.salto-youth.net/tools/european-training-calendar/training/the-future-of-artificial-intelligence-who-sets-the-limits.14952/",
    tags: ["AI", "ethics", "online"],
  }),
];
