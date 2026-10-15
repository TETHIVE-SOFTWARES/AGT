import Link from "next/link";
import { logoutAdmin } from "@/app/admin/actions";

export default function AdminNav({ current }) {
  const item = (href, label) => (
    <Link
      href={href}
      aria-current={current === href ? "page" : undefined}
      className={`link-sweep font-mono text-[13px] uppercase tracking-[0.18em] ${
        current === href ? "text-bone" : "text-bone-600"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="mb-10 flex flex-wrap items-center gap-6 border-b border-bone/10 pb-6">
      {item("/admin", "Desk")}
      {item("/admin/events", "Events")}
      {item("/admin/careers", "Careers")}
      <form action={logoutAdmin} className="ml-auto">
        <button type="submit" className="link-sweep font-mono text-[13px] uppercase tracking-[0.18em] text-bone-600">
          Log out
        </button>
      </form>
    </div>
  );
}
