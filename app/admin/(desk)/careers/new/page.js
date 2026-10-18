import PageHero from "@/components/PageHero";
import AdminNav from "@/components/admin/AdminNav";
import PosterForm from "@/components/admin/PosterForm";

export const metadata = {
  title: "Add career — Ambika Global Traders",
  description: "Add a careers poster to the public page.",
};

export default function NewPosterPage() {
  return (
    <main>
      <PageHero
        image="/img/openings-hero.webp"
        eyebrow="02 — Careers"
        title="Add"
        accent="career."
        intro="An open poster saved here shows on the public careers page in this browser."
        crumb="Add"
        parent={{ href: "/admin/careers", label: "Careers" }}
      />
      <div className="mx-auto max-w-[1680px] px-5 pb-16 pt-12 md:px-10 md:pb-24 md:pt-16">
        <AdminNav current="/admin/careers" />
        <PosterForm />
      </div>
    </main>
  );
}
