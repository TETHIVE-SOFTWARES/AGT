import ContactYard from "@/components/ContactYard";
import { company } from "@/lib/data";

export const metadata = {
  title: "Contact — Ambika Global Traders",
  description:
    "Ambika Global Traders, 8/105/3, Balamore Road, Erachakulam, Kanyakumari district 629901. Call +91 63858 01701 for a same-day quote.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: company.name,
  url: "https://ambikagt.com/contact",
  email: company.email,
  telephone: ["+916385801701"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "8/105/3, Balamore Road",
    addressLocality: "Erachakulam",
    addressRegion: "Kanyakumari, Tamil Nadu",
    postalCode: "629901",
    addressCountry: "IN",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "08:00",
    closes: "20:00",
  },
};

export default function ContactPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContactYard />
    </main>
  );
}
