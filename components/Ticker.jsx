"use client";

import { useEffect, useRef } from "react";
import { initGsap } from "@/lib/anim";
import { tickerItems } from "@/lib/data";

/**
 * Infinite marquee whose speed and direction react to scroll velocity —
 * the detail that makes a strip feel alive rather than looped.
 */
export default function Ticker() {
  const track = useRef(null);

  useEffect(() => {
    const { gsap, ScrollTrigger } = initGsap();
    const el = track.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const half = el.scrollWidth / 2;
      const tween = gsap.to(el, {
        x: -half,
        duration: 26,
        ease: "none",
        repeat: -1,
        modifiers: { x: (x) => `${parseFloat(x) % half}px` },
      });

      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-3.2, 3.2, self.getVelocity() / 320);
          tween.timeScale(1 + Math.abs(v));
          gsap.to(tween, {
            timeScale: 1,
            duration: 0.9,
            overwrite: true,
            onStart: () => tween.timeScale(1 + Math.abs(v)),
          });
        },
      });

      return () => {
        tween.kill();
        st.kill();
      };
    }, track);

    return () => ctx.revert();
  }, []);

  const Row = () => (
    <>
      {tickerItems.map((t, i) => (
        <span key={`${t}-${i}`} className="flex shrink-0 items-center">
          <span className="display px-6 text-[5.4vw] leading-none text-bone md:px-8 md:text-[3.1vw]">
            {t}
          </span>
          <span className="h-2 w-2 shrink-0 rotate-45 bg-steel" />
        </span>
      ))}
    </>
  );

  return (
    <section className="on-dark hair-t hair-b relative overflow-hidden bg-ink-800">
      <div className="sprockets" />

      <div className="relative py-4 md:py-6">
        <div ref={track} className="marquee-track items-center">
          <Row />
          <Row />
        </div>

        {/* Edge falloff, as if the strip runs past the gate */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-ink-800 to-transparent md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-ink-800 to-transparent md:w-40" />
      </div>

      <div className="sprockets" />
    </section>
  );
}
