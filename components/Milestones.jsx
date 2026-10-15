"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ImageSlideshow from "@/components/ImageSlideshow";
import { initGsap } from "@/lib/anim";
import { getEvents } from "@/lib/api";
import { events as seedEvents } from "@/data/events";

export default function Milestones() {
  const root = useRef(null);
  const [events, setEvents] = useState(seedEvents);

  useEffect(() => {
    let live = true;
    getEvents({ order: "oldest" }).then((list) => {
      if (live && list.length) setEvents(list);
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    const { gsap } = initGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".ms-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 64 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: (i % 3) * 0.08,
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );
        /* The frame wipes open rather than fading in */
        gsap.fromTo(
          card.querySelector(".ms-frame"),
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.25,
            ease: "power4.inOut",
            delay: (i % 3) * 0.08,
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );
        gsap.fromTo(
          card.querySelector(".ms-media"),
          { scale: 1.2 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      gsap.fromTo(
        ".ms-head > *",
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="hair-t relative bg-ink-800 py-24 md:py-36">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="ms-head mb-14 flex flex-col gap-5 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-5">On the record</p>
            <h2 className="display text-[8.6vw] leading-[1.05] text-bone md:text-[3.3vw]">
              Meets, openings
              <br />
              <span className="text-steel-400">and dealerships.</span>
            </h2>
          </div>
          <div className="max-w-[38ch]">
            <p className="text-sm leading-relaxed text-bone-600">
              We put our contractors in the same room as the manufacturers. Here is some of what that
              has looked like.
            </p>
            <Link href="/events" className="btn btn-ghost mt-6">
              View all events
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {events.map((m) => (
            <article
              key={m.slug}
              className="ms-card group relative overflow-hidden border border-bone/10 bg-ink"
            >
              <div className="ms-frame relative aspect-[16/11] overflow-hidden">
                <ImageSlideshow
                  images={m.images}
                  title={m.cardTitle || m.title}
                  variant="card"
                  aspectRatio={null}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="ms-media absolute inset-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <span className="pointer-events-none absolute left-5 top-5 z-30 bg-ink/90 px-3 py-1.5 font-mono text-[12px] tracking-[0.2em] text-steel-300">
                  {m.date}
                </span>
              </div>

              <div className="p-5 md:p-7">
                <h3 className="display text-[4.8vw] leading-[1.05] text-bone md:text-[1.25vw]">
                  {m.cardTitle || m.title}
                </h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-bone-500">{m.summary}</p>
              </div>

              <span className="absolute inset-x-0 bottom-0 block h-px w-0 bg-steel transition-all duration-700 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
