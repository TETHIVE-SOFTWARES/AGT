"use client";

import { useEffect, useRef } from "react";
import { initGsap } from "@/lib/anim";
import { areas, company } from "@/lib/data";

export default function Areas() {
  const root = useRef(null);

  useEffect(() => {
    const { gsap } = initGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ar-item",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.025,
          scrollTrigger: { trigger: ".ar-grid", start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".ar-head > *",
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        }
      );

      /* Slow drift on the backdrop word */
      gsap.to(".ar-ghost", {
        xPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="areas" ref={root} className="relative overflow-hidden bg-ink py-24 md:py-36">
      {/* Ghost word in the background */}
      <span className="ar-ghost pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[19vw] leading-none text-bone/[0.03]">
        KANYAKUMARI KANYAKUMARI
      </span>

      <div className="relative mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="ar-head grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">Areas we serve</p>
            <h2 className="display text-[9.4vw] leading-[1.05] text-bone md:text-[3.9vw]">
              One district.
              <br />
              <span className="text-steel-400">Covered properly.</span>
            </h2>
          </div>
          <div className="self-end lg:col-span-5">
            <p className="max-w-[44ch] text-[17px] leading-relaxed text-bone-600">
              Loads leave the Erachakulam yard daily. If your site sits inside Kanyakumari district,
              we can get material to it — and if it sits just outside, call us anyway.
            </p>
            <a
              href={company.maps}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost mt-7"
            >
              Open the yard in Maps
            </a>
          </div>
        </div>

        <div className="ar-grid mt-16 grid grid-cols-1 gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2 md:mt-24 md:grid-cols-3 lg:grid-cols-5">
          {areas.map((a) => (
            <div
              key={a}
              className="ar-item group relative flex min-w-0 items-center gap-3 bg-ink px-3 py-4 transition-colors duration-500 hover:bg-ink-700 sm:px-4 sm:py-5 md:px-6 md:py-7"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-steel opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-steel" />
              </span>
              <span className="min-w-0 font-mono text-[11px] uppercase leading-snug tracking-[0.04em] text-bone-600 transition-colors group-hover:text-bone sm:text-[13px] sm:tracking-[0.12em]">
                {a}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
