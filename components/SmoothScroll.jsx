"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { initGsap } from "@/lib/anim";

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const { gsap, ScrollTrigger } = initGsap();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Exposed so anchor helpers (and debugging) can drive the same instance
    window.__lenis = lenis;

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Same-page hashes (/#about or #about) route through Lenis.
    // Capture runs before Next's link handler, so a prevented click stays on the page.
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest("a[href]");
      if (!a || a.target === "_blank") return;
      const href = a.getAttribute("href") || "";
      const hashAt = href.indexOf("#");
      if (hashAt < 0) return;
      const hash = href.slice(hashAt);
      if (!hash || hash === "#") return;
      const path = href.slice(0, hashAt);
      const samePage = path === "" || path === window.location.pathname;
      if (!samePage) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -96, duration: 1.4 });
    };
    document.addEventListener("click", onClick, true);

    // Let fonts and images settle before ScrollTrigger measures pins
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = setTimeout(refresh, 600);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("load", refresh);
      clearTimeout(t);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return children;
}
