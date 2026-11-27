import PageHero from "@/components/PageHero";
import ProductsAdmin from "@/components/admin/ProductsAdmin";

export const metadata = {
  title: "Products desk — Ambika Global Traders",
  description: "Add and edit the products shown on the catalogue.",
};

export default function AdminProductsPage() {
  return (
    <main>
      <PageHero
        image="/img/openings-hero.webp"
        eyebrow="03 — Products"
        title="The"
        accent="catalogue."
        intro="Add a product with its photo, or edit one already on the public pages."
        crumb="Products"
        parent={{ href: "/admin", label: "Desk" }}
      />
      <ProductsAdmin />
    </main>
  );
}
