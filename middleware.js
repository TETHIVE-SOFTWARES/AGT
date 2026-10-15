import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, safeEqual } from "@/lib/admin-auth";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const expected = await adminToken(process.env.ADMIN_PASSWORD || "");
  const got = request.cookies.get(ADMIN_COOKIE)?.value || "";
  if (expected && safeEqual(got, expected)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
