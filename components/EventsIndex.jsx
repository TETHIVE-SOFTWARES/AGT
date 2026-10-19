"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ImageSlideshow from "@/components/ImageSlideshow";
import { initGsap } from "@/lib/anim";
import { getEvents } from "@/lib/api";
import { events as seedEvents, eventTime } from "@/data/events";

function newest(list) {
  return [...list].sort((a, b) => eventTime(b) - eventTime(a));
}

export default function EventsIndex() {
  const root = useRef(null);
  const film = useRef(null);
  const [events, setEvents] = useState(() => newest(seedEvents));

  useEffect(() => {
    let live = true;
    getEvents().then((list) => {
      if (live) setEvents(list);
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    const video = film.current;
    if (!video) return;
    video.muted = true;
    const start = video.play();
    if (start) start.catch(() => {});
  }, []);

  useEffect(() => {
    const { gsap } = initGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".ev-card").forEach((card, i) => {
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
        const frame = card.querySelector(".ev-frame");
        if (frame) {
          gsap.fromTo(
            frame,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.25,
              ease: "power4.inOut",
              delay: (i % 3) * 0.08,
              scrollTrigger: { trigger: card, start: "top 88%" },
            }
          );
        }
        const media = card.querySelector(".ev-media");
        if (media) {
          gsap.fromTo(
            media,
            { scale: 1 },
            {
              scale: 0.94,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        }
      });
    }, root);
    return () => ctx.revert();
  }, [events]);

  return (
    <section ref={root} className="hair-t relative bg-ink-800 py-24 md:py-36">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="relative mb-8 w-full overflow-hidden md:mb-12">
          <video
            ref={film}
            className="block aspect-video w-full object-cover"
            src="/video/agt-video.mp4"
            autoPlay
            muted
            controls
            playsInline
            preload="auto"
            controlsList="nodownload"
            aria-label="Ambika Global Traders yard film"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="ev-card group relative block overflow-hidden border border-bone/10 bg-ink"
            >
              <div className="ev-frame relative aspect-[4/3] overflow-hidden md:aspect-[16/11]">
                <div className="on-dark pointer-events-none absolute inset-0 bg-ink" aria-hidden="true" />
                <ImageSlideshow
                  images={event.images}
                  title={event.title}
                  variant="card"
                  fit="contain"
                  aspectRatio={null}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="ev-media on-dark absolute inset-0 bg-ink"
                />
              </div>

              <div className="p-5 md:p-7">
                <p className="font-mono text-[13px] tracking-[0.2em] text-steel">{event.date}</p>
                <h2 className="display mt-3 break-words text-2xl leading-[1.05] text-bone md:text-[1.25vw]">
                  {event.title}
                </h2>
                <p className="mt-3 text-[15.5px] leading-relaxed text-bone-500">{event.summary}</p>
                <span className="mt-5 inline-block font-mono text-[12px] uppercase tracking-[0.18em] text-steel">
                  Read the record
                </span>
              </div>

              <span className="absolute inset-x-0 bottom-0 block h-px w-0 bg-steel transition-all duration-700 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
