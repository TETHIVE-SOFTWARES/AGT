import PageHero from "@/components/PageHero";
import EventsIndex from "@/components/EventsIndex";

export const metadata = {
  title: "Events — Ambika Global Traders, Nagercoil",
  description:
    "Technical meets, inaugurations and dealerships from Ambika Global Traders in Erachakulam, Nagercoil.",
};

export default function EventsPage() {
  return (
    <main>
      <PageHero
        image="/img/events-hero.webp"
        eyebrow="07 — Record"
        title="Meets, openings"
        accent="and dealerships."
        intro="We put our contractors in the same room as the manufacturers. Here is some of what that has looked like."
        crumb="Events"
      />
      <EventsIndex />
    </main>
  );
}
