// ---------------------------------------------------------
// Application Constants
// ---------------------------------------------------------

export const DEFAULT_PAGE_SIZE = 8;
export const PAGE_SIZE_OPTIONS = [5, 8, 10, 20] as const;

export const USER_ROLES = [
  "Admin",
  "Manager",
  "Developer",
  "Designer",
  "QA Engineer",
  "DevOps Engineer",
  "Product Manager",
  "Data Analyst",
] as const;

export const USER_COMPANIES = [
  "Acme Corp",
  "Globex Inc",
  "Initech",
  "Umbrella Corp",
  "Stark Industries",
  "Wayne Enterprises",
  "Cyberdyne Systems",
  "Soylent Corp",
] as const;

/**
 * Badge color variants mapped to roles.
 * Used by RoleBadge component.
 */
export const ROLE_VARIANT_MAP: Record<string, string> = {
  Admin: "bg-red-500/15 text-red-700 dark:text-red-400",
  Manager: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Developer: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  Designer: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  "QA Engineer": "bg-green-500/15 text-green-700 dark:text-green-400",
  "DevOps Engineer": "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400",
  "Product Manager": "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  "Data Analyst": "bg-teal-500/15 text-teal-700 dark:text-teal-400",
};

export const DEFAULT_ROLE_VARIANT =
  "bg-slate-500/15 text-slate-700 dark:text-slate-400";
