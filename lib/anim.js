"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function initGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export const EASE = "power3.out";
export const EASE_IO = "power2.inOut";

/**
 * Wrap every word of an element in <span class="split-word"><span>word</span></span>
 * so each word can be slid up from behind a mask. Idempotent.
 */
export function splitWords(el) {
  if (!el || el.dataset.split === "done") {
    return el ? Array.from(el.querySelectorAll(".split-word > span")) : [];
  }
  const text = el.textContent.trim();
  el.innerHTML = text
    .split(/\s+/)
    .map((w) => `<span class="split-word"><span>${w}</span></span>`)
    .join(" ");
  el.dataset.split = "done";
  return Array.from(el.querySelectorAll(".split-word > span"));
}

/** Split into characters, for the tighter display headlines. */
export function splitChars(el) {
  if (!el || el.dataset.split === "done") {
    return el ? Array.from(el.querySelectorAll(".split-char")) : [];
  }
  const text = el.textContent;
  el.innerHTML = text
    .split("")
    .map((c) =>
      c === " "
        ? "<span class='split-char' style='display:inline-block'>&nbsp;</span>"
        : `<span class="split-char" style="display:inline-block">${c}</span>`
    )
    .join("");
  el.dataset.split = "done";
  return Array.from(el.querySelectorAll(".split-char"));
}

/** Count a number up when its element scrolls into view. */
export function countUp(gsap, el, to, { decimals = 0, duration = 2 } = {}) {
  const obj = { v: 0 };
  return gsap.to(obj, {
    v: to,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = obj.v.toFixed(decimals);
    },
  });
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
