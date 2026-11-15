import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";
export { getAdminEmails, isUserAdmin } from "./admin-client";
import { isUserAdmin } from "./admin-client";

export async function verifyAdminSession(req?: any) {
  // 1. Standard getServerSession
  const session = await getServerSession(authOptions);
  let email = session?.user?.email;

  // 2. JWT token fallback for Next.js App Router API requests
  if (!email && req) {
    try {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (token?.email) {
        email = token.email as string;
      }
    } catch (_) {}
  }

  if (!email || !isUserAdmin(email)) {
    return { isAdmin: false, email: null, user: null };
  }

  return { isAdmin: true, email, user: session?.user || { email, name: "Admin" } };
}
