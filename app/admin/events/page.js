import PageHero from "@/components/PageHero";
import EventsAdmin from "@/components/admin/EventsAdmin";

export const metadata = {
  title: "Events desk — Ambika Global Traders",
  description: "Add and edit the events shown on the public record.",
};

export default function AdminEventsPage() {
  return (
    <main>
      <PageHero
        image="/img/record-hero.webp"
        eyebrow="01 — Events"
        title="The"
        accent="record."
        intro="Add a meet with its photos and description, or edit one already on the record."
        crumb="Events"
        parent={{ href: "/admin", label: "Desk" }}
      />
      <EventsAdmin />
    </main>
  );
}
