import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Admin — Ambika Global Traders",
  description: "Yard desk for events and careers. Not linked from the public site.",
};

export default function AdminHome() {
  return (
    <main>
      <PageHero
        image="/img/desk-hero.webp"
        eyebrow="Desk"
        title="The yard"
        accent="desk."
        intro="Events and posters edited here show on the public pages in this browser. Nothing is sent to a server yet."
        crumb="Desk"
      />
      <section className="mx-auto max-w-[1680px] px-5 pb-16 pt-16 md:px-10 md:pb-24 md:pt-20">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/admin/events" className="group relative border border-bone/10 bg-ink-800 p-8">
            <p className="eyebrow mb-4">01</p>
            <h2 className="display text-3xl text-bone">Events</h2>
            <p className="mt-3 text-sm leading-relaxed text-bone-600">
              Add a meet with its photos and description, or edit one already on the record.
            </p>
            <span className="absolute inset-x-0 bottom-0 block h-px w-0 bg-steel transition-all duration-700 group-hover:w-full" />
          </Link>
          <Link href="/admin/careers" className="group relative border border-bone/10 bg-ink-800 p-8">
            <p className="eyebrow mb-4">02</p>
            <h2 className="display text-3xl text-bone">Careers</h2>
            <p className="mt-3 text-sm leading-relaxed text-bone-600">
              Upload a poster, replace it, or take it off the careers page.
            </p>
            <span className="absolute inset-x-0 bottom-0 block h-px w-0 bg-steel transition-all duration-700 group-hover:w-full" />
          </Link>
        </div>
      </section>
    </main>
  );
}
