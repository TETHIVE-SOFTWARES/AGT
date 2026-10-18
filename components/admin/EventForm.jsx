"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cover from "@/components/Cover";
import { createEvent, getEvents, updateEvent, uploadImage } from "@/lib/api";

const FIELD =
  "mt-2 w-full border-b-2 border-bone/25 bg-ink px-4 py-3 text-lg font-medium text-bone outline-none placeholder:!text-bone-500/60 focus:border-steel md:text-xl";

const LABEL = "text-[13px] font-semibold uppercase tracking-[0.16em] text-bone-600";

const GROUP = "text-[13px] font-semibold uppercase tracking-[0.16em] text-steel";

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
    date: "",
    summary: "",
    description: "",
    featured: false,
    cover: null,
    gallery: [],
  };
}

function toInputDate(display) {
  const parsed = Date.parse(display);
  if (Number.isNaN(parsed)) return "";
  const d = new Date(parsed);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function toDisplayDate(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function shot(file) {
  const preview = URL.createObjectURL(file);
  return { key: preview, url: "", file, preview };
}

function fromEvent(event) {
  return {
    id: event.id,
    title: event.title,
    date: toInputDate(event.date),
    summary: event.summary,
    description: event.description,
    featured: Boolean(event.featured),
    cover: event.coverImage
      ? { key: event.coverImage, url: event.coverImage, file: null, preview: event.coverImage }
      : null,
    gallery: (event.gallery || []).filter(Boolean).map((url) => ({
      key: url,
      url,
      file: null,
      preview: url,
    })),
  };
}

export default function EventForm({ eventId = "" }) {
  const editing = Boolean(eventId);
  const [form, setForm] = useState(blank);
  const [ready, setReady] = useState(!editing);
  const [missing, setMissing] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeBad, setNoticeBad] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;
    let live = true;
    getEvents().then((list) => {
      if (!live) return;
      const event = list.find((item) => item.id === eventId);
      if (!event) setMissing(true);
      else setForm(fromEvent(event));
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, [editing, eventId]);

  const removeCover = () => {
    if (form.cover?.file && form.cover.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(form.cover.preview);
    }
    setForm((current) => ({ ...current, cover: null }));
  };

  const removeGallery = (key) => {
    setForm((current) => {
      const shotItem = current.gallery.find((item) => item.key === key);
      if (shotItem?.file && shotItem.preview?.startsWith("blob:")) URL.revokeObjectURL(shotItem.preview);
      return { ...current, gallery: current.gallery.filter((item) => item.key !== key) };
    });
  };

  const onSave = async (e) => {
    e.preventDefault();
    const hasPhoto = Boolean(form.cover?.file || form.cover?.url || form.gallery.some((item) => item.file || item.url));
    if (!form.title.trim() || !form.date || !form.summary.trim() || !form.description.trim() || !hasPhoto) {
      setNoticeBad(true);
      setNotice("Title, date, summary, description and at least one photo are required.");
      return;
    }
    setSaving(true);
    setNotice("");
    let coverImage = form.cover?.url || "";
    if (form.cover?.file) {
      const uploaded = await uploadImage(form.cover.file);
      coverImage = uploaded.url;
    }
    const gallery = [];
    for (const item of form.gallery) {
      if (item.file) {
        const uploaded = await uploadImage(item.file);
        gallery.push(uploaded.url);
      } else if (item.url) gallery.push(item.url);
    }
    const payload = {
      title: form.title.trim(),
      date: toDisplayDate(form.date),
      summary: form.summary.trim(),
      description: form.description.trim(),
      featured: form.featured,
      coverImage,
      gallery,
    };
    const saved = editing ? await updateEvent(eventId, payload) : await createEvent(payload);
    setSaving(false);
    setNoticeBad(!saved?.persisted);
    setNotice(
      saved?.persisted
        ? "Saved in this browser. The public events page will show it."
        : "Could not store this in the browser. It will disappear after a refresh — use a smaller image."
    );
    if (saved?.persisted && !editing) setForm(blank());
    if (saved?.persisted && editing) {
      setForm((current) => ({
        ...current,
        cover: coverImage ? { key: coverImage, url: coverImage, file: null, preview: coverImage } : null,
        gallery: gallery.map((url) => ({ key: url, url, file: null, preview: url })),
      }));
    }
  };

  if (!ready) {
    return <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-bone-600">Loading</p>;
  }

  if (missing) {
    return (
      <div>
        <p className="text-[17px] leading-relaxed text-bone-600">This event is not on the record.</p>
        <Link href="/admin/events" className="btn btn-ghost mt-8">
          Back to events
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
          {editing ? "Edit event" : "Add event"}
        </h2>
        <Link href="/admin/events" className={`${GHOST} !px-5 !py-3`}>
          Back to events
        </Link>
      </div>

      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <p className={`mb-6 ${GROUP}`}>01 Details</p>
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className={LABEL}>Title</span>
              <input className={FIELD} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </label>
            <label className="block">
              <span className={LABEL}>Date</span>
              <input className={FIELD} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </label>
            <label className="flex items-end gap-3 pb-3">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-5 w-5 accent-steel"
              />
              <span className={LABEL}>Featured on the events page</span>
            </label>
          </div>

          <p className={`mb-6 mt-12 ${GROUP}`}>02 Content</p>
          <label className="mb-6 block">
            <span className={LABEL}>Summary</span>
            <textarea className={`${FIELD} resize-none`} rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </label>
          <label className="mb-6 block">
            <span className={LABEL}>Description</span>
            <textarea className={`${FIELD} resize-none`} rows={8} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          {notice ? (
            <p className={`mt-8 text-[13px] font-semibold uppercase tracking-[0.14em] ${noticeBad ? "text-sand" : "text-steel"}`}>
              {notice}
            </p>
          ) : null}

          <div className="mt-10 border-t border-bone/10 pt-8">
            <button type="submit" className="btn btn-solid !px-8 !py-4" disabled={saving}>
              {saving ? "Saving" : editing ? "Update event" : "Add event"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="mb-10">
            <p className={LABEL}>Cover image</p>
            <div className={form.cover ? `${WELL_FULL} on-dark aspect-[16/11] bg-ink` : `${WELL_EMPTY} aspect-[16/11]`}>
              {form.cover ? (
                <>
                  <Cover src={form.cover.preview} alt="" sizes="(min-width: 1024px) 40vw, 100vw" fit="contain" className="absolute inset-0" />
                  <button type="button" onClick={removeCover} className={`${GHOST} !absolute !right-2 !top-2 z-10 !px-3 !py-1.5`}>
                    Remove
                  </button>
                </>
              ) : (
                <p className={WELL_COPY}>No cover yet</p>
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
                  if (form.cover?.file && form.cover.preview?.startsWith("blob:")) {
                    URL.revokeObjectURL(form.cover.preview);
                  }
                  setForm((current) => ({ ...current, cover: shot(file) }));
                }}
              />
            </label>
          </div>

          <div>
            <p className={LABEL}>Gallery</p>
            {form.gallery.length ? (
              <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {form.gallery.map((item) => (
                  <li key={item.key} className="on-dark relative aspect-[16/11] overflow-hidden border border-bone/15 bg-ink">
                    <Cover src={item.preview} alt="" sizes="240px" fit="contain" className="absolute inset-0" />
                    <button
                      type="button"
                      onClick={() => removeGallery(item.key)}
                      className={`${GHOST} !absolute !right-1.5 !top-1.5 z-10 !px-2.5 !py-1`}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={`${WELL_EMPTY} px-4 py-16`}>
                <p className="text-center text-sm font-black uppercase tracking-[0.18em] text-bone-600 transition-colors group-hover:text-steel">
                  No extra photos yet
                </p>
              </div>
            )}
            <label className="mt-3 inline-flex cursor-pointer">
              <span className={`${GHOST} !px-5 !py-2.5`}>Choose files</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  e.target.value = "";
                  if (!files.length) return;
                  setForm((current) => ({ ...current, gallery: [...current.gallery, ...files.map(shot)] }));
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
