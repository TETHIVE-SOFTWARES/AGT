import Link from "next/link";

export const LABEL = "font-mono text-xs uppercase tracking-[0.22em] text-bone/70";

export const FIELD = "mt-2 w-full bg-transparent text-[19px] text-bone outline-none";

export const STRIP = "border-b border-bone/15 bg-ink-800/60 px-4 py-3 focus-within:border-steel";

export const GLASS =
  "relative border border-bone/10 bg-ink/55 p-6 backdrop-blur-[3px] [color-scheme:dark] md:p-10";

export const WELL = "relative overflow-hidden border border-bone/10 bg-ink/80";

export function CornerTicks() {
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden="true">
      <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-steel/70" />
      <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-steel/70" />
      <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-steel/70" />
      <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-steel/70" />
    </span>
  );
}

export function EmptyMark({ children }) {
  return (
    <>
      <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-steel/70" aria-hidden="true" />
      <p className={`absolute inset-0 flex items-center justify-center px-6 text-center ${LABEL}`}>{children}</p>
    </>
  );
}

export function FormBar({ backHref, backLabel, submitLabel, saving }) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-bone/10 pt-6">
      <Link href={backHref} className="btn btn-ghost">
        {backLabel}
      </Link>
      <button type="submit" className="btn btn-solid btn-steel" disabled={saving}>
        {saving ? "Saving" : submitLabel}
      </button>
    </div>
  );
}
