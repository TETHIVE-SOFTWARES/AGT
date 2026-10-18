import { redirect } from "next/navigation";
import { deskAuthed } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default async function DeskLayout({ children }) {
  if (!(await deskAuthed())) redirect("/admin/login");
  return children;
}
