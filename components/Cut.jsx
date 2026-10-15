"use client";

import { useEffect, useRef } from "react";
import { initGsap } from "@/lib/anim";

/**
 * A chapter marker between sections — the slate between takes.
 * Keeps the long scroll legible and gives each section a cut rather than a seam.
 */
export default function Cut({ n, label, note }) {
  const root = useRef(null);

  useEffect(() => {
    const { gsap } = initGsap();
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 92%" } })
        .fromTo(
          ".cut-rule",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.3, ease: "power4.inOut" }
        )
        .fromTo(
          ".cut-text",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: "power3.out" },
          "-=0.95"
        )
        .fromTo(
          ".cut-tick",
          { scaleY: 0 },
          { scaleY: 1, duration: 0.5, stagger: 0.03, ease: "power2.out" },
          "-=0.7"
        );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative bg-ink">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="relative flex items-center gap-5 py-7 md:py-9">
          <span className="cut-text font-mono text-[12px] tracking-[0.3em] text-steel">{n}</span>

          {/* Perforation ticks, like frame edges on a strip */}
          <span className="flex shrink-0 items-center gap-[5px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="cut-tick block h-2.5 w-px origin-center bg-bone/25" />
            ))}
          </span>

          <span className="cut-text font-mono text-[12px] uppercase tracking-[0.3em] text-bone-500">
            {label}
          </span>

          <span className="cut-rule h-px flex-1 bg-gradient-to-r from-bone/25 via-bone/10 to-transparent" />

          {note ? (
            <span className="cut-text hidden font-mono text-[12px] uppercase tracking-[0.22em] text-bone-500 md:block">
              {note}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
