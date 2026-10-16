"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminToken, safeEqual } from "@/lib/admin-auth";

const COOKIE = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function loginAdmin(_prev, formData) {
  const secret = process.env.ADMIN_PASSWORD || "";
  if (!secret) return { error: "The desk password is not set on the live site yet." };
  const password = String(formData.get("password") || "");
  if (!safeEqual(password, secret)) return { error: "That password is not right." };

  cookies().set(ADMIN_COOKIE, await adminToken(secret), COOKIE);
  redirect("/admin");
}

export async function logoutAdmin() {
  cookies().set(ADMIN_COOKIE, "", { ...COOKIE, maxAge: 0 });
  redirect("/admin/login");
}
