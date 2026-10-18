import PageHero from "@/components/PageHero";
import AdminNav from "@/components/admin/AdminNav";
import PosterForm from "@/components/admin/PosterForm";

export const metadata = {
  title: "Edit career — Ambika Global Traders",
  description: "Edit a careers poster on the public page.",
};

export default function EditCareerPage({ params }) {
  const jobId = decodeURIComponent(params.id || "");

  return (
    <main>
      <PageHero
        image="/img/openings-hero.webp"
        eyebrow="02 — Careers"
        title="Edit"
        accent="career."
        intro="Changes saved here show on the public careers page in this browser."
        crumb="Edit"
        parent={{ href: "/admin/careers", label: "Careers" }}
      />
      <div className="mx-auto max-w-[1680px] px-5 pb-16 pt-12 md:px-10 md:pb-24 md:pt-16">
        <AdminNav current="/admin/careers" />
        <PosterForm jobId={jobId} />
      </div>
    </main>
  );
}
