"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Cover from "@/components/Cover";
import ImageSlideshow from "@/components/ImageSlideshow";
import { initGsap } from "@/lib/anim";
import { getEvents } from "@/lib/api";
import { events as seedEvents, eventTime } from "@/data/events";

function newest(list) {
  return [...list].sort((a, b) => eventTime(b) - eventTime(a));
}

function EventPhoto({ src, alt, sizes, frame = false, natural = false }) {
  const [failed, setFailed] = useState(false);
  const missing = !src || failed;
  const naturalClass = "mx-auto block h-auto w-auto max-h-[78vh] max-w-full object-contain md:max-h-[70vh]";

  if (missing) {
    return (
      <div className={`on-dark overflow-hidden bg-ink ${natural ? "flex min-h-[240px] w-full items-center justify-center" : "absolute inset-0"}`}>
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "url(/img/texture-concrete.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image src="/brands/agt-logo.png" alt="" width={56} height={72} className="h-14 w-auto" />
        </div>
      </div>
    );
  }

  if (src.startsWith("data:") || src.startsWith("blob:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={natural ? naturalClass : "absolute inset-0 h-full w-full object-contain"}
        onError={() => setFailed(true)}
      />
    );
  }

  if (natural) {
    return (
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1200}
        sizes={sizes}
        className={naturalClass}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Cover
      src={src}
      alt={alt}
      sizes={sizes}
      frame={frame}
      fit="contain"
      className="absolute inset-0"
    />
  );
}

function slidesFor(events) {
  const slides = [];
  events.forEach((event) => {
    const images = event.images?.length ? event.images : [{ src: "", alt: event.title }];
    images.forEach((image, i) => {
      slides.push({ key: `${event.id}-${i}`, event, image });
    });
  });
  return slides;
}

function EventSlideshow({ events }) {
  const slides = slidesFor(events);
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => {
    setIndex((current) => (count ? current % count : 0));
  }, [count]);

  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 5000);
    return () => clearInterval(timer);
  }, [count]);

  if (!count) return null;
  const slide = slides[index] || slides[0];
  const event = slide.event;

  return (
    <div
      className="relative mb-8 overflow-hidden border border-bone/10 bg-ink md:mb-12"
      aria-roledescription="carousel"
      aria-label="Event photographs"
    >
      <div className="ev-shot on-dark relative flex items-center justify-center bg-ink">
        {slides.map((item, i) => (
          <div
            key={item.key}
            className={`flex w-full justify-center transition-opacity duration-700 ${
              i === index ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
            }`}
            style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
            aria-hidden={i !== index}
          >
            <EventPhoto natural src={item.image.src} alt={item.image.alt || ""} sizes="(max-width: 768px) 100vw, 1200px" />
          </div>
        ))}
      </div>
      <div className="border-t border-bone/10 bg-ink px-5 py-6 md:px-10 md:py-8">
        <p className="font-mono text-[13px] tracking-[0.2em] text-steel">{event.date}</p>
        <h2 className="display mt-3 max-w-[16ch] break-words text-[clamp(1.7rem,7vw,2.4rem)] leading-[1.05] text-bone md:text-[3vw]">{event.title}</h2>
      </div>
      <div className="flex gap-2 px-5 py-4 md:px-10">
        {events.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show ${item.title}`}
            aria-current={event.id === item.id ? "true" : undefined}
            onClick={() => {
              const next = slides.findIndex((slide) => slide.event.id === item.id);
              setIndex(next < 0 ? 0 : next);
            }}
            className={`h-px flex-1 transition-colors ${event.id === item.id ? "bg-steel" : "bg-bone/20"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function EventsIndex() {
  const root = useRef(null);
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
        <EventSlideshow events={events} />

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
