/**
 * @typedef {Object} JobRecord
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} company
 * @property {string} poster          Public path. Empty string means the designed fallback card.
 * @property {string} qualification
 * @property {string} experience
 * @property {string[]} skills
 * @property {string} workingHours
 * @property {string} location
 * @property {string} type
 * @property {string} postedAt        ISO date, YYYY-MM-DD
 * @property {boolean} isOpen
 * @property {string} [image]         Same path as poster, so the yard desk can preview it.
 */

/**
 * Open roles. Edit this list, or add one in /admin/careers — a poster saved there
 * shows on /careers through getJobs().
 */
export const jobs = [
  {
    id: "accountant",
    slug: "accountant",
    title: "Accountant",
    company: "Ambika Global Traders",
    poster: "/careers/accountant.jpg",
    image: "/careers/accountant.jpg",
    qualification: "M.Com",
    experience: "At least 1 year",
    skills: ["Accounts", "Bank transactions", "Audit", "Finance", "GST and taxation"],
    workingHours: "8:30 AM – 6:30 PM",
    location: "Erachakulam, Nagercoil",
    type: "Full-time",
    postedAt: "2022-07-15",
    isOpen: true,
  },
  {
    id: "female-staff",
    slug: "female-staff",
    title: "Female Staff",
    company: "Uma E-Service Center",
    poster: "/careers/female-staff.jpg",
    image: "/careers/female-staff.jpg",
    qualification: "B.Com or B.Sc Computer Science",
    experience: "At least 1 year",
    skills: ["E-service", "DTP", "Photoshop", "Xerox", "MS Office"],
    workingHours: "8:30 AM – 6:30 PM",
    location: "Nagercoil",
    type: "Full-time",
    postedAt: "2022-07-15",
    isOpen: true,
  },
  {
    id: "site-supervisor",
    slug: "site-supervisor",
    title: "Site Supervisor",
    company: "Ambika Global Traders",
    poster: "",
    qualification: "Any degree",
    experience: "At least 1 year",
    skills: ["Site supervision", "Material coordination", "Contractor liaison"],
    workingHours: "8:30 AM – 6:30 PM",
    location: "Erachakulam, Nagercoil",
    type: "Full-time",
    postedAt: "2026-03-01",
    isOpen: true,
  },
];

/** Four reasons, set like the homepage value cards. */
export const whyWork = [
  {
    icon: "enquire",
    k: "The counter",
    v: "Contractors call before they pour. The work is picking up, quoting straight, and meaning the time you give.",
  },
  {
    icon: "genuine",
    k: "Genuine stock",
    v: "Authorised brands only. What is printed on the bag is what leaves on the truck, and your name is on that bill.",
  },
  {
    icon: "delivered",
    k: "One district",
    v: "Routes stay inside Kanyakumari. You learn the sites, the masons and the roads, instead of a territory on a map.",
  },
  {
    icon: "quality",
    k: "A short crew",
    v: "The yard is small enough that a good week is visible, and so is a missed load. There is room to own a desk.",
  },
];

export const lifeShots = [
  { src: "/img/about-1.webp", label: "The yard" },
  { src: "/img/why-1.webp", label: "The load" },
  { src: "/img/hero-2.webp", label: "The road" },
  { src: "/img/ev-4.webp", label: "The crew" },
];
