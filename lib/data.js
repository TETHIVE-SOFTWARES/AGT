export const company = {
  name: "Ambika Global Traders",
  short: "AGT",
  tagline: "Building material supplier",
  since: "2021",
  address: {
    line1: "8-105/3, Balamore Road, Erachakulam",
    line2: "Nagercoil, Tamil Nadu 629901",
  },
  phones: ["+91 88701 83231", "+91 63858 01701", "04652 283231"],
  whatsapp: "916385801701",
  email: "info@ambikagt.com",
  hours: "8:00 AM — 8:00 PM, Monday to Saturday",
  social: {
    facebook: "https://www.facebook.com/p/Ambika-Global-Traders-100095529603273/",
    instagram: "https://www.instagram.com/ambika_global/",
    whatsapp: "https://wa.me/916385801701",
  },
  maps: "https://www.google.com/maps/dir/?api=1&destination=8-105%2F3%20Balamore%20Road%20Erachakulam%20Nagercoil%20629901",
  mapsEmbed:
    "https://maps.google.com/maps?q=8-105%2F3%20Balamore%20Road%20Erachakulam%20Nagercoil%20629901&z=16&output=embed",
};

export const nav = [
  { label: "Home", href: "/#top" },
  { label: "About", href: "/#about" },
  { label: "Products", href: "/#products" },
  { label: "Why AGT", href: "/#why" },
  { label: "Coverage", href: "/#areas" },
  { label: "Events", href: "/events" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

/* Hero: scroll-pinned headline sequence, mirrors the reference videos */
export const heroSlides = [
  {
    img: "/img/hero-1.webp",
    kicker: "01 — The Yard",
    line1: "We supply",
    line2: "the foundation.",
    sub: "Cement, steel, sand and stone — retail and wholesale, straight from Erachakulam, Nagercoil.",
  },
  {
    img: "/img/hero-2.webp",
    kicker: "02 — The Standard",
    line1: "Every bag",
    line2: "is accountable.",
    sub: "Authorised dealers only. No seconds, no substitutes, no surprises on site.",
  },
  {
    img: "/img/hero-3.webp",
    kicker: "03 — The Reach",
    line1: "Built for",
    line2: "Kanyakumari.",
    sub: "One yard, one call, the full bill of materials — delivered across the district.",
  },
];

export const tickerItems = [
  "CEMENT", "TMT BARS", "M-SAND", "P-SAND", "BRICKS", "CEMENT BLOCKS",
  "BITU PRO", "WEATHER PRO", "SEAL & DRY", "TILEFIXO", "PAINTS",
  "DOORS", "WINDOWS", "GATES", "BINDING WIRE", "HARDWARE",
];

export const stats = [
  { value: 2021, label: "Serving since", plain: true },
  { value: 7, suffix: "+", label: "Cement brands stocked" },
  { value: 650, suffix: "+", label: "Door designs on offer" },
  { value: 100, suffix: "%", label: "Genuine, billed supply" },
];

/* Product set sourced from ambikagt.com/products */
export const products = [
  {
    n: "01",
    title: "Cement",
    icon: "cement",
    img: "/img/p-cement.webp",
    brands: "Ramco · UltraTech · Dalmia · Chettinad · Maha · Arasu · Valimai",
    desc: "A binder used in construction that sets, hardens and clings to other materials. Seven trusted brands, OPC and PPC grades, bagged and ready to load.",
  },
  {
    n: "02",
    title: "TMT Bars",
    icon: "tmt",
    img: "/img/p-tmt.webp",
    brands: "Authorised dealer",
    desc: "Reinforcing steel that gives concrete its tensile backbone. Full range of diameters, straight from authorised channels with mill test certification.",
  },
  {
    n: "03",
    title: "TMT Rings",
    icon: "rings",
    img: "/img/p-rings.webp",
    brands: "Captain",
    desc: "Ready-to-use Captain TMT rings, pre-bent to standard column and beam sizes — introduced with a focus on saving both cost and time on site.",
  },
  {
    n: "04",
    title: "Binding Wire",
    icon: "wire",
    img: "/img/p-wire.webp",
    brands: "Heat-treated · Galvanised · PVC-coated",
    desc: "Annealed and galvanised options. The PVC coating on the binding wire provides corrosion resistance where it matters most.",
  },
  {
    n: "05",
    title: "M-Sand",
    icon: "msand",
    img: "/img/p-msand.webp",
    brands: "3 varieties",
    desc: "Manufactured sand, perfect for making high-compression-strength concrete. Consistently graded, washed and screened — no silt, no shrinkage surprises.",
  },
  {
    n: "06",
    title: "P-Sand",
    icon: "psand",
    img: "/img/p-psand.webp",
    brands: "0 – 2.36 mm",
    desc: "Plastering sand with a controlled 0–2.36 mm granule size. Ready to use for mortar and smooth-finish plaster applications.",
  },
  {
    n: "07",
    title: "Bricks",
    icon: "bricks",
    img: "/img/p-bricks.webp",
    brands: "Clay · Fly-ash · Wire-cut",
    desc: "Clay-bearing soil, sand and lime, as well as concrete ingredients, can be used to make bricks. Sorted lots, uniform burn, minimal breakage.",
  },
  {
    n: "08",
    title: "Cement Blocks",
    icon: "blocks",
    img: "/img/p-blocks.webp",
    brands: "Solid · Hollow · Cellular",
    desc: "Solid, hollow and cellular blocks for masonry. Dimensionally stable, faster to lay and lighter on the structure than conventional brickwork.",
  },
  {
    n: "09",
    title: "Paints",
    icon: "paints",
    img: "/img/p-paints.webp",
    brands: "Berger · Asian Paints · True Care · Smart Care",
    desc: "Wall putty, exterior primer, damp-proof coatings and repair polymers for interior and exterior use. Tinting and shade matching available.",
  },
  {
    n: "10",
    title: "Waterproofing",
    icon: "waterproof",
    img: "/img/p-waterproof.webp",
    brands: "Bitu Pro · Weather Pro WP+200 · Seal & Dry SBR · Hi-Flex",
    desc: "High-performance solutions designed to protect buildings from water leakage and moisture damage — integral compounds, SBR bonding agents and two-component elastomeric coatings.",
  },
  {
    n: "11",
    title: "Doors",
    icon: "doors",
    img: "/img/p-doors.webp",
    brands: "650+ designs · Custom orders",
    desc: "Wooden doors in over 650 designs, with custom orders accepted for homes and offices.",
  },
  {
    n: "12",
    title: "Hardware",
    icon: "hardware",
    img: "/img/p-hardware.webp",
    brands: "Handles · Hinges · Latches",
    desc: "Door handles, hinges, latches and metal fixtures — the small parts that decide how a finished house actually feels to use.",
  },
  {
    n: "13",
    title: "Bitu Pro",
    icon: "bitu",
    img: "/img/p-bitu.webp",
    brands: "Terraces · Roofs · Basements",
    desc: "A bitumen coating that seals terraces, roofs, bathrooms, basements and exterior walls against seepage and water penetration.",
  },
  {
    n: "14",
    title: "Waterproofing Compound",
    icon: "compound",
    img: "/img/p-compound.webp",
    brands: "Integral · Mortar · Concrete",
    desc: "Mixed with cement so plaster and concrete stay dense, with fewer cavities and broken capillaries. Used within 3% of the cement weight.",
  },
  {
    n: "15",
    title: "Weather Pro",
    icon: "weather",
    img: "/img/p-weather.webp",
    brands: "WP+200",
    desc: "An integral compound for site-mixed concrete, plaster and brick mortar. It cuts water permeability and helps the work resist damp and rust.",
  },
  {
    n: "16",
    title: "Seal & Dry",
    icon: "sealdry",
    img: "/img/p-sealdry.webp",
    brands: "SBR",
    desc: "A styrene-butadiene liquid used as a bonding agent, a modifier for repair mortar, and a general waterproof coating on old concrete and plaster.",
  },
  {
    n: "17",
    title: "Seal & Dry Hi-Flex",
    icon: "hiflex",
    img: "/img/p-hiflex.webp",
    brands: "Two-component · Elastomeric",
    desc: "A cement and acrylic coating for bathrooms, kitchens, terraces, balconies, pools, sumps and exterior walls, on old or new concrete.",
  },
  {
    n: "18",
    title: "Tilefixo",
    icon: "tile",
    img: "/img/p-tilefixo.webp",
    brands: "VT · NT",
    desc: "A polymer-modified cement adhesive for small-format vitrified tiles on internal floors and walls, including tile-on-tile.",
  },
  {
    n: "19",
    title: "Windows",
    icon: "window",
    img: "/img/p-window.webp",
    brands: "Teak · Oak · Designer",
    desc: "Solid wood, oak, teak and designer wooden windows, made to sit with the door range.",
  },
  {
    n: "20",
    title: "Gates",
    icon: "gate",
    img: "/img/p-gate.webp",
    brands: "Front entry",
    desc: "Front entry gates in a range of designs, built to be the first thing a visitor sees.",
  },
];

export const brandLogos = [
  "ultratech", "ramco", "dalmia", "berger",
  "b5", "b6", "b7", "b8", "b9", "b10", "b11", "b12",
];

export const whyPanels = [
  {
    n: "01",
    title: "Best Price",
    icon: "price",
    img: "/img/why-1.webp",
    desc: "Direct dealership means no middle layer. You get yard rates on full loads and honest retail rates on a single bag — quoted upfront, billed exactly as quoted.",
    points: ["Transparent rate card", "Wholesale slabs on bulk", "No hidden loading charges"],
  },
  {
    n: "02",
    title: "Great Quality",
    icon: "quality",
    img: "/img/why-2.webp",
    desc: "Every grade we stock is one we would use on our own build. Stock rotates fast, bags stay dry, and steel arrives with its test certification intact.",
    points: ["Covered, dry storage", "Fast stock rotation", "Mill-certified steel"],
  },
  {
    n: "03",
    title: "Genuine Suppliers",
    icon: "genuine",
    img: "/img/why-3.webp",
    desc: "Authorised dealership for the brands we carry. What is printed on the bag is what is inside it — traceable, warrantable, and backed by the manufacturer.",
    points: ["Authorised dealer network", "Manufacturer-backed", "Full GST billing"],
  },
];

export const process = [
  { n: "01", title: "Tell us the stage", icon: "enquire", desc: "Foundation, slab, plaster or finishing — a photo of your plan or a quick call is enough to start." },
  { n: "02", title: "Get a written quote", icon: "quote", desc: "Itemised rates across every brand we stock, so you can compare without chasing five shops." },
  { n: "03", title: "We load and dispatch", icon: "dispatch", desc: "Scheduled against your pour date. Loads leave the Erachakulam yard with the bill in hand." },
  { n: "04", title: "Delivered to site", icon: "delivered", desc: "Across Kanyakumari district, unloaded where your mason actually needs it — not at the gate." },
];

export const areas = [
  "Nagercoil", "Erachakulam", "Thuckalay", "Marthandam", "Kuzhithurai",
  "Colachel", "Suchindram", "Kanyakumari", "Thovalai", "Boothapandi",
  "Eraniel", "Padmanabhapuram", "Anjugramam", "Rajakkamangalam", "Agastheeswaram",
  "Vadasery", "Parakkai", "Kottaram", "Aralvaimozhi", "Takkalai",
];

export const values = [
  { k: "Excellence", v: "Pursuit of the highest standards across every part of the business." },
  { k: "Customer Focus", v: "Aligning with changing expectations and enabling customer success." },
  { k: "Team Work", v: "Relationships built on cooperation, trust and mutual respect." },
  { k: "Integrity", v: "Honest, fair, transparent and ethical conduct." },
  { k: "Commitment", v: "Acting in the best interests of all stakeholders." },
];
