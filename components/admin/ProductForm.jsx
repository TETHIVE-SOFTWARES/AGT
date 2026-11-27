"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cover from "@/components/Cover";
import { createProduct, getProducts, updateProduct, uploadImage } from "@/lib/api";

const TITLE_FIELD =
  "mt-2 w-full border-b-2 border-bone/25 bg-ink px-4 py-4 font-display text-3xl uppercase leading-[0.95] tracking-[-0.02em] text-bone outline-none focus:border-steel";

const FIELD =
  "mt-2 w-full border-b border-bone/25 bg-transparent px-0 py-3 text-[17px] text-bone outline-none focus:border-steel";

const LABEL = "text-[13px] font-semibold uppercase tracking-[0.16em] text-bone-600";

const GHOST = "btn btn-ghost btn-line";

const WELL_EMPTY =
  "group relative mt-3 overflow-hidden border-2 border-dashed border-bone/25 bg-ink-500/40 transition-colors hover:border-steel";

const WELL_FULL = "relative mt-3 overflow-hidden border border-bone/15 bg-ink";

const WELL_COPY =
  "absolute inset-0 flex items-center justify-center px-6 text-center text-sm font-black uppercase tracking-[0.18em] text-bone-600 transition-colors group-hover:text-steel";

function blank() {
  return {
    id: null,
    title: "",
    brands: "",
    desc: "",
    img: null,
  };
}

function shot(file) {
  const preview = URL.createObjectURL(file);
  return { key: preview, url: "", file, preview };
}

function fromProduct(product) {
  return {
    id: product.id,
    title: product.title || "",
    brands: product.brands || "",
    desc: product.desc || "",
    img: product.img ? { key: product.img, url: product.img, file: null, preview: product.img } : null,
  };
}

export default function ProductForm({ productId = "" }) {
  const editing = Boolean(productId);
  const [form, setForm] = useState(blank);
  const [ready, setReady] = useState(!editing);
  const [missing, setMissing] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeBad, setNoticeBad] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;
    let live = true;
    getProducts().then((list) => {
      if (!live) return;
      const product = list.find((item) => item.id === productId);
      if (!product) setMissing(true);
      else setForm(fromProduct(product));
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, [editing, productId]);

  const onSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !(form.img?.file || form.img?.url)) {
      setNoticeBad(true);
      setNotice("A title and a product photo are required.");
      return;
    }
    setSaving(true);
    let img = form.img?.url || "";
    if (form.img?.file) {
      const uploaded = await uploadImage(form.img.file);
      img = uploaded.url;
    }
    const payload = {
      title: form.title.trim(),
      brands: form.brands.trim(),
      desc: form.desc.trim(),
      img,
      icon: "hardware",
    };
    const saved = editing ? await updateProduct(productId, payload) : await createProduct(payload);
    setSaving(false);
    setNoticeBad(!saved?.persisted);
    setNotice(
      saved?.persisted
        ? "Saved in this browser. It shows on the homepage catalogue and products page."
        : "Could not store this in the browser. It will disappear after a refresh — use a smaller image."
    );
    if (saved?.persisted && !editing) setForm(blank());
    if (saved?.persisted && editing) {
      setForm((current) => ({
        ...current,
        img: img ? { key: img, url: img, file: null, preview: img } : null,
      }));
    }
  };

  if (!ready) {
    return <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-bone-600">Loading</p>;
  }

  if (missing) {
    return (
      <div>
        <p className="text-[17px] leading-relaxed text-bone-600">This product is not on the desk.</p>
        <Link href="/admin/products" className="btn btn-ghost mt-8">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSave} className="relative border border-bone/15 border-t-4 border-t-steel bg-ink-800 p-6 md:p-10">
      <span className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-steel/70" />
        <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-steel/70" />
        <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-steel/70" />
        <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-steel/70" />
      </span>

      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-bone/15 pb-8">
        <h2 className="font-display text-4xl uppercase leading-[0.9] tracking-[-0.02em] text-bone sm:text-5xl md:text-6xl">
          {editing ? "Edit product" : "Add product"}
        </h2>
        <Link href="/admin/products" className={`${GHOST} !px-5 !py-3`}>
          Back to products
        </Link>
      </div>

      <div className="grid items-stretch gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="relative flex flex-col overflow-hidden lg:col-span-6">
          <p
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none font-display text-[72px] uppercase leading-none tracking-[-0.04em] text-bone/5 sm:text-[140px]"
          >
            Stock
          </p>

          <label className="relative z-[1] mb-8 block">
            <span className={LABEL}>Title</span>
            <input
              className={TITLE_FIELD}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>

          <label className="relative z-[1] mb-8 block">
            <span className={LABEL}>Brands line</span>
            <input
              className={FIELD}
              placeholder="Ramco · UltraTech · Dalmia"
              value={form.brands}
              onChange={(e) => setForm({ ...form, brands: e.target.value })}
            />
          </label>

          <label className="relative z-[1] mb-8 block">
            <span className={LABEL}>Short note</span>
            <textarea
              className={`${FIELD} min-h-[96px] resize-y`}
              rows={3}
              placeholder="Optional description"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />
          </label>

          {notice ? (
            <p
              className={`relative z-[1] mt-2 text-[13px] font-semibold uppercase tracking-[0.14em] ${
                noticeBad ? "text-sand" : "text-steel"
              }`}
            >
              {notice}
            </p>
          ) : null}

          <div className="relative z-[1] mt-auto border-t border-bone/10 pt-8">
            <button type="submit" className="btn btn-solid !px-8 !py-4" disabled={saving}>
              {saving ? "Saving" : editing ? "Update product" : "Add product"}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:col-span-6">
          <p className={LABEL}>Product photo</p>
          <div
            className={
              form.img
                ? `${WELL_FULL} on-dark aspect-[4/3] max-h-[520px] w-full bg-ink`
                : `${WELL_EMPTY} aspect-[4/3] max-h-[520px] w-full`
            }
          >
            {form.img ? (
              <>
                <Cover
                  src={form.img.preview}
                  alt=""
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  fit="contain"
                  className="absolute inset-0"
                />
                <button
                  type="button"
                  className={`${GHOST} !absolute !right-2 !top-2 z-10 !px-3 !py-1.5`}
                  onClick={() => {
                    if (form.img?.file && form.img.preview?.startsWith("blob:")) {
                      URL.revokeObjectURL(form.img.preview);
                    }
                    setForm((current) => ({ ...current, img: null }));
                  }}
                >
                  Remove
                </button>
              </>
            ) : (
              <p className={WELL_COPY}>Photo appears here</p>
            )}
          </div>
          <label className="mt-3 inline-flex cursor-pointer">
            <span className={`${GHOST} !px-5 !py-2.5`}>Choose file</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                if (form.img?.file && form.img.preview?.startsWith("blob:")) {
                  URL.revokeObjectURL(form.img.preview);
                }
                setForm((current) => ({ ...current, img: shot(file) }));
              }}
            />
          </label>
        </div>
      </div>
    </form>
  );
}
