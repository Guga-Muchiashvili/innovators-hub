import { Project, ProjectType } from "@/types";

/**
 * Non-formal education & youth opportunities INSIDE Georgia:
 * tech weekends, hackathons, Model UN, forums, summits, camps, volunteering.
 *
 * Grounded in real Georgian events & organizations — Global Tech Weekend
 * Tbilisi (gtwt.ge), Startup Grind / Techstars Startup Weekend / HackMeOut
 * (startupgeorgia.org), Connect Summit (startupconnect.ge), UNA Georgia Model
 * UN clubs, Impact Hub Tbilisi, GIPA, TEDxTbilisi, ProActive Group Georgia,
 * CaYneX, Youth Center of Georgia, ESN Georgia, CENN. Concrete dates are
 * sample/seed values until the weekly scraper fills live data.
 */

interface GIn {
  id: string;
  en: string;
  ge?: string;
  org: string;
  orgId: string;
  type: ProjectType;
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
  grantAmount?: number;
  desc: string;
  descGe?: string;
  req?: string[];
  langs?: string[];
  spots?: number;
  url: string;
  apply?: string;
  tags: string[];
}

function g(p: GIn): Project {
  return {
    id: p.id,
    title: p.ge ?? p.en,
    titleEn: p.en,
    organization: p.org,
    type: p.type,
    scope: "georgia",
    country: "Georgia",
    countryCode: "GE",
    city: p.city,
    lat: p.lat,
    lng: p.lng,
    deadline: p.deadline,
    startDate: p.start,
    endDate: p.end,
    ageMin: p.ageMin ?? 16,
    ageMax: p.ageMax ?? 30,
    cost: p.cost ?? "free",
    currency: p.currency,
    grantCovered: p.grant ?? false,
    grantAmount: p.grantAmount,
    description: p.desc,
    descriptionGe: p.descGe,
    requirements: p.req ?? [],
    languages: p.langs ?? ["Georgian", "English"],
    spots: p.spots,
    sourceUrl: p.url,
    applyUrl: p.apply ?? p.url,
    sourceOrg: p.orgId,
    tags: p.tags,
    createdAt: "2026-06-01",
    updatedAt: "2026-06-21",
  };
}

// real Tbilisi venue coordinates (spread across districts) [city, lat, lng]
const T = (lat: number, lng: number) => ({ city: "Tbilisi", lat, lng });
const BATUMI = { city: "Batumi", lat: 41.6168, lng: 41.6367 };
const KUTAISI = { city: "Kutaisi", lat: 42.2679, lng: 42.718 };
const RUSTAVI = { city: "Rustavi", lat: 41.5495, lng: 44.9939 };
const GORI = { city: "Gori", lat: 41.9847, lng: 44.1139 };
const TELAVI = { city: "Telavi", lat: 41.9197, lng: 45.4731 };
const ZUGDIDI = { city: "Zugdidi", lat: 42.5088, lng: 41.8709 };
const BORJOMI = { city: "Borjomi", lat: 41.8392, lng: 43.3897 };
const BAKURIANI = { city: "Bakuriani", lat: 41.7497, lng: 43.5328 };
const MESTIA = { city: "Mestia", lat: 43.0451, lng: 42.73 };
const KAZBEGI = { city: "Kazbegi", lat: 42.6566, lng: 44.6433 };
const GUDAURI = { city: "Gudauri", lat: 42.4783, lng: 44.4783 };
const KVARELI = { city: "Kvareli", lat: 41.9497, lng: 45.8097 };
const SIGHNAGHI = { city: "Sighnaghi", lat: 41.6175, lng: 45.9211 };
const AKHALTSIKHE = { city: "Akhaltsikhe", lat: 41.6386, lng: 42.9826 };
const OZURGETI = { city: "Ozurgeti", lat: 41.9247, lng: 42.0049 };
const POTI = { city: "Poti", lat: 42.1462, lng: 41.6711 };
const KOBULETI = { city: "Kobuleti", lat: 41.8217, lng: 41.7794 };
const MARNEULI = { city: "Marneuli", lat: 41.4775, lng: 44.8092 };

