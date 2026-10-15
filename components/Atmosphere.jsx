"use client";

import { useEffect, useRef } from "react";
import { initGsap } from "@/lib/anim";

/**
 * The air in the room: drifting dust motes caught in light, plus two slow
 * light-leak blooms. Fixed behind the content, never interactive.
 */
export default function Atmosphere() {
  const canvas = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { gsap } = initGsap();
    const cv = canvas.current;
    const ctx = cv.getContext("2d", { alpha: true });

    let w = 0;
    let h = 0;
    let dpr = 1;
    let motes = [];

    const COUNT = window.innerWidth < 768 ? 28 : 70;

    // One mote, drawn once into an offscreen canvas. Building a radial gradient
    // per particle per frame (70 x 60fps = 4,200 gradients a second) was pure
    // waste; stamping a cached sprite costs almost nothing.
    const SPRITE = 32;
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = SPRITE;
    {
      const sx = sprite.getContext("2d");
      const g = sx.createRadialGradient(
        SPRITE / 2, SPRITE / 2, 0,
        SPRITE / 2, SPRITE / 2, SPRITE / 2
      );
      g.addColorStop(0, "rgba(99,146,190,1)");
      g.addColorStop(0.45, "rgba(99,146,190,0.3)");
      g.addColorStop(1, "rgba(99,146,190,0)");
      sx.fillStyle = g;
      sx.fillRect(0, 0, SPRITE, SPRITE);
    }

    const seed = () => {
      motes = Array.from({ length: COUNT }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.35 + Math.random() * 1.15,
        // Mostly rising, with a lazy sideways drift
        vy: -(0.012 + Math.random() * 0.045),
        vx: (Math.random() - 0.5) * 0.022,
        a: 0.06 + Math.random() * 0.2,
        // Each mote breathes at its own rate
        tw: 0.4 + Math.random() * 1.6,
        ph: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    seed();

    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 1;

      for (const m of motes) {
        m.x += m.vx * 0.004;
        m.y += m.vy * 0.004;

        if (m.y < -0.05) {
          m.y = 1.05;
          m.x = Math.random();
        }
        if (m.x < -0.05) m.x = 1.05;
        if (m.x > 1.05) m.x = -0.05;

        const twinkle = 0.55 + 0.45 * Math.sin(t * m.tw + m.ph);
        const px = m.x * w;
        const py = m.y * h;

        // A tight halo keeps these reading as dust, not as bokeh on a dirty lens
        const d = m.r * 5.2;
        ctx.globalAlpha = m.a * twinkle;
        ctx.drawImage(sprite, px - d / 2, py - d / 2, d, d);
      }
    };

    gsap.ticker.add(draw);
    window.addEventListener("resize", resize);

    return () => {
      gsap.ticker.remove(draw);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[44]" aria-hidden>
      {/* No blend mode: light dots on a near-black page look the same under
          normal compositing, and `screen` on a full-viewport layer is costly. */}
      <canvas ref={canvas} className="absolute inset-0" />

      {/* Slow light leaks — the bloom of an off-camera source */}
      <div className="leak leak-a" />
      <div className="leak leak-b" />
    </div>
  );
}
