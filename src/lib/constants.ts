import { ProjectType } from "@/types";

/** Primary brand accent — violet. */
export const ACCENT = "#7c3aed";
export const ACCENT_DARK = "#6d28d9";

/**
 * Categorical colors for project types.
 * Kept within a cool violet / purple / indigo / fuchsia family so the whole
 * palette reads as "white + violet" while still being distinguishable.
 */
export const TYPE_COLOR: Record<ProjectType, string> = {
  erasmus_plus: "#6d28d9",
  youth_exchange: "#7c3aed",
  volunteering: "#9333ea",
  training: "#a855f7",
  seminar: "#c026d3",
  workcamp: "#d946ef",
  internship: "#4f46e5",
  scholarship: "#6366f1",
  conference: "#8b5cf6",
  other: "#64748b",
};

export const TYPE_LABEL: Record<ProjectType, string> = {
  erasmus_plus: "Erasmus+",
  youth_exchange: "Youth Exchange",
  volunteering: "Volunteering",
  training: "Training",
  seminar: "Seminar",
  workcamp: "Workcamp",
  internship: "Internship",
  scholarship: "Scholarship",
  conference: "Conference",
  other: "Other",
};

/** Ordered list for filters and legend. */
export const TYPE_LIST: { value: ProjectType; label: string; color: string }[] = (
  Object.keys(TYPE_LABEL) as ProjectType[]
)
  .filter((t) => t !== "other")
  .map((t) => ({ value: t, label: TYPE_LABEL[t], color: TYPE_COLOR[t] }));
