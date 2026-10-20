import type { CurrentUser, Role } from "@/lib/journey/types";

export const websiteUrl = process.env.WEBSITE_URL ?? "http://localhost:3000";
export const signInUrl = process.env.SIGN_IN_URL ?? `${websiteUrl}/signin`;
export const supportEmail = "support@bluesparkstalents.com";

export const staffRoles = ["admin", "interviewer", "recruiter"] as const satisfies Role[];

export function hasRole(user: Pick<CurrentUser, "roles">, ...roles: Role[]) {
  return roles.some((role) => user.roles.includes(role));
}

export function isStaff(user: Pick<CurrentUser, "roles">) {
  return hasRole(user, ...staffRoles);
}
