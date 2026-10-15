"use client";

import { useEffect, useRef } from "react";
import { initGsap } from "@/lib/anim";

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const { gsap } = initGsap();

    const xTo = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const yTo = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const rxTo = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ryTo = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });

    const move = (e) => {
      xTo(e.clientX - 3);
      yTo(e.clientY - 3);
      rxTo(e.clientX - 20);
      ryTo(e.clientY - 20);
    };

    const grow = () =>
      gsap.to(ring.current, { scale: 1.9, opacity: 0.6, duration: 0.4, ease: "power3.out" });
    const shrink = () =>
      gsap.to(ring.current, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" });

    const over = (e) => {
      if (e.target.closest("a, button, [data-cursor]")) grow();
    };
    const out = (e) => {
      if (e.target.closest("a, button, [data-cursor]")) shrink();
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden />
      <div ref={ring} className="cursor-ring" aria-hidden />
    </>
  );
}
