import PageHero from "@/components/PageHero";
import CareersAdmin from "@/components/admin/CareersAdmin";

export const metadata = {
  title: "Careers desk — Ambika Global Traders",
  description: "Add and edit the roles shown on the careers page.",
};

export default function AdminCareersPage() {
  return (
    <main>
      <PageHero
        image="/img/openings-hero.webp"
        eyebrow="02 — Careers"
        title="The"
        accent="openings."
        intro="Upload a poster, replace it, or take it off the careers page."
        crumb="Careers"
        parent={{ href: "/admin", label: "Desk" }}
      />
      <CareersAdmin />
    </main>
  );
}
