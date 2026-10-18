import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminToken, safeEqual } from "@/lib/admin-auth";

/** True only when this request carries a cookie signed with the desk password. */
export async function deskAuthed() {
  const expected = await adminToken(process.env.ADMIN_PASSWORD || "");
  if (!expected) return false;
  const got = cookies().get(ADMIN_COOKIE)?.value || "";
  return safeEqual(got, expected);
}
