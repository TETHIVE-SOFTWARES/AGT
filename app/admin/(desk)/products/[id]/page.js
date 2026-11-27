import PageHero from "@/components/PageHero";
import AdminNav from "@/components/admin/AdminNav";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = {
  title: "Edit product — Ambika Global Traders",
  description: "Edit a product on the public catalogue.",
};

export default function EditProductPage({ params }) {
  const productId = decodeURIComponent(params.id || "");

  return (
    <main>
      <PageHero
        image="/img/openings-hero.webp"
        eyebrow="03 — Products"
        title="Edit"
        accent="product."
        intro="Changes saved here update the public catalogue in this browser."
        crumb="Edit"
        parent={{ href: "/admin/products", label: "Products" }}
      />
      <div className="mx-auto max-w-[1680px] px-5 pb-16 pt-12 md:px-10 md:pb-24 md:pt-16">
        <AdminNav current="/admin/products" />
        <ProductForm productId={productId} />
      </div>
    </main>
  );
}
