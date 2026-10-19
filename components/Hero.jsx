"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { initGsap } from "@/lib/anim";
import { blurFor } from "@/lib/blur";
import { company, heroSlides } from "@/lib/data";

export default function Hero({ ready }) {
  const root = useRef(null);
  const indexRef = useRef(null);
  const cam = useRef(null);

  /* Intro: the shutter opens, the lens finds focus */
  useEffect(() => {
    if (!ready) return;
    const { gsap } = initGsap();
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        // Shutter
        .fromTo(
          ".letterbox",
          { height: "52vh" },
          { height: "0vh", duration: 1.6, ease: "power4.inOut" },
          0
        )
        // Lines arrive out of depth rather than sliding up behind a mask —
        // a mask crop reads as the text being cut in half mid-scroll.
        .fromTo(
          "[data-slide='0'] .h-line > span",
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, stagger: 0.12 },
          0.5
        )
        .fromTo(
          "[data-slide='0'] .h-fade",
          { opacity: 0, y: 24, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.95, stagger: 0.08 },
          "-=1.05"
        )
        .fromTo(
          ".hero-chrome",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.07 },
          "-=0.75"
        )
        .fromTo(
          ".hero-atmos",
          { opacity: 0 },
          { opacity: 1, duration: 2.4, ease: "power2.out" },
          0.6
        );
    }, root);
    return () => ctx.revert();
  }, [ready]);

  /* Camera: pointer parallax on the outer rig, handheld float on the inner one */
  useEffect(() => {
    const { gsap } = initGsap();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Never quite still — the shot is handheld
    const float = gsap.to(".hero-handheld", {
      x: "random(-14, 14)",
      y: "random(-10, 10)",
      duration: 7,
      ease: "sine.inOut",
      repeat: -1,
      repeatRefresh: true,
    });

    if (window.matchMedia("(hover: none)").matches) return () => float.kill();

    const xTo = gsap.quickTo(cam.current, "x", { duration: 1.2, ease: "power3" });
    const yTo = gsap.quickTo(cam.current, "y", { duration: 1.2, ease: "power3" });

    const move = (e) => {
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      xTo(dx * -30);
      yTo(dy * -20);
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      float.kill();
    };
  }, []);

  /* Pinned scroll sequence */
  useEffect(() => {
    const { gsap, ScrollTrigger } = initGsap();
    const n = heroSlides.length;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const show = (progress) => {
          const p = Math.min(1, Math.max(0, progress));
          const current = Math.min(n - 1, Math.floor(p * n));
          const local = Math.min(1, Math.max(0, (p - current / n) * n));
          // Same slow pull-in as the inner-page heroes: each photo starts wide and settles as you scroll.
          const zoom = 1.18 - local * 0.13;

          for (let s = 0; s < n; s++) {
            const on = s === current;
            gsap.set(`[data-slide='${s}']`, { autoAlpha: on ? 1 : 0, y: 0, rotateX: 0, z: 0 });
            gsap.set(`[data-slide='${s}'] .h-line > span, [data-slide='${s}'] .h-fade`, {
              y: 0,
              z: 0,
              rotateX: 0,
              opacity: on ? 1 : 0,
            });
            gsap.set(`.hero-img-${s}`, { autoAlpha: on ? 1 : 0, scale: on ? zoom : 1.18 });
          }

          if (indexRef.current) {
            indexRef.current.textContent = String(current + 1).padStart(2, "0");
          }
          document.querySelectorAll("[data-dot]").forEach((dot, di) => {
            dot.style.transform = `scaleY(${di === current ? 1 : 0.25})`;
            dot.style.opacity = di === current ? "1" : "0.3";
          });
        };

        show(0);

        const trigger = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: `+=${n * 85}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onRefresh: (self) => show(self.progress),
          onUpdate: (self) => show(self.progress),
        });

        gsap.to(".scroll-cue", {
          opacity: 0,
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=180", scrub: true },
        });

        return () => trigger.kill();
      });

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} className="on-dark vignette relative h-screen w-full overflow-hidden bg-ink">
      {/* ---------- Background stack, on a drifting camera ---------- */}
      <div ref={cam} className="absolute inset-[-4%] will-change-transform">
        <div className="hero-handheld absolute inset-0 will-change-transform">
          {heroSlides.map((s, i) => (
            <div key={s.img} className={`hero-img-${i} absolute inset-[-6%] origin-center will-change-transform`}>
              <Image
                src={s.img}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                placeholder="blur"
                blurDataURL={blurFor(s.img)}
                className="object-cover"
              />
            </div>
          ))}

        </div>
      </div>

      {/* Vignette + gradient wash, keeps type legible over any frame */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--c-ink)/0.34)_0%,rgb(var(--c-ink)/0)_26%,rgb(var(--c-ink)/0.1)_48%,rgb(var(--c-ink)/0.62)_78%,rgb(var(--c-ink)/0.94)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(94deg,rgb(var(--c-ink)/0.72)_0%,rgb(var(--c-ink)/0.3)_34%,transparent_62%)]" />

      {/* ---------- Atmosphere: rays, flare, haze ---------- */}
      <div className="hero-atmos pointer-events-none absolute inset-0 opacity-0">
        <div className="rays" />

        {/* Anamorphic flare, hung off the light source in the frame */}
        <div className="flare flare-core" style={{ top: "16%", right: "18%" }} />
        <div className="flare flare-streak" style={{ top: "26%", right: "-6%" }} />

        {/* Low haze rolling along the bottom of the frame */}
        <div className="absolute inset-x-0 bottom-0 h-[46%] bg-[linear-gradient(0deg,rgb(var(--c-steel)/0.07)_0%,transparent_100%)] mix-blend-screen" />
      </div>

      {/* ---------- Shutter ---------- */}
      <div className="letterbox letterbox-t h-0" />
      <div className="letterbox letterbox-b h-0" />

      {/* ---------- Headline stack ---------- */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1680px] flex-col justify-end px-5 pb-28 md:px-10 md:pb-28">
        <div className="relative">
          {heroSlides.map((s, i) => (
            <div
              key={s.line1}
              data-slide={i}
              className={i === 0 ? "relative" : "absolute inset-x-0 bottom-0"}
            >
              <p className="h-fade eyebrow mb-5 md:mb-7">{s.kicker}</p>

              <h1 className="display text-bone">
                <span className="h-line block text-[clamp(2.15rem,10vw,3.25rem)] leading-[1.05] md:text-[6.1vw]">
                  <span className="sweep block">{s.line1}</span>
                </span>
                <span className="h-line block text-[clamp(2.15rem,10vw,3.25rem)] leading-[1.05] md:text-[6.1vw]">
                  <span className="sweep block text-steel-400">
                    {s.line2}
                  </span>
                </span>
              </h1>

              <p className="h-fade mt-6 max-w-[46ch] text-[17px] leading-relaxed text-bone-600 md:mt-8 md:text-base">
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* ---------- Bottom chrome ---------- */}
        <div className="hero-chrome mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:mt-12">
          <a href="/#products" className="btn btn-solid w-full justify-center sm:w-auto">
            View the catalogue
          </a>
          <a href={`mailto:${company.email}?subject=Quote%20request`} className="btn btn-ghost w-full justify-center sm:w-auto">
            Mail a quote
          </a>
        </div>
      </div>

      {/* ---------- Right-hand slide index ---------- */}
      <div className="hero-chrome absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-4 md:right-10 md:flex">
        <span ref={indexRef} className="font-mono text-[13px] tracking-[0.2em] text-bone">
          01
        </span>
        <div className="flex flex-col gap-2">
          {heroSlides.map((_, i) => (
            <span
              key={i}
              data-dot
              className="block h-10 w-px origin-center bg-bone transition-none"
              style={{ transform: i === 0 ? "scaleY(1)" : "scaleY(0.25)", opacity: i === 0 ? 1 : 0.3 }}
            />
          ))}
        </div>
        <span className="font-mono text-[13px] tracking-[0.2em] text-bone-500">
          0{heroSlides.length}
        </span>
      </div>

      {/* ---------- Scroll cue ---------- */}
      <div className="scroll-cue hero-chrome absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="font-mono text-[11px] tracking-[0.3em] text-bone-500">SCROLL</span>
        <span className="relative block h-9 w-px overflow-hidden bg-bone/20">
          <span className="absolute inset-x-0 top-0 block h-3 animate-[cue_1.8s_ease-in-out_infinite] bg-steel" />
        </span>
      </div>
    </section>
  );
}
