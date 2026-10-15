import Media from "@/components/Media";

/**
 * Site photos go through next/image (via Media). Uploaded data/blob URLs
 * cannot use the image optimizer, so they render as a plain img. A missing
 * src gets the AGT placeholder — no empty frame.
 */
export default function Cover({
  src,
  alt = "",
  sizes = "100vw",
  className = "absolute inset-0",
  priority = false,
  frame = false,
  fit = "cover",
}) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-ink-700 ${className}`}>
        <span className="font-display text-3xl tracking-[0.08em] text-bone/25">AGT</span>
      </div>
    );
  }

  if (src.startsWith("data:") || src.startsWith("blob:")) {
    return (
      // Uploads are data URLs until the backend returns a real path.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${className}`} />
    );
  }

  return (
    <Media
      src={src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      scrim={false}
      frame={frame}
      fit={fit}
      className={className}
    />
  );
}
