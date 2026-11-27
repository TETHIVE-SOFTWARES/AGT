/**
 * Rate card for /products.
 * Fill `price` (and optional `mrp`) to show amounts. Leave null to show “Call for today’s rate”.
 * discountPct is derived when both mrp and price are set.
 */

export const tmtSizesMm = ["8", "10", "12", "16", "20", "25", "32"];

export const tmtBrands = ["Tata Tiscon", "Agni", "Tirumala"];

export const cementBrands = [
  "UltraTech",
  "UltraTech Super",
  "Dalmia",
  "Dalmia DSP",
  "Ramco",
  "Ramco Crete",
];

/** @type {Record<string, { mrp: number | null, price: number | null, unit: string }>} */
export const cementRates = {
  UltraTech: { mrp: null, price: null, unit: "per bag" },
  "UltraTech Super": { mrp: null, price: null, unit: "per bag" },
  Dalmia: { mrp: null, price: null, unit: "per bag" },
  "Dalmia DSP": { mrp: null, price: null, unit: "per bag" },
  Ramco: { mrp: null, price: null, unit: "per bag" },
  "Ramco Crete": { mrp: null, price: null, unit: "per bag" },
};

/** brand → size mm → { mrp, price } ; unit is always per kg */
export const tmtRates = Object.fromEntries(
  tmtBrands.map((brand) => [
    brand,
    Object.fromEntries(tmtSizesMm.map((mm) => [mm, { mrp: null, price: null }])),
  ])
);

export const tmtUnit = "per kg";

/**
 * Flat rates for catalogue items that are not cement/TMT option matrices.
 * Keys match `products[].title` from lib/data.js.
 */
export const productRates = {
  Cement: { mrp: null, price: null, unit: "per bag" },
  "TMT Bars": { mrp: null, price: null, unit: "per kg" },
  "TMT Rings": { mrp: null, price: null, unit: "per piece" },
  "Binding Wire": { mrp: null, price: null, unit: "per kg" },
  "M-Sand": { mrp: null, price: null, unit: "per unit" },
  "P-Sand": { mrp: null, price: null, unit: "per unit" },
  Bricks: { mrp: null, price: null, unit: "per 1000" },
  "Cement Blocks": { mrp: null, price: null, unit: "per piece" },
  Paints: { mrp: null, price: null, unit: "per litre" },
  Waterproofing: { mrp: null, price: null, unit: "per kg" },
  Doors: { mrp: null, price: null, unit: "per piece" },
  Hardware: { mrp: null, price: null, unit: "ask" },
  "Bitu Pro": { mrp: null, price: null, unit: "per litre" },
  "Waterproofing Compound": { mrp: null, price: null, unit: "per kg" },
  "Weather Pro": { mrp: null, price: null, unit: "per litre" },
  "Seal & Dry": { mrp: null, price: null, unit: "per litre" },
  "Seal & Dry Hi-Flex": { mrp: null, price: null, unit: "per set" },
  Tilefixo: { mrp: null, price: null, unit: "per kg" },
  Windows: { mrp: null, price: null, unit: "per piece" },
  Gates: { mrp: null, price: null, unit: "per piece" },
};

export function discountPct(mrp, price) {
  if (mrp == null || price == null || mrp <= 0 || price >= mrp) return null;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function formatInr(n) {
  if (n == null || Number.isNaN(n)) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}
