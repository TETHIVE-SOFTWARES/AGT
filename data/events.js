import { eventImages } from "./event-images.generated";

/**
 * @typedef {Object} EventImage
 * @property {string} src
 * @property {string} alt
 *
 * @typedef {Object} EventRecord
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} date            Display date, e.g. "25 Jun 2022"
 * @property {string} summary
 * @property {string} description
 * @property {string[]} products
 * @property {EventImage[]} images    Card slideshow, detail photographs, and the photographs widget
 * @property {string} coverImage      First image, kept for older admin saves
 * @property {string[]} gallery       Image srcs, kept for older admin saves
 * @property {boolean} featured
 * @property {string} [cardTitle]     Homepage Record card title, when it differs
 */

/** Oldest first, so the homepage Record section keeps its original order. */
const records = [
  {
    id: "evt-ultratech-technical-meet",
    slug: "ultratech-technical-meet",
    title: "UltraTech technical meet",
    date: "25 Jun 2022",
    summary:
      "India's leading cement company walked our contractors through upgraded materials — Weather Pro, Seal & Dry, waterproofing and Tilefixo.",
    description: [
      "India’s No 1 Cement company UltraTech conducted a meeting on 25th June 2022. Discussed about the upgraded materials with Contractors. Meeting was conducted by Sales manager, Technical manager and Sales man Mr. Arun. More Quality product for your construction such as UltraTech Weather Pro, UltraTech Seal & Dry, UltraTech Waterproofing, Ultratech Tilefixo.",
      "UltraTech Weather Pro: waterproofing compound which improves the performance properties of Concrete, plaster & mortar.",
      "UltraTech Seal & Dry: having multi-purpose application-bonding agent, as a modifier for repair plaster, concrete & mortar and as a waterproofing coating.",
      "UltraTech Waterproofing: waterproof coating consisting of high quality additives and fillers for all positive side water proofing application.",
      "Ultratech Tilefixo: Tilefixo Vt is Ideal for Internal thin bed wall and floor applications of vitrified tile. It is recommended to be used over cementitious substrates and for tile-on-tile application.",
    ].join("\n\n"),
    products: ["Weather Pro", "Seal & Dry", "Waterproofing", "Tilefixo"],
    featured: false,
  },
  {
    id: "evt-asian-paints-product-session",
    slug: "asian-paints-product-session",
    title: "Asian Paints product session",
    date: "29 Jun 2022",
    summary:
      "Smart Care Vitalia NEO, Hydro LOC, Ultra Block 2K, Damp Block 2K and Repair Polymer, demonstrated to our contractor network.",
    description: [
      "Indian multinational paint company Conducted a small meeting on 29-06-2022. Discussed about the upgraded materials with Contractors. Meeting was conducted by Sales man. More quality product for the construction such as Smart Care Vitalia NEO, Smart Care Hydro LOC, Ultra block 2K, Damp Block 2K, Repair Polymer.",
      "Vitalia NEO: Has superior plasticizing for cement, concrete, mortar and plasters which strengthens the cement, concrete and reduces water permeability.",
      "Smart Care Hydro LOC: Brushable product that can be applied directly at plaster level as pre-putty coating.",
      "Smart Care Ultra block 2K: High performance coating, which provides unmatched waterproofing for interior walls and bathrooms.",
      "Smart Care Repair Polymer: Repairing and bonding agent for concrete/mortar in repair like spalled concrete – floors, chajjas, beams, slabs as it bonds old and new concrete surfaces strongly with plasters.",
    ].join("\n\n"),
    products: [
      "Smart Care Vitalia NEO",
      "Hydro LOC",
      "Ultra Block 2K",
      "Damp Block 2K",
      "Repair Polymer",
    ],
    featured: false,
  },
  {
    id: "evt-asian-paints-paints-clinic",
    slug: "asian-paints-paints-clinic",
    title: "Asian Paints paints clinic",
    cardTitle: "Paints clinic, inside and out",
    date: "13 Jul 2022",
    summary:
      "Ace Exterior Emulsion and the Smart Care line, covered end to end with the Asian Paints sales and technical team.",
    description: [
      "Indian multinational paint company Conducted a meeting on 13-07-2022. Discussed about the upgraded materials with Contractors. Meeting was conducted by TSO Mr. Pradeep, Sales Manager Mr. Merwin, along with Mr. Jeeva and Mr. Shiva. Discussed about varies kinds of paints, which can be applied both exterior as well as interior.",
      "Ace Exterior Emulsion: A water-based exterior wall finish with unique water resistance technology. It’s the perfect outdoor paint as it has a first-rate resistance to chalking, cracking, and weathering as opposed to cement paints.",
      "Smart Care Repair Polymer: Repairing and bonding agent for concrete/mortar in repair like spalled concrete – floors, chajjas, beams, slabs as it bonds old and new concrete surfaces strongly with plasters.",
      "Smart Care Hydro LOC: Brushable product that can be applied directly at plaster level as pre-putty coating.",
      "Smart Care Ultra block 2K: High performance coating, which provides unmatched waterproofing for interior walls and bathrooms.",
    ].join("\n\n"),
    products: ["Ace Exterior Emulsion", "Smart Care"],
    featured: false,
  },
  {
    id: "evt-uma-plaza-inauguration",
    slug: "uma-plaza-inauguration",
    title: "Uma Plaza inauguration",
    date: "07 Sep 2022",
    summary:
      "Mother's Gift — Uma Plaza commercial building opened with traditional pooja and homam, alongside our staff and colleagues.",
    description: [
      "We Warm our new commercial building Mother’s Gift- Uma Plaza, on 7th September 2022.",
      "Started with blessing of God. Early morning 3:00 pm, Started Pooja and homam.",
      "Morning, With pleasant Sunny Climate, we warm our building approximately 6:00 am.",
      "Dressed up with elegant traditional theme. All our staffs, Colleagues, Friends, Engineers celebrated together with happiness.",
      "This happiness extended with breakfast. hope this happiness go throughout life time.",
    ].join("\n\n"),
    products: [],
    featured: false,
  },
  {
    id: "evt-uma-e-service-centre-opening",
    slug: "uma-e-service-centre-opening",
    title: "Uma E-Service Centre opening",
    cardTitle: "Uma E-Service Centre opens",
    date: "04 Oct 2022",
    summary:
      "A milestone we had been working toward — ribbon cutting, lamp lighting and a new service point for the neighbourhood.",
    description: [
      "We crossed a milestone of opening a new E-Service Center on 04-10-2022, Tuesday. Started with blessing and lots of prayers.",
      "Elegant Rangoli on front, bright Chief guests on foot step, friends aside, Chitchat joyfully Started our day.",
      "The Day opens with beautifully and uniformly dressed up staffs and colleagues. with sweet smile…",
      "Joy overloaded when time moves on. Received our chief guests. And when the time came. We started our function.",
      "We honored the Chief guests with shawls. Started the function with prayers and blessings. With warm hearted Chief guests cut the ribbon and Lighted the lamp, to shine everlasting.",
      "I pray that this happiness and Brightness will shine all the way long.",
    ].join("\n\n"),
    products: [],
    featured: false,
  },
  {
    id: "evt-ultratech-dealership",
    slug: "ultratech-dealership",
    title: "UltraTech dealership",
    date: "06 Oct 2022",
    summary:
      "Dealership secured for UltraTech — the largest manufacturer of grey cement, ready-mix concrete and white cement in India.",
    description: [
      "We are Glade to have dealership on UltraTech Company on 6th October 2022 Celebrating with the kind hearted sales Manager.",
      "UltraTech Cement Limited is an Indian cement company based in Mumbai, and a part of Aditya Birla Group.",
      "UltraTech is the largest manufacturer of grey cement, ready-mix concrete (RMC) and white cement in India with an installed capacity of 116.75 million tonnes per annum.",
      "It is the only company in the world to have a capacity of over 100 million tonnes in a single country, outside of China.",
      "Hope this small step lead us to the giant leap.",
    ].join("\n\n"),
    products: ["UltraTech grey cement", "Ready-mix concrete", "White cement"],
    featured: true,
  },
];

