import PageHero from "@/components/PageHero";
import AdminNav from "@/components/admin/AdminNav";
import EventForm from "@/components/admin/EventForm";

export const metadata = {
  title: "Add event — Ambika Global Traders",
  description: "Add an event to the public record.",
};

export default function NewEventPage() {
  return (
    <main>
      <PageHero
        image="/img/record-hero.webp"
        eyebrow="01 — Events"
        title="Add"
        accent="event."
        intro="A saved event shows on the public events page in this browser."
        crumb="Add"
        parent={{ href: "/admin/events", label: "Events" }}
      />
      <div className="mx-auto max-w-[1680px] px-5 pb-16 pt-12 md:px-10 md:pb-24 md:pt-16">
        <AdminNav current="/admin/events" />
        <EventForm />
      </div>
    </main>
  );
}
