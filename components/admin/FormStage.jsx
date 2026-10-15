import Image from "next/image";
import { blurFor } from "@/lib/blur";

/** Hero photo stretched under the form, with a dark scrim. Paper returns at the footer. */
export default function FormStage({ image, children }) {
  const blur = image ? blurFor(image) : undefined;

  return (
    <div className="on-dark relative">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="sticky top-0 h-screen">
          {image ? (
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
          ) : null}
          <div className="absolute inset-0 bg-ink/70" />
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
