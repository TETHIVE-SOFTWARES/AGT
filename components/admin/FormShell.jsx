export default function FormShell({ children }) {
  return (
    <div className="on-dark relative z-10 -mt-12 border border-bone/10 bg-ink-800 p-6 [color-scheme:dark] md:p-12">
      <FrameMarks />
      {children}
    </div>
  );
}

export function FrameMarks({ className = "h-3 w-3" }) {
  const edge = `absolute ${className} border-steel/70`;
  return (
    <span className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
      <span className={`${edge} left-0 top-0 border-l border-t`} />
      <span className={`${edge} right-0 top-0 border-r border-t`} />
      <span className={`${edge} bottom-0 left-0 border-b border-l`} />
      <span className={`${edge} bottom-0 right-0 border-b border-r`} />
    </span>
  );
}

export function EmptyWell({ children, className = "" }) {
  return (
    <div
      className={`group relative border border-dashed border-bone/15 bg-ink transition-colors hover:border-steel/60 ${className}`}
    >
      <FrameMarks className="h-2.5 w-2.5" />
      <p className="absolute inset-0 flex items-center justify-center px-6 text-center font-mono text-sm uppercase tracking-[0.2em] text-bone/50">
        {children}
      </p>
    </div>
  );
}
