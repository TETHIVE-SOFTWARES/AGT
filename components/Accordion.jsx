"use client";

/**
 * The openings list on Careers and the contact FAQ share this row.
 * Same button, same grid-rows expand, same type.
 */
export default function AccordionRow({ n, title, meta, expanded, onToggle, media, children }) {
  return (
    <article className="border border-bone/10 bg-ink-800">
      {media}
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="flex w-full items-baseline gap-4 px-5 py-6 text-left md:px-7"
      >
        <span className="w-8 shrink-0 font-mono text-[12px] tracking-[0.2em] text-steel">{n}</span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-lg uppercase tracking-wide text-bone md:text-xl">
            {title}
          </span>
          {meta ? (
            <span className="mt-2 block font-mono text-[12px] uppercase tracking-[0.16em] text-bone-500">
              {meta}
            </span>
          ) : null}
        </span>
        <span className="shrink-0 font-mono text-[12px] uppercase tracking-[0.18em] text-bone-500">
          {expanded ? "Close" : "Open"}
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-7 md:px-7">{children}</div>
        </div>
      </div>
    </article>
  );
}
