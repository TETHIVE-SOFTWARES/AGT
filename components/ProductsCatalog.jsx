"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { discountPct, formatInr, productRates } from "@/data/catalog";
import { getProducts } from "@/lib/api";

const groups = [
  { id: "all", label: "All" },
  { id: "steel", label: "Cement & steel" },
  { id: "masonry", label: "Sand & masonry" },
  { id: "coatings", label: "Paints & waterproofing" },
  { id: "joinery", label: "Doors & hardware" },
];

function groupOf(title) {
  if (["Cement", "TMT Bars", "TMT Rings", "Binding Wire"].includes(title)) return "steel";
  if (["M-Sand", "P-Sand", "Bricks", "Cement Blocks"].includes(title)) return "masonry";
  if (
    [
      "Paints",
      "Waterproofing",
      "Bitu Pro",
      "Waterproofing Compound",
      "Weather Pro",
      "Seal & Dry",
      "Seal & Dry Hi-Flex",
      "Tilefixo",
    ].includes(title)
  ) {
    return "coatings";
  }
  if (["Doors", "Hardware", "Windows", "Gates"].includes(title)) return "joinery";
  return "all";
}

function PriceBlock({ mrp, price, unit }) {
  const off = discountPct(mrp, price);
  const shown = formatInr(price);
  const was = formatInr(mrp);

  if (!shown) return null;

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="font-display text-2xl leading-none text-bone md:text-[28px]">{shown}</p>
        {was && off ? (
          <p className="font-mono text-[13px] text-bone-400 line-through">{was}</p>
        ) : null}
        {off ? (
          <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-steel">
            {off}% off
          </span>
        ) : null}
      </div>
      {unit ? <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-500">{unit}</p> : null}
    </div>
  );
}

function CatalogCard({ product }) {
  const rate = productRates[product.title] || { mrp: null, price: null, unit: "" };

  return (
    <article className="flex h-full flex-col border border-bone/10 bg-ink">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-bone/10 bg-ink-700">
        <Image
          src={product.img}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-contain p-4"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-bone-500">{product.n}</p>
        <h2 className="mt-2 font-display text-[22px] leading-tight text-bone md:text-[24px]">{product.title}</h2>
        {product.brands ? (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-bone-500">{product.brands}</p>
        ) : null}

        <PriceBlock mrp={rate.mrp} price={rate.price} unit={rate.unit} />

        <div className="mt-auto pt-5">
          <a href="/contact#enquiry" className="btn btn-solid !px-5 !py-2.5 text-[12px]">
            Get a quote
          </a>
        </div>
      </div>
    </article>
  );
}

export default function ProductsCatalog() {
  const [group, setGroup] = useState("all");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const list = useMemo(() => {
    if (group === "all") return products;
    return products.filter((p) => groupOf(p.title) === group);
  }, [group, products]);

  return (
    <section className="bg-ink-800 pb-24 pt-10 md:pb-32 md:pt-14">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="border-b border-bone/10 pb-8">
          <p className="eyebrow mb-3">Rate list</p>
          <h2 className="display max-w-[18ch] text-[7vw] leading-[1.05] text-bone md:text-[2.4vw]">
            Price and discount.
          </h2>
          <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-bone-600">
            Browse what we stock, pick the brand or size where it applies, and check the rate.
            Confirm with a call or mail before you load — rates move with the market.
          </p>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible">
          {groups.map((g) => {
            const on = group === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGroup(g.id)}
                className={`shrink-0 border px-5 py-2.5 font-mono text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors md:text-[14px] ${
                  on
                    ? "border-bone bg-bone text-ink"
                    : "border-bone/15 bg-ink text-bone-600 hover:border-bone/35 hover:text-bone"
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
          {list.map((p) => (
            <CatalogCard key={p.id || p.n} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