export const GEORGIA_PROJECTS: Project[] = [
  // ── Tbilisi (the hub) ──────────────────────────────────────────────────────
  g({ id: "ge001", ...T(41.7156, 44.7967), en: "Global Tech Weekend Tbilisi 2026", ge: "Global Tech Weekend Tbilisi 2026", org: "Global Tech Weekend", orgId: "gtwt", type: "summit", deadline: "2026-06-21", start: "2026-06-19", end: "2026-06-21", ageMin: 16, ageMax: 99, grant: false, spots: 10000, desc: "The Caucasus' largest tech gathering — 10,000+ attendees, 200+ speakers, 80+ side events across Tbilisi. Founders, developers, investors and students.", descGe: "კავკასიის უდიდესი ტექ-შეკრება — 10,000+ მონაწილე, 200+ სპიკერი, 80+ side event თბილისის მასშტაბით. დამფუძნებლები, დეველოპერები, ინვესტორები და სტუდენტები.", url: "https://gtwt.ge", apply: "https://tickets.gtwt.ge/", tags: ["tech", "startup", "networking"] }),
  g({ id: "ge002", ...T(41.7092, 44.7585), en: "GTWT Side Event — AI Builders Day", ge: "GTWT Side Event — AI Builders Day", org: "Global Tech Weekend", orgId: "gtwt", type: "hackathon", deadline: "2026-06-19", start: "2026-06-19", end: "2026-06-19", ageMin: 16, ageMax: 35, desc: "City-wide side event for AI builders: workshops, demos and rapid prototyping.", descGe: "ქალაქის მასშტაბის side event AI-ბილდერებისთვის: ვორქშოფები, დემოები და სწრაფი პროტოტიპირება.", url: "https://gtwt.ge", apply: "https://luma.com/GTWT2026", tags: ["AI", "hackathon", "tech"] }),
  g({ id: "ge003", ...T(41.7402, 44.7589), en: "Techstars Startup Weekend Tbilisi", ge: "Techstars Startup Weekend Tbilisi", org: "Startup Georgia", orgId: "startup_georgia", type: "hackathon", deadline: "2026-09-25", start: "2026-10-09", end: "2026-10-11", ageMin: 17, ageMax: 35, cost: 30, currency: "GEL", desc: "54-hour weekend where you pitch an idea, build a team and launch a startup with mentors.", descGe: "54-საათიანი weekend, სადაც წარადგენ იდეას, ქმნი გუნდს და უშვებ სტარტაპს მენტორებთან ერთად.", url: "https://www.startupgeorgia.org/projects/techstars-startup-weekend-tbilisi", tags: ["startup", "hackathon", "entrepreneurship"] }),
  g({ id: "ge004", ...T(41.7330, 44.7360), en: "HackMeOut Tbilisi", ge: "HackMeOut Tbilisi", org: "Startup Georgia", orgId: "startup_georgia", type: "hackathon", deadline: "2026-08-30", start: "2026-09-13", end: "2026-09-14", ageMin: 16, ageMax: 30, desc: "Student hackathon solving real civic and business challenges in 24 hours.", descGe: "სტუდენტური ჰაკათონი, რომელიც 24 საათში წყვეტს რეალურ სამოქალაქო და ბიზნეს გამოწვევებს.", url: "https://www.startupgeorgia.org/projects/hackmeout-tbilisi", tags: ["hackathon", "students", "civic tech"] }),
  g({ id: "ge005", ...T(41.7124, 44.7995), en: "Startup Grind Tbilisi", ge: "Startup Grind Tbilisi", org: "Startup Grind", orgId: "startup_grind", type: "conference", deadline: "2026-07-20", start: "2026-07-30", end: "2026-07-30", ageMin: 18, ageMax: 99, desc: "Monthly fireside chats and networking for the Tbilisi entrepreneurial community.", descGe: "ყოველთვიური fireside საუბრები და ნეთვორქინგი თბილისის მეწარმეთა საზოგადოებისთვის.", url: "https://www.startupgrind.com/tbilisi/", tags: ["networking", "entrepreneurship", "business"] }),
  g({ id: "ge006", ...T(41.7836, 44.7766), en: "Connect Summit & Startup World Cup Georgia", ge: "Connect Summit & Startup World Cup Georgia", org: "Startup Connect", orgId: "startup_connect", type: "summit", deadline: "2026-09-01", start: "2026-10-22", end: "2026-10-23", ageMin: 18, ageMax: 99, desc: "Regional summit and national qualifier of the Startup World Cup — founders meet investors.", descGe: "რეგიონული სამიტი და Startup World Cup-ის ეროვნული შესარჩევი — დამფუძნებლები ხვდებიან ინვესტორებს.", url: "https://startupconnect.ge", tags: ["summit", "startup", "investors"] }),
  g({ id: "ge007", ...T(41.7815, 44.7745), en: "G GATE CONF Tbilisi", ge: "G GATE CONF Tbilisi", org: "Expo Georgia", orgId: "expo_georgia", type: "conference", deadline: "2026-09-15", start: "2026-10-28", end: "2026-10-29", ageMin: 18, ageMax: 99, cost: 50, currency: "GEL", desc: "Two-day business & affiliate marketing conference at Expo Georgia with 7,000+ attendees.", descGe: "ორდღიანი ბიზნეს და affiliate მარკეტინგის კონფერენცია Expo Georgia-ში, 7000+ მონაწილით.", url: "https://expogeorgia.ge", tags: ["business", "marketing", "conference"] }),
  g({ id: "ge008", ...T(41.7095, 44.7494), en: "Tbilisi National Model UN", ge: "თბილისის ეროვნული Model UN", org: "UNA Georgia", orgId: "una_georgia", type: "model_un", deadline: "2026-07-12", start: "2026-07-26", end: "2026-07-28", ageMin: 16, ageMax: 25, grant: true, spots: 60, desc: "Three-day Model UN simulating UN committees — debate global issues and draft resolutions.", descGe: "სამდღიანი Model UN გაეროს კომიტეტების სიმულაციით — გლობალური საკითხების დებატი და რეზოლუციები.", req: ["English B1+", "Interest in diplomacy"], url: "https://una.ge", tags: ["model un", "diplomacy", "debate"] }),
  g({ id: "ge009", ...T(41.6975, 44.7995), en: "TEDxYouth@Tbilisi", ge: "TEDxYouth@Tbilisi", org: "TEDxTbilisi", orgId: "tedx_tbilisi", type: "conference", deadline: "2026-09-20", start: "2026-10-18", end: "2026-10-18", ageMin: 14, ageMax: 25, desc: "A day of ideas worth spreading — talks and workshops by and for young people.", descGe: "იდეების დღე, რომელიც ღირს გავრცელებად — სიტყვები და ვორქშოფები ახალგაზრდებისთვის.", url: "https://www.ted.com/tedx/events/57571", tags: ["ideas", "inspiration", "talks"] }),
  g({ id: "ge010", ...T(41.7130, 44.7990), en: "Impact Hub Tbilisi — Social Entrepreneurship Program", ge: "Impact Hub Tbilisi — სოციალური მეწარმეობის პროგრამა", org: "Impact Hub Tbilisi", orgId: "impact_hub_tbilisi", type: "training", deadline: "2026-08-10", start: "2026-09-01", end: "2026-11-30", ageMin: 18, ageMax: 35, grant: true, desc: "Three-month incubation for social entrepreneurs — mentoring, seed support and community.", descGe: "სამთვიანი ინკუბაცია სოციალური მეწარმეებისთვის — მენტორობა, საწყისი მხარდაჭერა და საზოგადოება.", req: ["Social impact idea", "Age 18-35"], url: "https://tbilisi.impacthub.net/programs/", tags: ["social impact", "entrepreneurship", "incubator"] }),
  g({ id: "ge011", ...T(41.7088, 44.7705), en: "GIPA Public Policy Fellowship", ge: "GIPA საჯარო პოლიტიკის ფელოუშიპი", org: "GIPA", orgId: "gipa", type: "training", deadline: "2026-07-31", start: "2026-09-15", end: "2027-02-15", ageMin: 20, ageMax: 32, grant: true, desc: "Fellowship in public policy and governance at the Georgian Institute of Public Affairs.", descGe: "ფელოუშიპი საჯარო პოლიტიკასა და მმართველობაში საქართველოს საზოგადოებრივ საქმეთა ინსტიტუტში.", req: ["University degree", "English B2"], spots: 15, url: "https://gipa.ge", tags: ["public policy", "fellowship", "governance"] }),
  g({ id: "ge012", ...T(41.7102, 44.7608), en: "Women in Tech Tbilisi Forum", ge: "Women in Tech Tbilisi ფორუმი", org: "Impact Hub Tbilisi", orgId: "impact_hub_tbilisi", type: "forum", deadline: "2026-08-25", start: "2026-09-19", end: "2026-09-19", ageMin: 16, ageMax: 45, desc: "Forum empowering women and girls in technology — talks, mentoring and networking.", descGe: "ფორუმი, რომელიც აძლიერებს ქალებსა და გოგონებს ტექნოლოგიებში — სიტყვები, მენტორობა, ნეთვორქინგი.", url: "https://tbilisi.impacthub.net/programs/", tags: ["women in tech", "diversity", "forum"] }),
  g({ id: "ge013", ...T(41.7048, 44.8865), en: "Tbilisi Debate Championship", ge: "თბილისის სადებატო ჩემპიონატი", org: "Youth Center Georgia", orgId: "youth_center_georgia", type: "competition", deadline: "2026-09-10", start: "2026-10-04", end: "2026-10-05", ageMin: 15, ageMax: 22, desc: "British Parliamentary debate championship for school and university teams.", descGe: "ბრიტანული საპარლამენტო დებატების ჩემპიონატი სკოლისა და უნივერსიტეტის გუნდებისთვის.", req: ["Team of 2", "English B1+"], url: "https://www.facebook.com/youthcentergeorgia", tags: ["debate", "competition", "public speaking"] }),
  g({ id: "ge014", ...T(41.7065, 44.7920), en: "Civic Tech Hackathon Tbilisi", ge: "Civic Tech ჰაკათონი თბილისი", org: "CaYneX", orgId: "caynex", type: "hackathon", deadline: "2026-08-18", start: "2026-09-06", end: "2026-09-07", ageMin: 16, ageMax: 30, grant: true, desc: "Build digital tools for transparency, participation and public services in 36 hours.", descGe: "შექმენი ციფრული ინსტრუმენტები გამჭვირვალობის, მონაწილეობისა და საჯარო სერვისებისთვის 36 საათში.", url: "https://caynex.ge", tags: ["civic tech", "hackathon", "open data"] }),
  g({ id: "ge015", ...T(41.7170, 44.7975), en: "Non-Formal Education Facilitation Training", ge: "არაფორმალური განათლების ფასილიტაციის ტრენინგი", org: "CaYneX", orgId: "caynex", type: "training", deadline: "2026-07-22", start: "2026-08-08", end: "2026-08-10", ageMin: 18, ageMax: 35, grant: true, desc: "Weekend training on non-formal education methods and designing Erasmus+ youth exchanges.", descGe: "შაბათ-კვირის ტრენინგი არაფორმალური განათლების მეთოდებსა და Erasmus+ გაცვლების დიზაინზე.", url: "https://caynex.ge", tags: ["training", "non-formal education", "facilitation"] }),
  g({ id: "ge016", ...T(41.7250, 44.7520), en: "ESN Cultural Integration Days", ge: "ESN ინტეგრაციის დღეები", org: "ESN Georgia", orgId: "esn_georgia", type: "seminar", deadline: "2026-09-25", start: "2026-10-04", end: "2026-10-05", ageMin: 17, ageMax: 30, desc: "Intercultural workshops connecting local students with international Erasmus students.", descGe: "ინტერკულტურული ვორქშოფები, რომელიც აკავშირებს ადგილობრივ სტუდენტებს საერთაშორისო Erasmus სტუდენტებთან.", url: "https://esn.org.ge", tags: ["culture", "students", "integration"] }),
  g({ id: "ge017", ...T(41.7290, 44.7480), en: "Climate Action Youth Forum", ge: "კლიმატის ახალგაზრდული ფორუმი", org: "CENN", orgId: "cenn", type: "forum", deadline: "2026-09-05", start: "2026-09-27", end: "2026-09-28", ageMin: 16, ageMax: 30, grant: true, desc: "Youth forum on climate policy, green skills and community climate projects.", descGe: "ახალგაზრდული ფორუმი კლიმატის პოლიტიკაზე, მწვანე უნარებსა და თემის კლიმატ-პროექტებზე.", url: "https://www.cenn.org", tags: ["climate", "environment", "forum"] }),

  // ── Batumi ─────────────────────────────────────────────────────────────────
  g({ id: "ge018", ...BATUMI, en: "Batumi Model UN", ge: "ბათუმის Model UN", org: "UNA Georgia", orgId: "una_georgia", type: "model_un", deadline: "2026-09-01", start: "2026-09-20", end: "2026-09-21", ageMin: 15, ageMax: 22, grant: true, desc: "Regional Model UN for Adjara with beginner-friendly committees and mentoring.", descGe: "რეგიონული Model UN აჭარისთვის, დამწყებთათვის მორგებული კომიტეტებითა და მენტორობით.", url: "https://una.ge", tags: ["model un", "Adjara", "beginners"] }),
  g({ id: "ge019", ...BATUMI, en: "Batumi Tech Forum", ge: "ბათუმის ტექ ფორუმი", org: "Startup Georgia", orgId: "startup_georgia", type: "forum", deadline: "2026-08-20", start: "2026-09-12", end: "2026-09-13", ageMin: 18, ageMax: 40, desc: "Seaside tech & digital nomad forum on remote work, IT and Black Sea innovation.", descGe: "ზღვისპირა ტექ და digital nomad ფორუმი დისტანციურ სამუშაოზე, IT-სა და შავი ზღვის ინოვაციაზე.", url: "https://www.startupgeorgia.org", tags: ["tech", "digital nomad", "forum"] }),
  g({ id: "ge020", ...BATUMI, en: "Black Sea Youth Summit", ge: "შავი ზღვის ახალგაზრდული სამიტი", org: "ProActive Group Georgia", orgId: "proactive_group_georgia", type: "summit", deadline: "2026-08-15", start: "2026-09-25", end: "2026-09-27", ageMin: 18, ageMax: 30, grant: true, desc: "Summit connecting Black Sea region youth on cooperation, ecology and democracy.", descGe: "სამიტი, რომელიც აერთიანებს შავი ზღვის რეგიონის ახალგაზრდობას თანამშრომლობაზე, ეკოლოგიასა და დემოკრატიაზე.", url: "https://www.facebook.com/proactivegeorgia", tags: ["summit", "Black Sea", "cooperation"] }),
  g({ id: "ge021", ...BATUMI, en: "Batumi Summer Volunteer Camp", ge: "ბათუმის ზაფხულის მოხალისეთა ბანაკი", org: "Youth Center Georgia", orgId: "youth_center_georgia", type: "camp", deadline: "2026-07-10", start: "2026-07-28", end: "2026-08-04", ageMin: 16, ageMax: 25, cost: 100, currency: "GEL", desc: "One-week coastal volunteer camp — community work, beach activities and teamwork.", descGe: "ერთკვირიანი ზღვისპირა მოხალისეთა ბანაკი — თემის სამუშაო, სანაპირო აქტივობები და გუნდური მუშაობა.", url: "https://www.facebook.com/youthcentergeorgia", tags: ["camp", "volunteering", "coast"] }),
  g({ id: "ge022", ...BATUMI, en: "Batumi Startup Weekend", ge: "ბათუმის Startup Weekend", org: "Startup Georgia", orgId: "startup_georgia", type: "hackathon", deadline: "2026-09-05", start: "2026-09-26", end: "2026-09-28", ageMin: 17, ageMax: 35, desc: "Build a startup in a weekend on the Black Sea coast with local and visiting mentors.", descGe: "შექმენი სტარტაპი ერთ weekend-ში შავი ზღვის სანაპიროზე ადგილობრივ და მოწვეულ მენტორებთან.", url: "https://www.startupgeorgia.org", tags: ["startup", "hackathon", "Batumi"] }),
  g({ id: "ge023", ...BATUMI, en: "Adjara Debate Camp", ge: "აჭარის სადებატო ბანაკი", org: "UNA Georgia", orgId: "una_georgia", type: "camp", deadline: "2026-07-15", start: "2026-08-10", end: "2026-08-15", ageMin: 15, ageMax: 20, grant: true, desc: "Five-day camp combining debate, public speaking and critical thinking.", descGe: "ხუთდღიანი ბანაკი, რომელიც აერთიანებს დებატებს, საჯარო გამოსვლასა და კრიტიკულ აზროვნებას.", url: "https://una.ge", tags: ["camp", "debate", "Adjara"] }),

  // ── Kutaisi ────────────────────────────────────────────────────────────────
  g({ id: "ge024", ...KUTAISI, en: "Kutaisi Inter-Center Model UN", ge: "ქუთაისის ცენტრთაშორისი Model UN", org: "UNA Georgia", orgId: "una_georgia", type: "model_un", deadline: "2026-08-15", start: "2026-09-05", end: "2026-09-06", ageMin: 16, ageMax: 24, grant: true, desc: "Inter-center Model UN gathering delegates from western Georgia youth centers.", descGe: "ცენტრთაშორისი Model UN, რომელიც აერთიანებს დასავლეთ საქართველოს ცენტრების დელეგატებს.", url: "https://una.ge", tags: ["model un", "western Georgia"] }),
  g({ id: "ge025", ...KUTAISI, en: "Kutaisi Innovation Hackathon", ge: "ქუთაისის ინოვაციის ჰაკათონი", org: "Startup Georgia", orgId: "startup_georgia", type: "hackathon", deadline: "2026-08-28", start: "2026-09-19", end: "2026-09-20", ageMin: 16, ageMax: 30, desc: "Regional hackathon solving local challenges with technology and design.", descGe: "რეგიონული ჰაკათონი, რომელიც წყვეტს ადგილობრივ გამოწვევებს ტექნოლოგიითა და დიზაინით.", url: "https://www.startupgeorgia.org", tags: ["hackathon", "innovation", "Imereti"] }),
  g({ id: "ge026", ...KUTAISI, en: "Imereti Leadership Camp", ge: "იმერეთის ლიდერობის ბანაკი", org: "ProActive Group Georgia", orgId: "proactive_group_georgia", type: "camp", deadline: "2026-07-08", start: "2026-07-25", end: "2026-07-31", ageMin: 15, ageMax: 20, cost: 130, currency: "GEL", desc: "Residential leadership camp — teamwork, public speaking and project design.", descGe: "საცხოვრებელი ლიდერობის ბანაკი — გუნდური მუშაობა, საჯარო გამოსვლა და პროექტების დიზაინი.", url: "https://www.facebook.com/proactivegeorgia", tags: ["camp", "leadership", "Imereti"] }),
  g({ id: "ge027", ...KUTAISI, en: "Kutaisi Youth Volunteering Program", ge: "ქუთაისის მოხალისეობის პროგრამა", org: "Youth Center Georgia", orgId: "youth_center_georgia", type: "volunteering", deadline: "2026-08-31", start: "2026-09-15", end: "2026-12-15", ageMin: 16, ageMax: 29, desc: "Three-month local volunteering in libraries, schools and community centers.", descGe: "სამთვიანი ადგილობრივი მოხალისეობა ბიბლიოთეკებში, სკოლებსა და თემის ცენტრებში.", url: "https://www.facebook.com/youthcentergeorgia", tags: ["volunteering", "community", "Kutaisi"] }),
  g({ id: "ge028", ...KUTAISI, en: "West Georgia Civic Forum", ge: "დასავლეთ საქართველოს სამოქალაქო ფორუმი", org: "CaYneX", orgId: "caynex", type: "forum", deadline: "2026-09-12", start: "2026-10-03", end: "2026-10-04", ageMin: 16, ageMax: 28, grant: true, desc: "Forum on civic participation and youth-led community change in western Georgia.", descGe: "ფორუმი სამოქალაქო მონაწილეობასა და ახალგაზრდების მიერ თემის ცვლილებაზე დასავლეთ საქართველოში.", url: "https://caynex.ge", tags: ["civic", "forum", "participation"] }),

  // ── Rustavi ────────────────────────────────────────────────────────────────
  g({ id: "ge029", ...RUSTAVI, en: "Startup & Innovation Bootcamp", ge: "სტარტაპ & ინოვაციის bootcamp", org: "Youth Center Georgia", orgId: "youth_center_georgia", type: "training", deadline: "2026-08-25", start: "2026-09-19", end: "2026-09-21", ageMin: 16, ageMax: 28, grant: true, desc: "Weekend bootcamp: form teams, validate ideas and pitch social-impact startups.", descGe: "weekend bootcamp: შექმენი გუნდი, შეამოწმე იდეა და წარადგინე სოციალური სტარტაპი.", req: ["Bring a laptop"], url: "https://www.facebook.com/youthcentergeorgia", tags: ["startup", "innovation", "pitching"] }),
  g({ id: "ge030", ...RUSTAVI, en: "Rustavi Robotics Competition", ge: "რუსთავის რობოტიქსის შეჯიბრი", org: "Startup Georgia", orgId: "startup_georgia", type: "competition", deadline: "2026-09-20", start: "2026-10-11", end: "2026-10-12", ageMin: 12, ageMax: 19, desc: "Schools compete in robotics and engineering challenges.", descGe: "სკოლები ეჯიბრებიან რობოტიქსისა და ინჟინერიის გამოწვევებში.", req: ["Team of 2-4"], url: "https://www.startupgeorgia.org", tags: ["robotics", "STEM", "competition"] }),
  g({ id: "ge031", ...RUSTAVI, en: "Rustavi Eco Workcamp", ge: "რუსთავის ეკო სამუშაო ბანაკი", org: "CENN", orgId: "cenn", type: "workcamp", deadline: "2026-07-20", start: "2026-08-09", end: "2026-08-16", ageMin: 18, ageMax: 30, grant: true, desc: "Urban greening workcamp — tree planting, recycling and clean-up actions.", descGe: "ურბანული გამწვანების სამუშაო ბანაკი — ხეების დარგვა, რეციკლირება და დასუფთავება.", url: "https://www.cenn.org", tags: ["workcamp", "ecology", "urban"] }),

  // ── Gori ───────────────────────────────────────────────────────────────────
  g({ id: "ge032", ...GORI, en: "Civic Education Seminar Gori", ge: "სამოქალაქო განათლების სემინარი — გორი", org: "ProActive Group Georgia", orgId: "proactive_group_georgia", type: "seminar", deadline: "2026-08-20", start: "2026-09-12", end: "2026-09-13", ageMin: 16, ageMax: 24, grant: true, desc: "Seminar on civic participation, human rights and community project design.", descGe: "სემინარი სამოქალაქო მონაწილეობაზე, ადამიანის უფლებებსა და თემის პროექტებზე.", url: "https://www.facebook.com/proactivegeorgia", tags: ["civic education", "human rights", "Shida Kartli"] }),
  g({ id: "ge033", ...GORI, en: "Shida Kartli Youth Forum", ge: "შიდა ქართლის ახალგაზრდული ფორუმი", org: "Youth Center Georgia", orgId: "youth_center_georgia", type: "forum", deadline: "2026-09-08", start: "2026-09-29", end: "2026-09-30", ageMin: 16, ageMax: 30, desc: "Regional forum where youth set priorities and meet local decision-makers.", descGe: "რეგიონული ფორუმი, სადაც ახალგაზრდები ადგენენ პრიორიტეტებს და ხვდებიან ადგილობრივ გადაწყვეტილების მიმღებებს.", url: "https://www.facebook.com/youthcentergeorgia", tags: ["forum", "regional", "youth voice"] }),
  g({ id: "ge034", ...GORI, en: "Media Literacy Camp Gori", ge: "მედიაწიგნიერების ბანაკი — გორი", org: "CaYneX", orgId: "caynex", type: "camp", deadline: "2026-07-18", start: "2026-08-04", end: "2026-08-08", ageMin: 15, ageMax: 21, grant: true, desc: "Camp on spotting disinformation, fact-checking and responsible content creation.", descGe: "ბანაკი დეზინფორმაციის ამოცნობაზე, ფაქტ-ჩექსა და პასუხისმგებლიან კონტენტზე.", url: "https://caynex.ge", tags: ["media literacy", "camp", "disinformation"] }),

  // ── Telavi / Kakheti ───────────────────────────────────────────────────────
  g({ id: "ge035", ...TELAVI, en: "Telavi Model UN", ge: "თელავის Model UN", org: "UNA Georgia", orgId: "una_georgia", type: "model_un", deadline: "2026-09-15", start: "2026-10-10", end: "2026-10-11", ageMin: 15, ageMax: 22, grant: true, desc: "Kakheti regional Model UN with mentoring for first-time delegates.", descGe: "კახეთის რეგიონული Model UN დამწყები დელეგატების მენტორობით.", url: "https://una.ge", tags: ["model un", "Kakheti"] }),
  g({ id: "ge036", ...TELAVI, en: "Kakheti Heritage Volunteer Camp", ge: "კახეთის მემკვიდრეობის მოხალისეთა ბანაკი", org: "ICOMOS Georgia", orgId: "heritage_georgia", type: "workcamp", deadline: "2026-07-25", start: "2026-08-18", end: "2026-08-28", ageMin: 18, ageMax: 35, cost: 80, currency: "GEL", desc: "Help document and care for historic monuments and vineyards in Kakheti.", descGe: "დაეხმარე ისტორიული ძეგლებისა და ვენახების დოკუმენტირებასა და მოვლას კახეთში.", url: "https://www.facebook.com/proactivegeorgia", tags: ["heritage", "workcamp", "Kakheti"] }),
  g({ id: "ge037", ...KVARELI, en: "Kvareli Lake Youth Camp", ge: "ყვარლის ტბის ახალგაზრდული ბანაკი", org: "ProActive Group Georgia", orgId: "proactive_group_georgia", type: "camp", deadline: "2026-07-05", start: "2026-07-21", end: "2026-07-27", ageMin: 14, ageMax: 19, cost: 160, currency: "GEL", desc: "Lakeside summer camp — outdoor sport, soft skills and team challenges.", descGe: "ტბისპირა ზაფხულის ბანაკი — სპორტი ბუნებაში, soft skills და გუნდური გამოწვევები.", url: "https://www.facebook.com/proactivegeorgia", tags: ["camp", "outdoor", "Kakheti"] }),
  g({ id: "ge038", ...SIGHNAGHI, en: "Sighnaghi Art & Culture Residency", ge: "სიღნაღის ხელოვნებისა და კულტურის რეზიდენცია", org: "Youth Center Georgia", orgId: "youth_center_georgia", type: "camp", deadline: "2026-08-12", start: "2026-09-08", end: "2026-09-15", ageMin: 17, ageMax: 30, desc: "One-week creative residency for young artists in the 'city of love'.", descGe: "ერთკვირიანი შემოქმედებითი რეზიდენცია ახალგაზრდა ხელოვანებისთვის 'სიყვარულის ქალაქში'.", url: "https://www.facebook.com/youthcentergeorgia", tags: ["art", "residency", "culture"] }),

  // ── Samegrelo / west ───────────────────────────────────────────────────────
  g({ id: "ge039", ...ZUGDIDI, en: "Zugdidi Model UN", ge: "ზუგდიდის Model UN", org: "UNA Georgia", orgId: "una_georgia", type: "model_un", deadline: "2026-09-10", start: "2026-09-27", end: "2026-09-28", ageMin: 15, ageMax: 22, grant: true, desc: "Model UN club session for Samegrelo with introductory diplomacy workshops.", descGe: "Model UN კლუბის სესია სამეგრელოსთვის დიპლომატიის შესავალი ვორქშოფებით.", url: "https://una.ge", tags: ["model un", "Samegrelo"] }),
  g({ id: "ge040", ...ZUGDIDI, en: "Samegrelo Youth Volunteering", ge: "სამეგრელოს მოხალისეობა", org: "Youth Center Georgia", orgId: "youth_center_georgia", type: "volunteering", deadline: "2026-08-25", start: "2026-09-10", end: "2026-12-10", ageMin: 16, ageMax: 29, desc: "Local volunteering supporting schools, eco actions and cultural events.", descGe: "ადგილობრივი მოხალისეობა სკოლების, ეკო-აქციებისა და კულტურული ღონისძიებების მხარდასაჭერად.", url: "https://www.facebook.com/youthcentergeorgia", tags: ["volunteering", "Samegrelo"] }),
  g({ id: "ge041", ...POTI, en: "Poti Maritime Eco Camp", ge: "ფოთის საზღვაო ეკო ბანაკი", org: "CENN", orgId: "cenn", type: "camp", deadline: "2026-07-15", start: "2026-08-01", end: "2026-08-07", ageMin: 16, ageMax: 26, grant: true, desc: "Coastal ecology camp — wetland protection, water quality and clean-ups at the port city.", descGe: "სანაპირო ეკოლოგიის ბანაკი — ჭაობების დაცვა, წყლის ხარისხი და დასუფთავება საპორტო ქალაქში.", url: "https://www.cenn.org", tags: ["camp", "ecology", "coast"] }),
  g({ id: "ge042", ...KOBULETI, en: "Kobuleti Beach Cleanup Workcamp", ge: "ქობულეთის სანაპიროს დასუფთავების ბანაკი", org: "CENN", orgId: "cenn", type: "workcamp", deadline: "2026-07-12", start: "2026-07-26", end: "2026-08-02", ageMin: 18, ageMax: 30, grant: true, desc: "Week-long workcamp protecting the Kobuleti coastline and Black Sea biodiversity.", descGe: "ერთკვირიანი სამუშაო ბანაკი ქობულეთის სანაპიროსა და შავი ზღვის ბიომრავალფეროვნების დასაცავად.", url: "https://www.cenn.org", tags: ["workcamp", "ecology", "Black Sea"] }),
  g({ id: "ge043", ...OZURGETI, en: "Guria Volunteer Program", ge: "გურიის მოხალისეობის პროგრამა", org: "ProActive Group Georgia", orgId: "proactive_group_georgia", type: "volunteering", deadline: "2026-08-20", start: "2026-09-05", end: "2026-11-30", ageMin: 16, ageMax: 29, desc: "Rural volunteering in Guria — youth work, eco actions and local events.", descGe: "სოფლის მოხალისეობა გურიაში — ახალგაზრდული მუშაობა, ეკო-აქციები და ადგილობრივი ღონისძიებები.", url: "https://www.facebook.com/proactivegeorgia", tags: ["volunteering", "Guria", "rural"] }),

  // ── Mountains ──────────────────────────────────────────────────────────────
  g({ id: "ge044", ...BAKURIANI, en: "Bakuriani Leadership Summer Camp", ge: "ბაკურიანის ლიდერობის ბანაკი", org: "ProActive Group Georgia", orgId: "proactive_group_georgia", type: "camp", deadline: "2026-07-05", start: "2026-07-20", end: "2026-07-27", ageMin: 15, ageMax: 20, cost: 150, currency: "GEL", spots: 30, desc: "Residential mountain leadership camp — team-building, public speaking and workshops.", descGe: "საცხოვრებელი ლიდერობის ბანაკი მთებში — გუნდური მუშაობა, საჯარო გამოსვლა და ვორქშოფები.", url: "https://www.facebook.com/proactivegeorgia", tags: ["camp", "leadership", "mountains"] }),
  g({ id: "ge045", ...BORJOMI, en: "Borjomi Debate & Critical Thinking Camp", ge: "ბორჯომის სადებატო ბანაკი", org: "Youth Center Georgia", orgId: "youth_center_georgia", type: "camp", deadline: "2026-07-15", start: "2026-08-01", end: "2026-08-06", ageMin: 16, ageMax: 21, cost: 120, currency: "GEL", spots: 28, desc: "Debate training, media literacy and critical thinking in the forests of Borjomi.", descGe: "სადებატო ტრენინგი, მედიაწიგნიერება და კრიტიკული აზროვნება ბორჯომის ტყეებში.", url: "https://www.facebook.com/youthcentergeorgia", tags: ["camp", "debate", "critical thinking"] }),
  g({ id: "ge046", ...MESTIA, en: "Mestia Eco Volunteering Camp", ge: "მესტიის ეკო მოხალისეთა ბანაკი", org: "CENN", orgId: "cenn", type: "camp", deadline: "2026-07-18", start: "2026-08-03", end: "2026-08-10", ageMin: 18, ageMax: 30, grant: true, spots: 20, desc: "Trail maintenance, waste awareness and biodiversity monitoring in Svaneti.", descGe: "ბილიკების მოვლა, ნარჩენების ცნობიერება და ბიომრავალფეროვნების მონიტორინგი სვანეთში.", req: ["Physical fitness"], url: "https://www.cenn.org", tags: ["camp", "ecology", "Svaneti"] }),
  g({ id: "ge047", ...KAZBEGI, en: "Kazbegi Mountain Eco Workcamp", ge: "ყაზბეგის მთის ეკო სამუშაო ბანაკი", org: "CENN", orgId: "cenn", type: "workcamp", deadline: "2026-07-22", start: "2026-08-12", end: "2026-08-20", ageMin: 18, ageMax: 30, grant: true, desc: "Restore hiking trails and protect alpine nature near Mount Kazbek.", descGe: "აღადგინე სალაშქრო ბილიკები და დაიცავი ალპური ბუნება ყაზბეგთან.", url: "https://www.cenn.org", tags: ["workcamp", "mountains", "ecology"] }),
  g({ id: "ge048", ...GUDAURI, en: "Gudauri Winter Leadership Camp", ge: "გუდაურის ზამთრის ლიდერობის ბანაკი", org: "ProActive Group Georgia", orgId: "proactive_group_georgia", type: "camp", deadline: "2026-11-30", start: "2026-12-26", end: "2027-01-02", ageMin: 16, ageMax: 24, cost: 220, currency: "GEL", desc: "Winter camp combining leadership workshops with snow activities in Gudauri.", descGe: "ზამთრის ბანაკი, რომელიც აერთიანებს ლიდერობის ვორქშოფებსა და თოვლის აქტივობებს გუდაურში.", url: "https://www.facebook.com/proactivegeorgia", tags: ["camp", "winter", "leadership"] }),
  g({ id: "ge049", ...BAKURIANI, en: "Bakuriani Climate Youth Forum", ge: "ბაკურიანის კლიმატის ფორუმი", org: "CENN", orgId: "cenn", type: "forum", deadline: "2026-08-30", start: "2026-09-26", end: "2026-09-27", ageMin: 16, ageMax: 30, grant: true, desc: "Mountain forum on climate adaptation, sustainable tourism and green jobs.", descGe: "მთის ფორუმი კლიმატის ადაპტაციაზე, მდგრად ტურიზმსა და მწვანე სამუშაოებზე.", url: "https://www.cenn.org", tags: ["climate", "forum", "tourism"] }),

  // ── South ──────────────────────────────────────────────────────────────────
  g({ id: "ge050", ...AKHALTSIKHE, en: "Akhaltsikhe Multicultural Youth Forum", ge: "ახალციხის მულტიკულტურული ფორუმი", org: "ProActive Group Georgia", orgId: "proactive_group_georgia", type: "forum", deadline: "2026-09-05", start: "2026-09-26", end: "2026-09-27", ageMin: 16, ageMax: 28, grant: true, desc: "Forum on intercultural dialogue and inclusion in multi-ethnic Samtskhe-Javakheti.", descGe: "ფორუმი ინტერკულტურულ დიალოგსა და ინკლუზიაზე მრავალეთნიკურ სამცხე-ჯავახეთში.", url: "https://www.facebook.com/proactivegeorgia", tags: ["forum", "inclusion", "diversity"] }),
  g({ id: "ge051", ...MARNEULI, en: "Marneuli Inclusion & Dialogue Seminar", ge: "მარნეულის ინკლუზიისა და დიალოგის სემინარი", org: "CaYneX", orgId: "caynex", type: "seminar", deadline: "2026-08-22", start: "2026-09-14", end: "2026-09-15", ageMin: 16, ageMax: 28, grant: true, desc: "Seminar building dialogue, civic skills and inclusion among ethnic minority youth.", descGe: "სემინარი დიალოგის, სამოქალაქო უნარებისა და ინკლუზიის მშენებლობაზე ეთნიკური უმცირესობების ახალგაზრდებში.", url: "https://caynex.ge", tags: ["inclusion", "dialogue", "Kvemo Kartli"] }),
  g({ id: "ge052", ...MARNEULI, en: "Kvemo Kartli Agri-Innovation Camp", ge: "ქვემო ქართლის აგრო-ინოვაციის ბანაკი", org: "Impact Hub Tbilisi", orgId: "impact_hub_tbilisi", type: "camp", deadline: "2026-07-28", start: "2026-08-18", end: "2026-08-23", ageMin: 17, ageMax: 30, grant: true, desc: "Camp connecting rural youth with agri-tech, entrepreneurship and sustainability.", descGe: "ბანაკი, რომელიც აკავშირებს სოფლის ახალგაზრდობას აგრო-ტექნოლოგიასთან, მეწარმეობასა და მდგრადობასთან.", url: "https://tbilisi.impacthub.net/programs/", tags: ["agritech", "camp", "rural"] }),
];
