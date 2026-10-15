"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Cover from "@/components/Cover";
import ImageSlideshow from "@/components/ImageSlideshow";
import Lightbox from "@/components/Lightbox";
import { getEventBySlug } from "@/lib/api";

export default function EventArticle({ slug, initial = undefined }) {
  const [event, setEvent] = useState(initial);
  const [resolved, setResolved] = useState(initial != null);
  const [light, setLight] = useState(null);
  const [photo, setPhoto] = useState(0);

  useEffect(() => {
    let live = true;
    getEventBySlug(slug).then((found) => {
      if (!live) return;
      setEvent(found);
      setResolved(true);
    });
    return () => {
      live = false;
    };
  }, [slug]);

  if (!resolved || event === undefined) {
    return (
      <section className="bg-ink px-5 py-40">
        <p className="font-mono text-[13px] uppercase tracking-[0.2em] text-bone-500">Loading the record</p>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="bg-ink px-5 py-40">
        <p className="eyebrow mb-5">07 — Record</p>
        <h1 className="display text-4xl text-bone">This record is not on file.</h1>
        <Link href="/events" className="btn btn-ghost mt-8">
          All events
        </Link>
      </section>
    );
  }

  const images = event.images?.length
    ? event.images
    : (event.gallery || []).filter(Boolean).map((src) => ({ src, alt: event.title }));

  return (
    <>
      <PageHero
        image="/img/event-lane.webp"
        imageAlt="Cement bags and steel bars along a yard lane at dusk"
        eyebrow={event.date}
        title={event.title}
        intro={event.summary}
        crumb={event.title}
        parent={{ href: "/events", label: "Events" }}
      />

      <section className="hair-t relative bg-ink-800 py-16 md:py-28">
        <div className="mx-auto grid max-w-[1680px] gap-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ImageSlideshow
              images={images}
              title={event.title}
              variant="full"
              fit="contain"
              aspectRatio="4 / 3"
              index={photo}
              onIndex={setPhoto}
              onImageClick={() => setLight(photo)}
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="on-dark border border-bone/10 bg-ink"
            />
          </div>

          <div className="lg:col-span-5">
            <p className="eyebrow mb-5">The record</p>
            <div className="space-y-4">
              {String(event.description || "")
                .split(/\n\n+/)
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph} className="text-[17px] leading-relaxed text-bone-600 md:text-base">
                    {paragraph}
                  </p>
                ))}
            </div>

            <Link href="/events" className="btn btn-ghost mt-10">
              All events
            </Link>
          </div>
        </div>

        {images.length ? (
          <div className="mx-auto mt-16 max-w-[1680px] px-5 md:mt-24 md:px-10">
            <p className="eyebrow mb-6">Photographs</p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {images.map((image, i) => (
                <button
                  key={`${image.src}-${i}`}
                  type="button"
                  onClick={() => setPhoto(i)}
                  aria-current={i === photo ? "true" : undefined}
                  className={`group relative aspect-[4/3] overflow-hidden border text-left ${
                    i === photo ? "border-steel" : "border-bone/10"
                  }`}
                >
                  <Cover src={image.src} alt={image.alt || ""} sizes="(max-width: 768px) 50vw, 33vw" fit="contain" className="on-dark absolute inset-0 bg-ink" />
                  <span className="absolute inset-x-0 bottom-0 block h-px w-0 bg-steel transition-all duration-700 group-hover:w-full" />
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {light !== null ? (
        <Lightbox
          images={images}
          index={light}
          onClose={() => setLight(null)}
          onIndex={setLight}
        />
      ) : null}
    </>
  );
}
