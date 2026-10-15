"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function PosterLightbox({ job, onClose }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!job) return null;

  return (
    <div
      className="on-dark fixed inset-0 z-[80] flex items-center justify-center bg-ink/92 p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={`${job.title} poster`}
      onClick={onClose}
    >
      <button type="button" onClick={onClose} className="btn btn-ghost absolute right-4 top-4 md:right-8 md:top-8">
        Close
      </button>
      <div
        className="relative aspect-[3/4] h-[min(86vh,920px)] overflow-hidden rounded-2xl border border-bone/10 bg-ink-800"
        onClick={(event) => event.stopPropagation()}
      >
        {job.poster ? (
          <Image
            src={job.poster}
            alt={`${job.title} hiring poster`}
            fill
            sizes="(max-width: 768px) 100vw, 70vw"
            className="object-contain"
          />
        ) : (
          <GeneratedPoster job={job} />
        )}
      </div>
    </div>
  );
}

export function GeneratedPoster({ job }) {
  const lines = [job.qualification, job.experience, job.workingHours].filter(Boolean);
  return (
    <div className="on-dark absolute inset-0 flex flex-col justify-between bg-ink p-6 md:p-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url(/img/texture-concrete.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Image
        src="/brands/agt-logo.png"
        alt=""
        width={56}
        height={72}
        className="relative h-12 w-auto"
      />
      <div className="relative">
        <p className="font-display text-[8vw] uppercase leading-[1.05] tracking-wide text-bone md:text-4xl">
          We are hiring
        </p>
        <p className="mt-3 font-display text-xl uppercase leading-tight tracking-wide text-steel-400 md:text-2xl">
          {job.title}
        </p>
      </div>
      {lines.length ? (
        <ul className="relative space-y-2 font-mono text-[12px] uppercase tracking-[0.16em] text-bone-600">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
