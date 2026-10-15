"use client";

import { useEffect, useRef } from "react";

export default function ConfirmDialog({ title, body, confirmLabel = "Delete", onConfirm, onCancel }) {
  const cancelRef = useRef(onCancel);
  cancelRef.current = onCancel;

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") cancelRef.current();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgb(var(--c-bone)/0.42)] p-5 backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={() => cancelRef.current()}
    >
      <div
        className="relative w-full max-w-[400px] border border-bone/15 bg-ink p-7 shadow-[0_24px_60px_rgb(var(--c-bone)/0.12)] md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="pointer-events-none absolute inset-0" aria-hidden="true">
          <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-steel/70" />
          <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-steel/70" />
          <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-steel/70" />
          <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-steel/70" />
        </span>

        <p className="eyebrow mb-5">Delete</p>
        <h2 id="confirm-title" className="display text-[2.4rem] leading-[1.02] text-bone">
          {title}
        </h2>
        {body ? <p className="mt-4 max-w-[32ch] text-[15px] leading-relaxed text-bone-600">{body}</p> : null}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button type="button" className="btn btn-ghost justify-center" onClick={() => cancelRef.current()}>
            Cancel
          </button>
          <button type="button" className="btn btn-solid justify-center" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
