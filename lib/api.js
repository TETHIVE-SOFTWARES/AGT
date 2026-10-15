import { events as seedEvents, eventTime, withEventImages } from "@/data/events";
import { company } from "@/lib/data";
import { jobs as seedJobs } from "@/data/careers";

/**
 * All public and admin data access goes through this file.
 * Each function reads NEXT_PUBLIC_API_URL so the backend can be dropped in
 * without touching the pages.
 *
 * Until those endpoints exist, reads and writes use the seed data in data/*.js.
 * Edits are stored in this browser: localStorage when the payload fits, and
 * IndexedDB when photos would blow the localStorage quota. A failed write
 * returns persisted: false so the yard desk does not claim a save that a
 * refresh will lose.
 *
 * Stored lists are merged with the seed. A seed record is omitted only after
 * an explicit delete, so an older saved list cannot hide a record added later.
 */

const EVENTS_KEY = "agt.events.v1";
const JOBS_KEY = "agt.jobs.v1";
const DELETED_EVENTS = "agt.events.deleted.v1";
const DELETED_JOBS = "agt.jobs.deleted.v1";
const SLUG_COOKIE = "agt_slugs";
const IDB_NAME = "agt-yard";
const IDB_STORE = "records";

const memory = {
  events: null,
  jobs: null,
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function apiUrl(path) {
  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  return `${base}${path}`;
}

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("indexedDB unavailable"));
      return;
    }
    const request = indexedDB.open(IDB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(IDB_STORE)) {
        request.result.createObjectStore(IDB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function idbGet(key) {
  return openDb().then(
    (db) =>
      new Promise((resolve) => {
        const tx = db.transaction(IDB_STORE, "readonly");
        const request = tx.objectStore(IDB_STORE).get(key);
        request.onsuccess = () => resolve(request.result ?? null);
        request.onerror = () => resolve(null);
      }),
    () => null
  );
}

function idbSet(key, value) {
  return openDb().then(
    (db) =>
      new Promise((resolve) => {
        const tx = db.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).put(value, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
        tx.onabort = () => resolve(false);
      }),
    () => false
  );
}

function localGet(key) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function localSet(key, value) {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function unwrap(value) {
  if (Array.isArray(value)) return { savedAt: 0, items: value };
  if (value && Array.isArray(value.items) && typeof value.savedAt === "number") return value;
  return null;
}

async function readStored(key) {
  const idb = unwrap(await idbGet(key));
  const local = unwrap(localGet(key));
  if (idb && local) return idb.savedAt >= local.savedAt ? idb.items : local.items;
  if (idb) return idb.items;
  if (local) return local.items;
  return null;
}

function isUpload(src) {
  return typeof src === "string" && (src.startsWith("data:") || src.startsWith("blob:"));
}

/**
 * Seed rows stay visible unless this browser has deleted that id.
 * For events, published copy (title, description, products) comes from the seed.
 * A stored photo upload is kept.
 */
function mergeRecords(stored, seed, deleted, refreshFromSeed) {
  const removed = new Set(Array.isArray(deleted) ? deleted : []);
  const base = clone(seed).filter((item) => item && !removed.has(item.id));
  if (!Array.isArray(stored)) return base;
  const seedById = new Map(base.map((item) => [item.id, item]));
  const seen = new Set();
  const merged = [];
  for (const item of stored) {
    if (!item || !item.id || removed.has(item.id) || seen.has(item.id)) continue;
    seen.add(item.id);
    const fresh = refreshFromSeed ? seedById.get(item.id) : null;
    if (!fresh || item.managed) {
      merged.push(item);
      continue;
    }
    const uploads = [item.coverImage, ...(item.gallery || [])].filter(isUpload);
    merged.push(
      uploads.length
        ? { ...fresh, coverImage: uploads[0], gallery: [...new Set(uploads)] }
        : fresh
    );
  }
  for (const item of base) {
    if (!seen.has(item.id)) merged.push(item);
  }
  return merged;
}

async function loadList(key, seed, memKey, deletedKey, refreshFromSeed) {
  if (memory[memKey]) return clone(memory[memKey]);
  if (typeof window === "undefined") return clone(seed);
  const [stored, deleted] = await Promise.all([readStored(key), readStored(deletedKey)]);
  const merged = mergeRecords(stored, seed, deleted, refreshFromSeed);
  memory[memKey] = clone(merged);
  return clone(merged);
}

async function persist(key, items) {
  const stamped = { savedAt: Date.now(), items };
  const inIdb = await idbSet(key, stamped);
  const inLocal = localSet(key, stamped);
  return inIdb || inLocal;
}

function rememberSlugs(list) {
  if (typeof document === "undefined") return;
  const published = new Set(seedEvents.map((event) => event.slug));
  const extra = list.map((event) => event.slug).filter((slug) => slug && !published.has(slug));
  document.cookie = `${SLUG_COOKIE}=${encodeURIComponent(extra.join("|"))}; path=/; max-age=31536000; SameSite=Lax`;
}

async function writeEvents(list, deleted) {
  memory.events = clone(list);
  const listOk = await persist(EVENTS_KEY, list);
  const deletedOk = deleted ? await persist(DELETED_EVENTS, deleted) : true;
  if (listOk) rememberSlugs(list);
  return listOk && deletedOk;
}

async function writeJobs(list, deleted) {
  memory.jobs = clone(list);
  const listOk = await persist(JOBS_KEY, list);
  const deletedOk = deleted ? await persist(DELETED_JOBS, deleted) : true;
  return listOk && deletedOk;
}

export function slugify(value) {
  const slug = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || "item";
}

/**
 * Newest first. A featured flag does not change this order.
 * Pass { order: "oldest" } for the homepage Record, which keeps its original sequence.
 *
 * TODO: replace with backend API call — GET /events
 * TODO: backend will return uploaded image URLs in the same { src, alt }[] shape.
 */
export async function getEvents(options = {}) {
  const url = apiUrl("/events");
  void url;
  const list = (await loadList(EVENTS_KEY, seedEvents, "events", DELETED_EVENTS, true)).map(withEventImages);
  list.sort((a, b) => eventTime(b) - eventTime(a));
  if (options.order === "oldest") list.reverse();
  return list;
}

export async function getEventBySlug(slug) {
  const url = apiUrl(`/events/${slug}`);
  // TODO: replace with backend API call — GET url
  // TODO: backend will return uploaded image URLs in the same { src, alt }[] shape.
  void url;
  const list = await getEvents();
  return list.find((event) => event.slug === slug) || null;
}

/** Prefill used by the homepage enquiry and the contact page. Open this in the click, not after a promise. */
export function enquiryWhatsAppUrl(enquiry = {}) {
  const text = [
    "Enquiry from the website",
    "",
    `Name: ${enquiry.name || "—"}`,
    `Phone: ${enquiry.phone || "—"}`,
    `Email: ${enquiry.email || "—"}`,
    `Looking for: ${
      enquiry.service ||
      (Array.isArray(enquiry.products) && enquiry.products.length ? enquiry.products.join(", ") : null) ||
      enquiry.enquiryType ||
      "—"
    }`,
    enquiry.stage ? `Stage: ${enquiry.stage}` : null,
    enquiry.town ? `Delivery town: ${enquiry.town}` : null,
    enquiry.preferred ? `Preferred contact: ${enquiry.preferred}` : null,
    "",
    enquiry.message || "",
  ]
    .filter((line) => line !== null)
    .join("\n");
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;
}

export async function createEvent(event) {
  const url = apiUrl("/events");
  // TODO: replace with backend API call — POST url
  // Body: EventRecord without id. Response: EventRecord
  void url;
  const list = await loadList(EVENTS_KEY, seedEvents, "events", DELETED_EVENTS);
  const id = `evt-${Date.now()}`;
  let slug = slugify(event.slug || event.title);
  if (list.some((item) => item.slug === slug)) slug = `${slug}-${id.slice(-4)}`;
  const next = {
    id,
    slug,
    title: event.title,
    date: event.date,
    summary: event.summary,
    description: event.description,
    products: event.products || [],
    coverImage: event.coverImage || "",
    gallery: event.gallery || [],
    featured: Boolean(event.featured),
    managed: true,
  };
  const stored = next.featured
    ? [next, ...list.map((item) => ({ ...item, featured: false }))]
    : [next, ...list];
  const persisted = await writeEvents(stored);
  return { ...next, persisted };
}

export async function updateEvent(id, patch) {
  const url = apiUrl(`/events/${id}`);
  // TODO: replace with backend API call — PATCH url
  // Body: Partial<EventRecord>. Response: EventRecord
  void url;
  const list = await loadList(EVENTS_KEY, seedEvents, "events", DELETED_EVENTS);
  let stored = list.map((event) => (event.id === id ? { ...event, ...patch, id, managed: true } : event));
  if (patch.featured) {
    stored = stored.map((event) => ({ ...event, featured: event.id === id }));
  }
  const persisted = await writeEvents(stored);
  const saved = stored.find((event) => event.id === id) || null;
  return saved ? { ...saved, persisted } : null;
}

export async function deleteEvent(id) {
  const url = apiUrl(`/events/${id}`);
  // TODO: replace with backend API call — DELETE url
  // Response: { ok: true }
  void url;
  const list = await loadList(EVENTS_KEY, seedEvents, "events", DELETED_EVENTS);
  const deleted = (await readStored(DELETED_EVENTS)) || [];
  const nextDeleted = deleted.includes(id) ? deleted : [...deleted, id];
  const persisted = await writeEvents(
    list.filter((event) => event.id !== id),
    nextDeleted
  );
  return { ok: persisted };
}

/**
 * @param {File} file
 * @returns {Promise<{ url: string }>}
 */
export function uploadImage(file) {
  const url = apiUrl("/uploads");
  // TODO: replace with backend API call — POST url
  // Body: multipart/form-data, field name "file"
  // Response: { url: string }  (a public path the site can render)
  void url;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ url: String(reader.result || "") });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function getJobs() {
  const url = apiUrl("/jobs");
  // TODO: replace with backend API call — GET url
  // Response: JobRecord[]
  void url;
  const list = await loadList(JOBS_KEY, seedJobs, "jobs", DELETED_JOBS);
  return list.sort((a, b) => String(b.postedAt).localeCompare(String(a.postedAt)));
}

export async function createJob(job) {
  const url = apiUrl("/jobs");
  // TODO: replace with backend API call — POST url
  // Body: JobRecord without id. Response: JobRecord
  void url;
  const list = await loadList(JOBS_KEY, seedJobs, "jobs", DELETED_JOBS);
  const next = {
    id: `job-${Date.now()}`,
    title: job.title,
    department: job.department || "",
    location: job.location || "",
    type: job.type || "Full-time",
    description: job.description || "",
    responsibilities: job.responsibilities || [],
    requirements: job.requirements || [],
    postedAt: job.postedAt || new Date().toISOString().slice(0, 10),
    isOpen: job.isOpen !== false,
    poster: job.poster || job.image || "",
  };
  if (next.poster) next.image = next.poster;
  const persisted = await writeJobs([next, ...list]);
  return { ...next, persisted };
}

export async function updateJob(id, patch) {
  const url = apiUrl(`/jobs/${id}`);
  // TODO: replace with backend API call — PATCH url
  // Body: Partial<JobRecord>. Response: JobRecord
  void url;
  const current = await loadList(JOBS_KEY, seedJobs, "jobs", DELETED_JOBS);
  const list = current.map((job) => {
    if (job.id !== id) return job;
    const next = { ...job, ...patch, id };
    if ("poster" in patch || "image" in patch) {
      const picture = patch.poster || patch.image || "";
      next.poster = picture;
      next.image = picture;
    }
    if (!next.image) delete next.image;
    return next;
  });
  const persisted = await writeJobs(list);
  const saved = list.find((job) => job.id === id) || null;
  return saved ? { ...saved, persisted } : null;
}

export async function deleteJob(id) {
  const url = apiUrl(`/jobs/${id}`);
  // TODO: replace with backend API call — DELETE url
  // Response: { ok: true }
  void url;
  const list = await loadList(JOBS_KEY, seedJobs, "jobs", DELETED_JOBS);
  const deleted = (await readStored(DELETED_JOBS)) || [];
  const nextDeleted = deleted.includes(id) ? deleted : [...deleted, id];
  const persisted = await writeJobs(
    list.filter((job) => job.id !== id),
    nextDeleted
  );
  return { ok: persisted };
}

/**
 * Placeholder careers submit.
 * TODO: POST the application to the yard backend (and store the resume) once that endpoint exists.
 * POST ${NEXT_PUBLIC_API_URL}/applications
 * Body: { name, email, phone, gender, dob, age, qualifications, employment, position, address, resume: { name, size, type } }
 * Response: { ok: true }
 * Nothing is sent anywhere yet — this only logs the payload in the browser.
 */
export function submitApplication(application) {
  const url = apiUrl("/applications");
  void url;
  console.log("submitApplication", application);
  return Promise.resolve({ ok: true });
}

/**
 * Placeholder enquiry submit.
 * TODO: POST the enquiry to the yard backend once that endpoint exists.
 * POST ${NEXT_PUBLIC_API_URL}/enquiries
 * Body: { name, phone, email, service, products, stage, town, message, preferred }
 * // TODO: connect to backend
 * Response: { ok: true }
 * Callers must open WhatsApp in the submit click itself. Awaiting this
 * first lets the browser block the new tab.
 */
export function submitEnquiry(enquiry) {
  const url = apiUrl("/enquiries");
  void url;
  console.log("submitEnquiry", enquiry);
  return Promise.resolve({ ok: true });
}
