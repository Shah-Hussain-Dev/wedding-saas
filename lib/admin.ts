import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export { getAdminEmails, isUserAdmin } from "./admin-client";
import { isUserAdmin } from "./admin-client";

export async function verifyAdminSession() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email || !isUserAdmin(email)) {
    return { isAdmin: false, email: null, user: null };
  }

  return { isAdmin: true, email, user: session.user };
}
