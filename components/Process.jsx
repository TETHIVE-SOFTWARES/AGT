"use client";

import { useEffect, useRef } from "react";
import { initGsap } from "@/lib/anim";
import { process } from "@/lib/data";
import Icon from "@/lib/icons";

export default function Process({ kicker = "From enquiry to site" }) {
  const root = useRef(null);

  useEffect(() => {
    const { gsap } = initGsap();
    const ctx = gsap.context(() => {
      /* Vertical rule draws down as the steps scroll past */
      gsap.fromTo(
        ".pc-rule",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: ".pc-list",
            start: "top 70%",
            end: "bottom 75%",
            scrub: 0.6,
          },
        }
      );

      gsap.utils.toArray(".pc-step").forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0.25, x: -10 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: step, start: "top 78%" },
          }
        );
        gsap.fromTo(
          step.querySelector(".pc-node"),
          { scale: 0 },
          {
            scale: 1,
            duration: 0.6,
            ease: "back.out(2)",
            scrollTrigger: { trigger: step, start: "top 78%" },
          }
        );
        gsap.to(step.querySelectorAll(".pc-icon [pathLength]"), {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.inOut",
          stagger: 0.08,
          scrollTrigger: { trigger: step, start: "top 80%", once: true },
        });
      });

      gsap.fromTo(
        ".pc-head > *",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="hair-t relative bg-ink-800 py-24 md:py-36">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="pc-head mb-16 md:mb-24">
          <p className="eyebrow mb-5">{kicker}</p>
          <h2 className="display max-w-[16ch] text-[8.6vw] leading-[1.05] text-bone md:text-[3.3vw]">
            Four steps, <span className="text-steel-400">no chasing.</span>
          </h2>
        </div>

        <div className="pc-list relative">
          {/* Rail */}
          <span className="absolute left-[7px] top-2 hidden h-[calc(100%-1rem)] w-px bg-bone/10 md:block" />
          <span className="pc-rule absolute left-[7px] top-2 hidden h-[calc(100%-1rem)] w-px origin-top bg-steel md:block" />

          <div className="space-y-px">
            {process.map((s) => (
              <div
                key={s.n}
                className="pc-step grid gap-4 border-b border-bone/10 py-8 md:grid-cols-12 md:gap-8 md:py-10 md:pl-12"
              >
                <span className="pc-node absolute -ml-12 mt-2 hidden h-[15px] w-[15px] rotate-45 border border-steel bg-ink-800 md:block" />

                <span className="flex items-center gap-4 md:col-span-1 md:block">
                  <span className="font-mono text-[13px] tracking-[0.25em] text-steel">{s.n}</span>
                  <span className="pc-icon icon-draw mt-0 block text-steel-300 md:mt-4">
                    <Icon name={s.icon} size={32} />
                  </span>
                </span>
                <h3 className="display break-words text-2xl leading-[1.08] text-bone md:col-span-5 md:text-[1.95vw]">
                  {s.title}
                </h3>
                <p className="max-w-[52ch] text-[17px] leading-relaxed text-bone-600 md:col-span-6">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
