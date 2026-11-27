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
              Three districts.
              <br />
              <span className="text-steel-400">Covered properly.</span>
            </h2>
          </div>
          <div className="self-end lg:col-span-5">
            <p className="max-w-[44ch] text-[17px] leading-relaxed text-bone-600">
              Loads leave the Erachakulam yard daily for sites across Kanyakumari, Thoothukudi and
              Tirunelveli — and if you sit just outside, call us anyway.
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

        <div className="ar-grid mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 md:mt-24 md:gap-5">
          {areas.map((a) => (
            <div
              key={a}
              className="ar-item flex min-h-[88px] items-center justify-center border border-bone/20 bg-ink px-5 py-6 text-center transition-colors duration-500 hover:border-steel md:min-h-[120px] md:px-8 md:py-10"
            >
              <span className="font-mono text-[15px] font-semibold uppercase leading-snug tracking-[0.14em] text-bone md:text-[18px] md:tracking-[0.18em]">
                {a}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
