"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Media from "@/components/Media";
import { initGsap } from "@/lib/anim";
import { products } from "@/lib/data";
import Icon from "@/lib/icons";

export default function Products() {
  const root = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);

  useEffect(() => {
    const { gsap } = initGsap();

    const ctx = gsap.context(() => {
      const scroller = track.current;
      const paint = () => {
        if (!bar.current || !scroller) return;
        const max = scroller.scrollWidth - scroller.clientWidth;
        const progress = max > 0 ? scroller.scrollLeft / max : 0;
        bar.current.style.transform = `scaleX(${progress})`;
      };
      scroller?.addEventListener("scroll", paint, { passive: true });
      paint();

      const cards = gsap.utils.toArray(".pr-card");
      const seen = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const strokes = entry.target.querySelectorAll(".pr-icon [pathLength]");
            if (strokes.length) {
              gsap.to(strokes, {
                strokeDashoffset: 0,
                duration: 1.1,
                ease: "power2.inOut",
                stagger: 0.07,
              });
            }
            seen.unobserve(entry.target);
          });
        },
        { root: scroller, threshold: 0.45 }
      );
      cards.forEach((card) => seen.observe(card));

      /* Section heading reveal */
      gsap.fromTo(
        ".pr-head-line > span",
        { yPercent: 112 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        }
      );

      return () => {
        scroller?.removeEventListener("scroll", paint);
        seen.disconnect();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="products" ref={root} className="on-dark relative overflow-hidden bg-ink">
      <div className="flex h-full flex-col">
        {/* ---------- Heading rail ---------- */}
        <div className="shrink-0 px-5 pb-6 pt-24 md:px-10 md:pb-8 md:pt-28">
          <div className="mx-auto flex max-w-[1680px] items-start justify-between gap-6">
            <div>
              <p className="eyebrow mb-3 md:mb-4">What we do</p>
              <h2 className="display text-[6.6vw] leading-[1.05] text-bone md:text-[min(2.7vw,40px)]">
                <span className="pr-head-line mask-line">
                  <span className="block">We give the best</span>
                </span>
                <span className="pr-head-line mask-line">
                  <span className="block text-steel-400">made affordable.</span>
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* ---------- Horizontal track ---------- */}
        <div className="flex min-h-0 flex-1 items-stretch pb-10 md:pb-12">
          <div
            ref={track}
            className="flex w-full snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-5 pb-4 md:gap-6 md:px-10"
          >
          {products.map((p) => (
            <article
              key={p.n}
              className="pr-card p-card scanline group relative h-[68vh] min-h-[440px] max-h-[640px] w-[84vw] shrink-0 snap-start overflow-hidden border border-bone/10 bg-ink-700 sm:w-[54vw] md:w-[32vw] lg:w-[25vw]"
            >
              <Media
                src={p.img}
                alt={p.title}
                sizes="(max-width: 768px) 78vw, 28vw"
                scrim={false}
                className="pr-media absolute inset-0"
              />

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--c-ink)/0.3)_0%,rgb(var(--c-ink)/0)_34%,rgb(var(--c-ink)/0.88)_100%)]" />
              <div className="absolute inset-0 bg-steel/0 transition-colors duration-500 group-hover:bg-steel/[0.07]" />

              {/* Index */}
              <span className="absolute left-5 top-5 z-10 font-mono text-[13px] tracking-[0.25em] text-bone-600 md:left-6 md:top-6">
                {p.n}
              </span>

              {/* Icon, drawn on when the card reaches the viewport */}
              <span className="pr-icon icon-draw absolute right-5 top-5 z-10 text-steel-300 md:right-6 md:top-6">
                <Icon name={p.icon} size={40} />
              </span>

              {/* Hairline that draws in on hover */}
              <span className="absolute left-5 top-12 z-10 block h-px w-0 bg-steel transition-all duration-700 group-hover:w-14 md:left-6" />

              {/* Framing brackets */}
              <span className="brackets pointer-events-none absolute inset-0 z-10">
                <span className="bk-tl" />
                <span className="bk-tr" />
                <span className="bk-bl" />
                <span className="bk-br" />
              </span>

              {/* Body */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-7">
                <h3 className="display text-2xl leading-[1.05] text-bone md:text-[min(1.65vw,27px)]">
                  {p.title}
                </h3>
                <p className="mt-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.08em] text-steel-300 sm:text-[12px] sm:tracking-[0.14em]">
                  {p.brands}
                </p>
                <p className="mt-4 max-h-28 overflow-hidden text-[13px] leading-relaxed text-bone-600 opacity-100 md:max-h-0 md:opacity-0 md:transition-all md:duration-700 md:group-hover:max-h-40 md:group-hover:opacity-100">
                  {p.desc}
                </p>
              </div>
            </article>
          ))}

            {/* Tail card — closes the sequence with a call to action */}
            <article className="relative flex h-[68vh] min-h-[440px] max-h-[640px] w-[84vw] shrink-0 snap-start flex-col justify-between border border-steel/25 bg-steel-700/50 p-6 sm:w-[54vw] md:w-[32vw] md:p-9 lg:w-[25vw]">
              <span className="font-mono text-[13px] tracking-[0.25em] text-steel-300">
                {String(products.length + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="display text-3xl leading-[1.05] text-bone md:text-[min(1.85vw,30px)]">
                  Need the
                  <br />
                  full list?
                </h3>
                <p className="mt-4 max-w-[30ch] text-[13px] leading-relaxed text-bone-600">
                  Tile adhesive, gates, hardware and everything in between. Tell us the stage you
                  are at and we will send an itemised quote.
                </p>
                <Link href="/contact" className="btn btn-solid mt-7">
                  Request a quote
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* ---------- Progress ---------- */}
      <div className="px-5 pb-8 md:px-10">
        <div className="mx-auto max-w-[1680px]">
          <div className="h-px w-full bg-bone/12">
            <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-steel" />
          </div>
        </div>
      </div>
    </section>
  );
}
