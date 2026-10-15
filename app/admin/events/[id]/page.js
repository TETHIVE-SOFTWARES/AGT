import PageHero from "@/components/PageHero";
import AdminNav from "@/components/admin/AdminNav";
import EventForm from "@/components/admin/EventForm";

export const metadata = {
  title: "Edit event — Ambika Global Traders",
  description: "Edit an event on the public record.",
};

export default function EditEventPage({ params }) {
  const eventId = decodeURIComponent(params.id || "");

  return (
    <main>
      <PageHero
        image="/img/record-hero.webp"
        eyebrow="01 — Events"
        title="Edit"
        accent="event."
        intro="Changes saved here show on the public events page in this browser."
        crumb="Edit"
        parent={{ href: "/admin/events", label: "Events" }}
      />
      <div className="mx-auto max-w-[1680px] px-5 pb-16 pt-12 md:px-10 md:pb-24 md:pt-16">
        <AdminNav current="/admin/events" />
        <EventForm eventId={eventId} />
      </div>
    </main>
  );
}
