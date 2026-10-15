"use client";

import { useEffect, useRef, useState } from "react";
import { initGsap } from "@/lib/anim";

const WORDS = ["CEMENT", "STEEL", "SAND", "STONE", "AMBIKA"];

export default function Preloader({ onDone }) {
  const root = useRef(null);
  const counter = useRef(null);
  const wordRef = useRef(null);
  const barRef = useRef(null);
  const [gone, setGone] = useState(false);

  // Held in a ref so an inline onDone from the parent cannot re-trigger the effect
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const { gsap } = initGsap();
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const num = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setGone(true);
          done.current?.();
        },
      });

      tl.to(num, {
        v: 100,
        duration: 2.1,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.round(num.v);
          if (counter.current) counter.current.textContent = String(v).padStart(3, "0");
          if (barRef.current) barRef.current.style.transform = `scaleX(${num.v / 100})`;
          if (wordRef.current) {
            const i = Math.min(WORDS.length - 1, Math.floor((num.v / 100) * WORDS.length));
            if (wordRef.current.textContent !== WORDS[i]) wordRef.current.textContent = WORDS[i];
          }
        },
      })
        .to(".pl-fade", { opacity: 0, duration: 0.4, ease: "power2.in" }, "-=0.1")
        .to(
          ".pl-panel",
          {
            scaleY: 0,
            transformOrigin: "top center",
            duration: 1,
            ease: "power4.inOut",
            stagger: { each: 0.07, from: "start" },
          },
          "-=0.2"
        );
    }, root);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="on-dark fixed inset-0 z-[80]" aria-hidden>
      <div className="absolute inset-0 flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="pl-panel h-full flex-1 bg-ink" />
        ))}
      </div>

      <div className="pl-fade absolute inset-0 flex flex-col items-center justify-center px-6">
        <div className="mb-6 overflow-hidden">
          <span
            ref={wordRef}
            className="display block text-[10vw] leading-none text-bone sm:text-[6.6vw]"
          >
            CEMENT
          </span>
        </div>

        <div className="h-px w-[min(520px,70vw)] overflow-hidden bg-bone/20">
          <div
            ref={barRef}
            className="h-full w-full origin-left scale-x-0 bg-steel"
          />
        </div>

        <div className="mt-5 flex w-[min(520px,70vw)] items-center justify-between font-mono text-[12px] tracking-[0.3em] text-bone-500">
          <span>AMBIKA GLOBAL TRADERS</span>
          <span ref={counter}>000</span>
        </div>
      </div>
    </div>
  );
}
