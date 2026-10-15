"use client";

import { useEffect, useRef } from "react";
import Cover from "@/components/Cover";

function asSlide(item) {
  if (!item) return null;
  if (typeof item === "string") return { src: item, alt: "" };
  return item;
}

export default function Lightbox({ images, index, onClose, onIndex }) {
  const slide = asSlide(images[index]);
  const dialogRef = useRef(null);

  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => {
    const root = dialogRef.current;
    const previously = document.activeElement;
    const onKey = (e) => {
      const count = images.length;
      const current = indexRef.current;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((current + 1) % count);
      if (e.key === "ArrowLeft") onIndex((current - 1 + count) % count);
      if (e.key !== "Tab" || !root) return;
      const nodes = [...root.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])")];
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    root?.querySelector("button")?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      if (previously instanceof HTMLElement) previously.focus();
    };
  }, [images.length, onClose, onIndex]);

  if (!slide?.src) return null;

  return (
    <div
      ref={dialogRef}
      className="on-dark fixed inset-0 z-[85] flex items-center justify-center bg-ink/90 p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label="Event photo"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="btn btn-ghost absolute right-4 top-4 !px-5 !py-3"
      >
        Close
      </button>

      <div
        className="relative aspect-[4/3] w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Cover src={slide.src} alt={slide.alt || ""} sizes="90vw" className="absolute inset-0" />
      </div>

      <p aria-live="polite" className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[12px] tracking-[0.2em] text-bone-600">
        {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
      </p>
    </div>
  );
}
