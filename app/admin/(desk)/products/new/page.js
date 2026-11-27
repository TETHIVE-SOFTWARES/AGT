import PageHero from "@/components/PageHero";
import AdminNav from "@/components/admin/AdminNav";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = {
  title: "Add product — Ambika Global Traders",
  description: "Add a product to the public catalogue.",
};

export default function NewProductPage() {
  return (
    <main>
      <PageHero
        image="/img/openings-hero.webp"
        eyebrow="03 — Products"
        title="Add"
        accent="product."
        intro="A product saved here shows on the homepage strip and the products page in this browser."
        crumb="Add"
        parent={{ href: "/admin/products", label: "Products" }}
      />
      <div className="mx-auto max-w-[1680px] px-5 pb-16 pt-12 md:px-10 md:pb-24 md:pt-16">
        <AdminNav current="/admin/products" />
        <ProductForm />
      </div>
    </main>
  );
}
