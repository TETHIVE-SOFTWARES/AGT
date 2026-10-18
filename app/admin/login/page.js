import { redirect } from "next/navigation";
import AdminLogin from "@/components/admin/AdminLogin";
import { deskAuthed } from "@/lib/admin-session";

export const metadata = {
  title: "Desk login — Ambika Global Traders",
  description: "Sign in to the yard desk.",
};

export default async function AdminLoginPage() {
  if (await deskAuthed()) redirect("/admin");

  return (
    <main className="mx-auto max-w-[1680px] px-5 pb-16 pt-32 md:px-10 md:pb-24">
      <p className="eyebrow mb-5">Desk</p>
      <h1 className="display text-[10vw] leading-[1.05] text-bone md:text-[4vw]">
        The yard
        <span className="block text-steel-400">desk.</span>
      </h1>
      <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-bone-600">
        Events and posters edited here show on the public pages in this browser.
      </p>
      <AdminLogin />
    </main>
  );
}
