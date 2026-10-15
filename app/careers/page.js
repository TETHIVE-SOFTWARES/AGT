import PageHero from "@/components/PageHero";
import CareersBoard from "@/components/CareersBoard";

export const metadata = {
  title: "Careers — Ambika Global Traders, Nagercoil",
  description:
    "Work at the Ambika Global Traders yard in Erachakulam, Nagercoil. Open roles for the counter, the bay, delivery and accounts.",
};

export default function CareersPage() {
  return (
    <main>
      <PageHero
        image="/img/careers-bay.webp"
        eyebrow="09 — Careers"
        title="Build"
        accent="with us."
        intro="The yard in Erachakulam runs on a short crew — counter, bay, road and accounts. If that is the work you want, start here."
        crumb="Careers"
      />
      <CareersBoard />
    </main>
  );
}
