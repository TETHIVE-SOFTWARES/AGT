"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function pad(value) {
  return String(value).padStart(2, "0");
}

function Placeholder() {
  return (
    <div className="on-dark absolute inset-0 overflow-hidden bg-ink">
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

function SlideImage({ image, eager, sizes, fit = "cover" }) {
  const src = typeof image?.src === "string" ? image.src : "";
  const fitClass = fit === "contain" ? "object-contain" : "object-cover";
  if (!src) return null;
  if (src.startsWith("data:") || src.startsWith("blob:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={image.alt || ""} className={`absolute inset-0 h-full w-full ${fitClass}`} />
    );
  }

  return (
    <Image
      src={src}
      alt={image.alt || ""}
      fill
      sizes={sizes}
      className={fitClass}
      priority={eager}
      loading={eager ? undefined : "lazy"}
    />
  );
}

export default function ImageSlideshow({
  images = [],
  aspectRatio = "4 / 3",
  variant = "card",
  autoplay = true,
  interval = 3500,
  showThumbnails = false,
  title = "",
  fit = "cover",
  sizes = "(max-width: 768px) 100vw, 50vw",
  index: controlledIndex,
  onIndex,
  onImageClick,
  className = "",
}) {
  const slides = (images || []).filter((image) => image?.src);
  const count = slides.length;
  const rootRef = useRef(null);
  const touchX = useRef(null);
  const swiped = useRef(false);
  const [internal, setInternal] = useState(0);
  const index = controlledIndex ?? internal;
  const indexRef = useRef(index);
  indexRef.current = index;

  const commit = useCallback(
    (next) => {
      if (!count) return;
      const current = indexRef.current;
      const value = ((typeof next === "function" ? next(current) : next) + count) % count;
      if (controlledIndex == null) setInternal(value);
      onIndex?.(value);
    },
    [controlledIndex, count, onIndex]
  );

  useEffect(() => {
    if (count < 2 || !autoplay) return;
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let inView = false;
    let visible = document.visibilityState === "visible";

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.35 }
    );
    observer.observe(root);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    const timer = setInterval(() => {
      if (!visible || !inView) return;
      commit((current) => current + 1);
    }, interval);

    return () => {
      clearInterval(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [autoplay, commit, count, interval]);

  const stop = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const go = (event, step) => {
    stop(event);
    commit((current) => current + step);
  };

  if (!count) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={aspectRatio ? { aspectRatio } : undefined}>
        <Placeholder />
      </div>
    );
  }

  const label = title ? `${title} photographs` : "Photographs";
  const several = count > 1;
  const controlVisibility =
    variant === "card"
      ? "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
      : "opacity-100";

  return (
    <div className={className}>
      <div
        ref={rootRef}
        role="region"
        aria-roledescription={several ? "carousel" : undefined}
        aria-label={label}
        tabIndex={several ? 0 : undefined}
        className="relative overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-steel"
        style={aspectRatio ? { aspectRatio } : { height: "100%" }}
        onKeyDown={(event) => {
          if (!several) return;
          if (event.key === "ArrowRight") go(event, 1);
          if (event.key === "ArrowLeft") go(event, -1);
        }}
        onTouchStart={(event) => {
          touchX.current = event.changedTouches[0]?.clientX ?? null;
          swiped.current = false;
        }}
        onTouchEnd={(event) => {
          if (!several || touchX.current == null) return;
          const dx = (event.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) < 40) return;
          swiped.current = true;
          go(event, dx < 0 ? 1 : -1);
        }}
        onClick={(event) => {
          if (swiped.current) {
            swiped.current = false;
            stop(event);
            return;
          }
          if (onImageClick) onImageClick(index);
        }}
      >
        {slides.map((image, i) => (
          <div
            key={`slide-${i}`}
            className={`absolute inset-0 motion-reduce:transition-none ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            style={{ transition: `opacity 700ms ${EASE}` }}
            aria-hidden={i !== index}
          >
            <SlideImage image={image} eager={i === 0} sizes={sizes} fit={fit} />
          </div>
        ))}

        {several ? (
          <>
            <p
              aria-live="polite"
              className={`absolute bottom-3 right-3 z-20 bg-ink/80 px-2.5 py-1 font-mono text-[12px] tracking-[0.18em] text-bone ${controlVisibility}`}
            >
              {pad(index + 1)} / {pad(count)}
            </p>
            <div className={`absolute bottom-4 left-3 z-20 flex items-center gap-1.5 ${controlVisibility}`}>
              {slides.map((image, i) => (
                <button
                  key={`dot-${i}`}
                  type="button"
                  aria-label={`Show photo ${pad(i + 1)}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={(event) => {
                    stop(event);
                    commit(i);
                  }}
                  className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-steel" : "bg-bone/40"}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {showThumbnails && several ? (
        <div className="mt-3 flex gap-2">
          {slides.map((image, i) => (
            <button
              key={`thumb-${i}`}
              type="button"
              aria-label={`Show photo ${pad(i + 1)}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => commit(i)}
              className={`relative aspect-[4/3] w-20 overflow-hidden border ${
                i === index ? "border-steel" : "border-bone/15"
              }`}
            >
              <SlideImage image={image} eager={false} sizes="80px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
