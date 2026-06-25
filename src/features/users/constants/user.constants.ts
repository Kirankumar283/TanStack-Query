// ---------------------------------------------------------
// User Feature Constants
// ---------------------------------------------------------

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

export const ROLE_OPTIONS = USER_ROLES.map((role) => ({
  label: role,
  value: role,
}));

export const DEFAULT_PAGE_SIZE = 8;
