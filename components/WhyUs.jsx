"use client";

import { useEffect, useRef } from "react";
import Media from "@/components/Media";
import { initGsap } from "@/lib/anim";
import { whyPanels } from "@/lib/data";
import Icon from "@/lib/icons";

/**
 * Sticky stacked panels: each one pins, then the next slides over it while the
 * one beneath scales back and dims — the layered transition from the reference clips.
 */
export default function WhyUs() {
  const root = useRef(null);

  useEffect(() => {
    const { gsap } = initGsap();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray(".why-panel");
        panels.forEach((panel, i) => {
          if (i >= panels.length - 1) return;
          gsap.to(panel.querySelector(".why-inner"), {
            scale: 0.94,
            opacity: 0.62,
            filter: "brightness(0.72)",
            ease: "none",
            scrollTrigger: {
              trigger: panels[i + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          });
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray(".why-panel");

        panels.forEach((panel) => {
          /* Content rises as the panel takes the screen */
          gsap.fromTo(
            panel.querySelectorAll(".why-rise"),
            { yPercent: 40, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.07,
              scrollTrigger: { trigger: panel, start: "top 65%" },
            }
          );

          gsap.fromTo(
            panel.querySelector(".why-media"),
            { scale: 1.25 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true },
            }
          );

          const strokes = panel.querySelectorAll(".why-icon [pathLength]");
          gsap.to(strokes, {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: "power2.inOut",
            stagger: 0.1,
            scrollTrigger: { trigger: panel, start: "top 60%", once: true },
          });
        });

        return () => {};
      });

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="why" ref={root} className="on-dark relative bg-ink">
      {/* Intro */}
      <div className="mx-auto max-w-[1680px] px-5 pb-16 pt-24 md:px-10 md:pb-24 md:pt-36">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">How it benefits you</p>
            <h2 className="display text-[9.4vw] leading-[1.05] text-bone md:text-[3.9vw]">
              Three reasons
              <br />
              <span className="text-steel-400">contractors stay.</span>
            </h2>
          </div>
          <p className="max-w-[44ch] self-end text-[17px] leading-relaxed text-bone-600 lg:col-span-5">
            A building material supplier is only worth the trust placed in it. These are the three
            promises we are measured against on every single load that leaves the yard.
          </p>
        </div>
      </div>

      {/* Stacked panels */}
      {whyPanels.map((p, i) => (
        <div key={p.n} className="why-panel w-full md:sticky md:top-0 md:h-screen">
          <div className="why-inner relative grid h-auto w-full grid-rows-[minmax(220px,42vh)_auto] overflow-hidden bg-ink md:h-full md:origin-center md:grid-cols-2 md:grid-rows-1">
            {/* ---------- Text, on its own surface ---------- */}
            <div
              className={`relative z-10 order-2 flex items-center px-5 py-8 md:px-12 md:py-10 lg:px-16 ${
                i % 2 === 1 ? "md:order-2" : "md:order-1"
              }`}
            >
              <div className="max-w-[46ch]">
                <span className="why-rise why-icon icon-draw mb-5 block text-steel-300">
                  <Icon name={p.icon} size={46} />
                </span>

                <p className="why-rise display text-[min(14vw,10.5vh)] leading-[0.85] text-bone/10 md:text-[min(6.6vw,11.5vh)]">
                  {p.n}
                </p>
                <h3 className="why-rise display -mt-[0.22em] text-[clamp(1.85rem,8vw,2.6rem)] leading-[1.05] text-bone md:text-[min(3.4vw,6.4vh)]">
                  {p.title}
                </h3>
                <p className="why-rise mt-5 text-[17px] leading-relaxed text-bone-600 md:mt-7 md:text-[16px]">
                  {p.desc}
                </p>

                <ul className="why-rise mt-6 space-y-px border-t border-bone/10 md:mt-8">
                  {p.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-center gap-4 border-b border-bone/10 py-3.5"
                    >
                      <span className="h-1.5 w-1.5 rotate-45 bg-steel" />
                      <span className="min-w-0 font-mono text-[13px] uppercase leading-snug tracking-[0.06em] text-bone sm:tracking-[0.18em]">
                        {pt}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ---------- Image, uncovered and at full strength ---------- */}
            <div className={`relative order-1 overflow-hidden ${i % 2 === 1 ? "md:order-1" : "md:order-2"}`}>
              <Media
                src={p.img}
                alt={p.title}
                sizes="(max-width: 768px) 100vw, 50vw"
                scrim={false}
                className="why-media absolute inset-0"
              />

              {/* Only a soft blend into the text side — the photo stays clean */}
              <div
                className={`absolute inset-0 max-md:bg-[linear-gradient(180deg,transparent_46%,rgb(var(--c-ink)/0.92)_100%)] ${
                  i % 2 === 1
                    ? "md:bg-[linear-gradient(270deg,rgb(var(--c-ink)/0.9)_0%,transparent_26%)]"
                    : "md:bg-[linear-gradient(90deg,rgb(var(--c-ink)/0.9)_0%,transparent_26%)]"
                }`}
              />

              <div className="rays" />
              <div className="flare flare-streak" style={{ top: "34%", left: "-10%" }} />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
