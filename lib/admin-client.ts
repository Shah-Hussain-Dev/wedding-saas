// Client-safe Admin helpers with zero server dependencies
import { siteConfig } from "@/config/site";

export function getAdminEmails(): string[] {
  const envAdmins = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  const parsed = envAdmins
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const defaultAdmins = siteConfig.admin.defaultEmails;

  return Array.from(new Set([...defaultAdmins, ...parsed]));
}

export function isUserAdmin(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const adminList = getAdminEmails();

  return adminList.includes(normalized);
}
