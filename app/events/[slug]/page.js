import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import EventArticle from "@/components/EventArticle";
import { getEventBySlug, getEvents } from "@/lib/api";

export async function generateStaticParams() {
  const list = await getEvents();
  return list.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }) {
  const event = await getEventBySlug(params.slug);
  if (!event) {
    return { title: "Event — Ambika Global Traders, Nagercoil" };
  }
  return {
    title: `${event.title} — Ambika Global Traders, Nagercoil`,
    description: event.summary,
  };
}

export default async function EventPage({ params }) {
  const event = await getEventBySlug(params.slug);
  if (!event) {
    const extra = decodeURIComponent(cookies().get("agt_slugs")?.value || "")
      .split("|")
      .filter(Boolean);
    if (!extra.includes(params.slug)) notFound();
  }
  return (
    <main>
      <EventArticle key={params.slug} slug={params.slug} initial={event} />
    </main>
  );
}
