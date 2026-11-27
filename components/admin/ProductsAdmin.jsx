"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Cover from "@/components/Cover";
import { deleteProduct, getProducts } from "@/lib/api";

export default function ProductsAdmin() {
  const [items, setItems] = useState([]);
  const [pending, setPending] = useState(null);
  const [notice, setNotice] = useState("");
  const [noticeBad, setNoticeBad] = useState(false);

  const load = () => getProducts().then(setItems);

  useEffect(() => {
    load();
  }, []);

  const onDelete = async () => {
    if (!pending) return;
    const product = pending;
    setPending(null);
    const result = await deleteProduct(product.id);
    if (!result?.ok) {
      setNoticeBad(true);
      setNotice("Could not store this change. The product will come back after a refresh.");
      return;
    }
    setNotice("");
    load();
  };

  return (
    <div className="mx-auto max-w-[1680px] px-5 pb-16 pt-12 md:px-10 md:pb-24 md:pt-16">
      <AdminNav current="/admin/products" />

      <div className="mb-8">
        <Link href="/admin/products/new" className="btn btn-solid">
          Add product
        </Link>
      </div>

      {notice ? (
        <p className={`mb-6 font-mono text-[12px] uppercase tracking-[0.14em] ${noticeBad ? "text-sand" : "text-steel"}`}>
          {notice}
        </p>
      ) : null}

      <ul className="border-t border-bone/10">
        {items.map((product) => (
          <li
            key={product.id}
            className="flex flex-col gap-4 border-b border-bone/10 py-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="on-dark relative h-16 w-20 shrink-0 overflow-hidden border border-bone/15 bg-ink">
                <Cover src={product.img} alt="" sizes="80px" fit="contain" className="absolute inset-0" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-bone-600">
                  {product.n}
                  {product.managed ? " · Added here" : ""}
                </p>
                <p className="truncate font-display text-lg uppercase tracking-wide text-bone">{product.title}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/admin/products/${product.id}`} className="btn btn-ghost !px-5 !py-3">
                Edit
              </Link>
              <button type="button" onClick={() => setPending(product)} className="btn btn-ghost !px-5 !py-3">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {pending ? (
        <ConfirmDialog
          title={pending.title}
          body="This product will come off the public catalogue in this browser."
          onConfirm={onDelete}
          onCancel={() => setPending(null)}
        />
      ) : null}
    </div>
  );
}