function numberedAlt(title, index) {
  return `${title || "Event"} photograph ${String(index + 1).padStart(2, "0")}`;
}

function isUpload(src) {
  return typeof src === "string" && (src.startsWith("data:") || src.startsWith("blob:"));
}

/**
 * Folder photos are the source of truth. An admin upload (data/blob URL)
 * wins for that record so a desk photo is not replaced by the folder.
 * coverImage and gallery are derived and are not a second photo list.
 */
export function withEventImages(event) {
  if (!event) return event;

  const legacy = [event.coverImage, ...(event.gallery || [])].filter(Boolean);
  const uploads = legacy.filter(isUpload);
  const folder = eventImages[event.slug] || [];

  let images;
  if (uploads.length) {
    const srcs = [...new Set(uploads)];
    images = srcs.map((src, index) => ({ src, alt: numberedAlt(event.title, index) }));
  } else if (folder.length) {
    images = folder.map((image, index) => ({
      src: image.src,
      alt: numberedAlt(event.title, index),
    }));
  } else if (Array.isArray(event.images) && event.images.length) {
    images = event.images.map((image, index) => ({
      src: image.src,
      alt: image.alt || numberedAlt(event.title, index),
    }));
  } else {
    const srcs = [...new Set(legacy)];
    images = srcs.map((src, index) => ({ src, alt: numberedAlt(event.title, index) }));
  }

  return {
    ...event,
    images,
    coverImage: images[0]?.src || "",
    gallery: images.map((image) => image.src),
  };
}

export const events = records.map(withEventImages);

export function eventTime(event) {
  const parsed = Date.parse(event?.date);
  return Number.isNaN(parsed) ? 0 : parsed;
}
