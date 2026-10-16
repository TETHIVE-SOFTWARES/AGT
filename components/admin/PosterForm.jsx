"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cover from "@/components/Cover";
import { createJob, getJobs, updateJob, uploadImage } from "@/lib/api";

const TITLE_FIELD =
  "mt-2 w-full border-b-2 border-bone/25 bg-ink px-4 py-4 font-display text-3xl uppercase leading-[0.95] tracking-[-0.02em] text-bone outline-none focus:border-steel";

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
    isOpen: true,
    poster: null,
  };
}

function pictureOf(job) {
  return job?.poster || job?.image || "";
}

function shot(file) {
  const preview = URL.createObjectURL(file);
  return { key: preview, url: "", file, preview };
}

function fromJob(job) {
  const poster = pictureOf(job);
  return {
    id: job.id,
    title: job.title || "",
    isOpen: Boolean(job.isOpen),
    poster: poster ? { key: poster, url: poster, file: null, preview: poster } : null,
  };
}

export default function PosterForm({ jobId = "" }) {
  const editing = Boolean(jobId);
  const [form, setForm] = useState(blank);
  const [ready, setReady] = useState(!editing);
  const [missing, setMissing] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeBad, setNoticeBad] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;
    let live = true;
    getJobs().then((list) => {
      if (!live) return;
      const job = list.find((item) => item.id === jobId);
      if (!job) setMissing(true);
      else setForm(fromJob(job));
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, [editing, jobId]);

  const onSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !(form.poster?.file || form.poster?.url)) {
      setNoticeBad(true);
      setNotice("A title and a poster are required.");
      return;
    }
    setSaving(true);
    let poster = form.poster?.url || "";
    if (form.poster?.file) {
      const uploaded = await uploadImage(form.poster.file);
      poster = uploaded.url;
    }
    const payload = {
      title: form.title.trim(),
      isOpen: form.isOpen,
      poster,
      image: poster,
    };
    const saved = editing ? await updateJob(jobId, payload) : await createJob(payload);
    setSaving(false);
    setNoticeBad(!saved?.persisted);
    setNotice(
      saved?.persisted
        ? "Saved in this browser. An open poster shows on the careers page."
        : "Could not store this in the browser. It will disappear after a refresh — use a smaller image."
    );
    if (saved?.persisted && !editing) setForm(blank());
    if (saved?.persisted && editing) {
      setForm((current) => ({
        ...current,
        poster: poster ? { key: poster, url: poster, file: null, preview: poster } : null,
      }));
    }
  };

  if (!ready) {
    return <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-bone-600">Loading</p>;
  }

  if (missing) {
    return (
      <div>
        <p className="text-[17px] leading-relaxed text-bone-600">This career is not on the page.</p>
        <Link href="/admin/careers" className="btn btn-ghost mt-8">
          Back to careers
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
          {editing ? "Edit career" : "Add career"}
        </h2>
        <Link href="/admin/careers" className={`${GHOST} !px-5 !py-3`}>
          Back to careers
        </Link>
      </div>

      <div className="grid items-stretch gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="relative flex flex-col overflow-hidden lg:col-span-6">
          <p
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none font-display text-[72px] uppercase leading-none tracking-[-0.04em] text-bone/5 sm:text-[140px]"
          >
            Career
          </p>

          <label className="relative z-[1] mb-8 block">
            <span className={LABEL}>Title</span>
            <input className={TITLE_FIELD} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label className="relative z-[1] flex items-center gap-3 border border-bone/15 bg-ink px-4 py-4">
            <input
              type="checkbox"
              checked={form.isOpen}
              onChange={(e) => setForm({ ...form, isOpen: e.target.checked })}
              className="h-5 w-5 accent-steel"
            />
            <span className={LABEL}>Show on the careers page</span>
          </label>

          {notice ? (
            <p className={`relative z-[1] mt-8 text-[13px] font-semibold uppercase tracking-[0.14em] ${noticeBad ? "text-sand" : "text-steel"}`}>
              {notice}
            </p>
          ) : null}

          <div className="relative z-[1] mt-auto border-t border-bone/10 pt-8">
            <button type="submit" className="btn btn-solid !px-8 !py-4" disabled={saving}>
              {saving ? "Saving" : editing ? "Update career" : "Add career"}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:col-span-6">
          <p className={LABEL}>Poster</p>
          <div className={form.poster ? `${WELL_FULL} on-dark aspect-[3/4] max-h-[720px] w-full bg-ink` : `${WELL_EMPTY} aspect-[3/4] max-h-[720px] w-full`}>
            {form.poster ? (
              <>
                <Cover src={form.poster.preview} alt="" sizes="(min-width: 1024px) 40vw, 100vw" fit="contain" className="absolute inset-0" />
                <button
                  type="button"
                  className={`${GHOST} !absolute !right-2 !top-2 z-10 !px-3 !py-1.5`}
                  onClick={() => {
                    if (form.poster?.file && form.poster.preview?.startsWith("blob:")) {
                      URL.revokeObjectURL(form.poster.preview);
                    }
                    setForm((current) => ({ ...current, poster: null }));
                  }}
                >
                  Remove
                </button>
              </>
            ) : (
              <p className={WELL_COPY}>Poster appears here</p>
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
                if (form.poster?.file && form.poster.preview?.startsWith("blob:")) {
                  URL.revokeObjectURL(form.poster.preview);
                }
                setForm((current) => ({ ...current, poster: shot(file) }));
              }}
            />
          </label>
        </div>
      </div>
    </form>
  );
}
