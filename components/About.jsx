"use client";

import { useEffect, useRef } from "react";
import Media from "@/components/Media";
import { initGsap, splitWords, countUp } from "@/lib/anim";
import { company, stats, values } from "@/lib/data";

const PARA =
  "Ambika Global Traders is a Nagercoil-based building material supplier. Cement, bricks, sand and steel, available for retail and wholesale. We serve a diverse variety of customers in and around Nagercoil, and every time a customer visits our yard, we make sure they receive first-class service.";

export default function About() {
  const root = useRef(null);

  useEffect(() => {
    const { gsap, ScrollTrigger } = initGsap();

    const ctx = gsap.context(() => {
      /* Word-by-word illumination as the paragraph passes the viewport */
      const para = root.current.querySelector("[data-para]");
      const words = splitWords(para);
      gsap.set(words, { opacity: 0.16 });
      gsap.to(words, {
        opacity: 1,
        ease: "none",
        stagger: 0.5,
        scrollTrigger: {
          trigger: para,
          start: "top 78%",
          end: "bottom 55%",
          scrub: 0.5,
        },
      });

      /* Heading mask reveal */
      gsap.fromTo(
        ".ab-line > span",
        { yPercent: 112 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.09,
          scrollTrigger: { trigger: ".ab-head", start: "top 82%" },
        }
      );

      /* Image parallax + clip reveal */
      gsap.fromTo(
        ".ab-img-inner",
        { scale: 1.35, yPercent: 8 },
        {
          scale: 1,
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: ".ab-img", start: "top bottom", end: "bottom top", scrub: true },
        }
      );
      gsap.fromTo(
        ".ab-img",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          ease: "power4.inOut",
          scrollTrigger: { trigger: ".ab-img", start: "top 85%" },
        }
      );

      /* Stat counters */
      root.current.querySelectorAll("[data-count]").forEach((el) => {
        const to = parseFloat(el.dataset.count);
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => countUp(gsap, el, to, { duration: 1.8 }),
        });
      });

      /* Value rows slide in */
      gsap.fromTo(
        ".ab-value",
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".ab-values", start: "top 80%" },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={root} className="relative bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        {/* ---------- Header ---------- */}
        <div className="ab-head grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6">Who we are</p>
            <h2 className="display text-[9.4vw] leading-[1.05] text-bone md:text-[3.9vw]">
              <span className="ab-line mask-line">
                <span className="block">The yard</span>
              </span>
              <span className="ab-line mask-line">
                <span className="block text-steel-400">behind the</span>
              </span>
              <span className="ab-line mask-line">
                <span className="block">build.</span>
              </span>
            </h2>
          </div>

          <div className="lg:col-span-7 lg:pt-16">
            <p
              data-para
              className="text-[19px] leading-[1.55] text-bone md:text-[26px] md:leading-[1.45]"
            >
              {PARA}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a href="/#products" className="btn btn-ghost">
                What we stock
              </a>
              <a href={`tel:${company.phones[1].replace(/\s/g, "")}`} className="btn btn-ghost">
                {company.phones[1]}
              </a>
            </div>
          </div>
        </div>

        {/* ---------- Image + stats ---------- */}
        <div className="mt-20 grid gap-10 md:mt-28 lg:grid-cols-12 lg:gap-14">
          <div className="ab-img graded-wrap relative aspect-[4/5] overflow-hidden lg:col-span-5">
            <Media
              src="/img/about-1.webp"
              alt="Reinforcement steel being tied on site"
              sizes="(max-width: 1024px) 100vw, 40vw"
              scrim="bottom"
              frame
              className="ab-img-inner absolute inset-0"
            />
            <div className="absolute bottom-0 left-0 z-10 p-6 md:p-8">
              <p className="font-mono text-[11px] tracking-[0.12em] text-steel-300 sm:text-[12px] sm:tracking-[0.28em]">
                ERACHAKULAM · NAGERCOIL
              </p>
              <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-bone-600">
                Retail counter and wholesale loading, under one roof since {company.since}.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-px overflow-hidden border border-bone/10 bg-bone/10">
              {stats.map((s) => (
                <div key={s.label} className="bg-ink p-6 md:p-9">
                  <p className="display text-[10vw] leading-none text-bone md:text-[3.2vw]">
                    {s.plain ? (
                      <span className="text-steel-400">{s.value}</span>
                    ) : (
                      <>
                        <span data-count={s.value}>0</span>
                        <span className="text-steel-400">{s.suffix}</span>
                      </>
                    )}
                  </p>
                  <p className="mt-3 font-mono text-[11px] uppercase leading-snug tracking-[0.08em] text-bone-500 sm:text-[12px] sm:tracking-[0.22em]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Mission / vision */}
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="eyebrow mb-3">Mission</p>
                <p className="text-[17px] leading-relaxed text-bone-600">
                  To concentrate continuously on delivering customized solutions for our customers.
                </p>
              </div>
              <div>
                <p className="eyebrow mb-3">Vision</p>
                <p className="text-[17px] leading-relaxed text-bone-600">
                  To be the best at servicing our consumers by providing high-quality, uncompromising
                  products and services.
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="ab-values mt-10 border-t border-bone/10">
              {values.map((v, i) => (
                <div
                  key={v.k}
                  className="ab-value group flex flex-col gap-1 border-b border-bone/10 py-4 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <span className="w-8 shrink-0 font-mono text-[12px] tracking-[0.2em] text-steel">
                    0{i + 1}
                  </span>
                  <span className="w-44 shrink-0 font-display text-base uppercase tracking-wide text-bone">
                    {v.k}
                  </span>
                  <span className="text-sm leading-relaxed text-bone-500">{v.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
