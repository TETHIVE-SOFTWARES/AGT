import EventArticle from "@/components/EventArticle";
import { getEventBySlug } from "@/lib/api";

export const dynamic = "force-dynamic";

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
  return (
    <main>
      <EventArticle key={params.slug} slug={params.slug} initial={event} />
    </main>
  );
}
