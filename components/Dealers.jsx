"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { initGsap } from "@/lib/anim";
import { brandLogos } from "@/lib/data";

function LogoRow({ logos, reverse, rowRef }) {
  const Set = () => (
    <>
      {logos.map((b, i) => (
        <div
          key={`${b}-${i}`}
          className="flex h-24 w-[180px] shrink-0 items-center justify-center px-6 md:h-28 md:w-[230px]"
        >
          <Image
            src={`/brands/${b}.png`}
            alt=""
            width={150}
            height={150}
            className="h-full w-auto max-w-full object-contain"
          />
        </div>
      ))}
    </>
  );

  return (
    <div ref={rowRef} className="marquee-track" data-reverse={reverse ? "1" : "0"}>
      <Set />
      <Set />
    </div>
  );
}

export default function Dealers() {
  const root = useRef(null);
  const r1 = useRef(null);
  const r2 = useRef(null);

  useEffect(() => {
    const { gsap } = initGsap();
    const ctx = gsap.context(() => {
      [r1, r2].forEach((ref, idx) => {
        const el = ref.current;
        if (!el) return;
        const half = el.scrollWidth / 2;
        gsap.set(el, { x: idx === 1 ? -half : 0 });
        gsap.to(el, {
          x: idx === 1 ? 0 : -half,
          duration: 34 + idx * 6,
          ease: "none",
          repeat: -1,
        });
      });

      gsap.fromTo(
        ".dl-head > *",
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const half = Math.ceil(brandLogos.length / 2);

  return (
    <section ref={root} className="hair-b relative overflow-hidden bg-ink-800 py-20 md:py-28">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="dl-head flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-5">Our authorized dealers</p>
            <h2 className="display text-[7.8vw] leading-[1.05] text-bone md:text-[3vw]">
              Brands we are
              <br />
              <span className="text-steel-400">accountable for.</span>
            </h2>
          </div>
          <p className="max-w-[42ch] text-sm leading-relaxed text-bone-600">
            We hold authorised dealerships rather than buying off the open market. It is the only way
            to guarantee the bag you receive is the bag the manufacturer made.
          </p>
        </div>
      </div>

      <div className="relative mt-14 space-y-4 md:mt-20 md:space-y-6">
        {/* Fades mask the loop seam at both edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-800 to-transparent md:w-48" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-800 to-transparent md:w-48" />

        <LogoRow logos={brandLogos.slice(0, half)} rowRef={r1} />
        <LogoRow logos={brandLogos.slice(half)} rowRef={r2} reverse />
      </div>
    </section>
  );
}
