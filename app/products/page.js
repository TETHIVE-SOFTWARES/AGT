import PageHero from "@/components/PageHero";
import ProductsCatalog from "@/components/ProductsCatalog";

export const metadata = {
  title: "Products & rates — Ambika Global Traders, Nagercoil",
  description:
    "Cement, TMT, sand, bricks, paints and more from Ambika Global Traders. Check price and discount, then call or mail for a quote.",
};

export default function ProductsPage() {
  return (
    <main>
      <PageHero
        image="/img/openings-hero.webp"
        eyebrow="03 — Catalogue"
        title="Products"
        accent="and today’s rates."
        intro="Same stock as the yard floor — with price and discount listed so you can compare before you call."
        crumb="Products"
      />
      <ProductsCatalog />
    </main>
  );
}
