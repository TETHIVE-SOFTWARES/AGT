"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Media from "@/components/Media";
import { initGsap } from "@/lib/anim";
import { blurFor } from "@/lib/blur";

/**
 * Inner-page hero. Same photo, gradient and slow zoom as the homepage hero,
 * shortened to about half a viewport.
 */
export default function PageHero({ image, eyebrow, title, accent, intro, crumb, parent, layout, actions, imageAlt = "" }) {
  const root = useRef(null);
  const blur = image ? blurFor(image) : undefined;
  const uploaded = image?.startsWith("data:") || image?.startsWith("blob:");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const { gsap } = initGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ph-rise",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }
      );
      gsap.fromTo(
        ".ph-shot",
        { scale: 1.18 },
        { scale: 1.05, duration: 14, ease: "power2.out" }
      );
    }, root);
    return () => ctx.revert();
  }, [title, image, layout]);

  if (layout === "split") {
    return (
      <section ref={root} className="on-dark relative bg-ink pt-28 md:pt-36">
        <div className="mx-auto grid max-w-[1680px] items-start gap-10 px-5 pb-16 md:px-10 md:pb-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="ph-rise mb-6 break-words font-mono text-[12px] uppercase tracking-[0.12em] text-bone-500 sm:tracking-[0.24em]">
              <Link href="/" className="link-sweep text-bone-600 transition-colors hover:text-bone">
                Home
              </Link>
              <span className="mx-2 text-bone-400">/</span>
              <span className="text-bone">{crumb}</span>
            </p>
            <p className="ph-rise eyebrow mb-5 md:mb-7">{eyebrow}</p>
            <h1 className="ph-rise display max-w-[14ch] break-words text-[clamp(2.15rem,10vw,3.4rem)] leading-[1.02] text-bone md:text-[4.4vw]">
              {title}
            </h1>
            {intro ? (
              <p className="ph-rise mt-6 max-w-[60ch] text-[17px] leading-relaxed text-bone-600 md:mt-8 md:text-base">
                {intro}
              </p>
            ) : null}
            {actions ? <div className="ph-rise mt-8">{actions}</div> : null}
          </div>
          <div className="graded-wrap relative aspect-[4/3] overflow-hidden lg:col-span-7">
            <div className="ph-shot absolute inset-[-8%] will-change-transform">
              <Media
                src={image}
                alt={imageAlt}
                sizes="(max-width: 1024px) 100vw, 58vw"
                scrim="bottom"
                priority
                className="absolute inset-0"
              />
            </div>
            <span className="pointer-events-none absolute inset-0 z-[2]">
              <span className="absolute inset-0 border border-bone/15" />
              <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-steel-300/70" />
              <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-steel-300/70" />
              <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-steel-300/70" />
              <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-steel-300/70" />
            </span>
            <p className="absolute bottom-0 left-0 z-10 p-6 font-mono text-[12px] tracking-[0.28em] text-steel-300 md:p-8">
              ERACHAKULAM · NAGERCOIL
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={root} className="on-dark relative min-h-[50vh] overflow-hidden bg-ink md:min-h-[60vh]">
      <div className="ph-shot absolute inset-[-8%] will-change-transform">
        {image && !uploaded ? (
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            placeholder={blur ? "blur" : "empty"}
            blurDataURL={blur}
            className="object-cover"
          />
        ) : image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div
            className="h-full w-full bg-ink-800"
            style={{
              backgroundImage: "url(/img/texture-concrete.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--c-ink)/0.34)_0%,rgb(var(--c-ink)/0)_26%,rgb(var(--c-ink)/0.1)_48%,rgb(var(--c-ink)/0.62)_78%,rgb(var(--c-ink)/0.94)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(94deg,rgb(var(--c-ink)/0.72)_0%,rgb(var(--c-ink)/0.3)_34%,transparent_62%)]" />

      <div className="relative z-10 mx-auto flex min-h-[50vh] max-w-[1680px] flex-col justify-end px-5 pb-16 pt-28 md:min-h-[60vh] md:px-10 md:pb-16 md:pt-36">
        <p className="ph-rise mb-6 break-words font-mono text-[12px] uppercase tracking-[0.12em] text-bone-500 sm:tracking-[0.24em]">
          <Link href="/" className="link-sweep text-bone-600 transition-colors hover:text-bone">
            Home
          </Link>
          {parent ? (
            <>
              <span className="mx-2 text-bone-400">/</span>
              <Link
                href={parent.href}
                className="link-sweep text-bone-600 transition-colors hover:text-bone"
              >
                {parent.label}
              </Link>
            </>
          ) : null}
          <span className="mx-2 text-bone-400">/</span>
          <span className="text-bone">{crumb}</span>
        </p>

        <p className="ph-rise eyebrow mb-5 md:mb-7">{eyebrow}</p>

        <h1 className="ph-rise display break-words text-bone">
          <span className="block text-[clamp(2.15rem,10vw,3.4rem)] leading-[1.02] md:text-[6.1vw]">{title}</span>
          {accent ? (
            <span className="block text-[clamp(2.15rem,10vw,3.4rem)] leading-[1.02] text-steel-400 md:text-[6.1vw]">
              {accent}
            </span>
          ) : null}
        </h1>

        {intro ? (
          <p className="ph-rise mt-6 max-w-[46ch] text-[17px] leading-relaxed text-bone-600 md:mt-8 md:text-base">
            {intro}
          </p>
        ) : null}
        {actions ? <div className="ph-rise mt-8">{actions}</div> : null}
      </div>
    </section>
  );
}
