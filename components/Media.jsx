"use client";

import Image from "next/image";
import { blurFor } from "@/lib/blur";

/**
 * Every content image on the page goes through here, so the grade, the blur-up
 * and the framing stay identical everywhere.
 *
 * tone   "steel" duotone (default) | "neutral" desaturated | "raw" untouched
 * scrim  "bottom" | "left" | "full" | false
 * frame  draws a hairline and corner ticks over the image
 */
export default function Media({
  src,
  alt = "",
  priority = false,
  sizes = "100vw",
  tone = "steel",
  scrim = "bottom",
  frame = false,
  fit = "cover",
  className = "",
  imgClassName = "",
  children,
}) {
  const blurDataURL = blurFor(src);

  // Callers usually pass their own positioning ("absolute inset-0"). Adding
  // `relative` unconditionally would collide with it — Tailwind resolves the
  // clash by source order, not class order, so `relative` wins and the wrapper
  // collapses to zero height, which silently kills every `fill` image inside.
  const positioned = /\b(absolute|fixed|sticky|relative)\b/.test(className);

  const scrims = {
    bottom:
      "bg-[linear-gradient(180deg,rgb(var(--c-ink)/0.2)_0%,rgb(var(--c-ink)/0)_30%,rgb(var(--c-ink)/0.22)_58%,rgb(var(--c-ink)/0.9)_100%)]",
    left: "bg-[linear-gradient(104deg,rgb(var(--c-ink)/0.92)_0%,rgb(var(--c-ink)/0.58)_44%,rgb(var(--c-ink)/0.12)_100%)]",
    full: "bg-[linear-gradient(180deg,rgb(var(--c-ink)/0.7)_0%,rgb(var(--c-ink)/0.42)_45%,rgb(var(--c-ink)/0.88)_100%)]",
  };

  return (
    <div
      className={`media media-${tone} overflow-hidden ${
        positioned ? "" : "relative"
      } ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        className={`media-img ${fit === "contain" ? "object-contain" : "object-cover"} ${imgClassName}`}
        style={{ transform: "translateZ(0)" }}
      />

      {/* The steel duotone is baked into the WebP itself — see globals.css */}
      <span className="media-warm pointer-events-none absolute inset-0" />

      {scrim ? (
        <span className={`pointer-events-none absolute inset-0 ${scrims[scrim] || scrims.bottom}`} />
      ) : null}

      {frame ? (
        <span className="pointer-events-none absolute inset-0 z-[2]">
          <span className="absolute inset-0 border border-bone/15" />
          <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-steel-300/70" />
          <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-steel-300/70" />
          <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-steel-300/70" />
          <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-steel-300/70" />
        </span>
      ) : null}

      {children}
    </div>
  );
}
