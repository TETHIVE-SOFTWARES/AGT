import PageHero from "@/components/PageHero";
import ApplicationForm from "@/components/careers/ApplicationForm";

export const metadata = {
  title: "Apply — Ambika Global Traders, Nagercoil",
  description:
    "Apply for a role at the Ambika Global Traders yard in Erachakulam, Nagercoil.",
};

export default function ApplyNowPage({ searchParams }) {
  const role = typeof searchParams?.role === "string" ? searchParams.role : "";

  return (
    <main>
      <PageHero
        image="/img/careers-bay.webp"
        eyebrow="09 — Careers"
        title="Apply"
        accent="now."
        intro="Tell us the role and send your details. The yard reads every application."
        crumb="Apply"
        parent={{ href: "/careers", label: "Careers" }}
      />
      <ApplicationForm role={role} />
    </main>
  );
}
