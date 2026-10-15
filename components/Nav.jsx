"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { initGsap } from "@/lib/anim";
import { company, nav, products } from "@/lib/data";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(true);
  const bar = useRef(null);
  const overlay = useRef(null);
  const tl = useRef(null);

  /* Hide the bar on scroll-down, reveal on scroll-up */
  useEffect(() => {
    const { gsap, ScrollTrigger } = initGsap();
    const st = ScrollTrigger.create({
      start: "top -120",
      end: 99999,
      onUpdate: (self) => {
        if (open) return;
        gsap.to(bar.current, {
          yPercent: self.direction === 1 && self.scroll() > 400 ? -130 : 0,
          duration: 0.5,
          ease: "power3.out",
        });
      },
      onToggle: (self) => setScrolled(self.isActive),
    });
    return () => st.kill();
  }, [open]);

  /**
   * The bar floats over both palettes, so it has to pick one. It carries the
   * dark scope while any `.on-dark` section is under it, and the light scope
   * otherwise — checked against the element actually beneath the bar rather
   * than against scroll positions, so it stays correct through the pins.
   */
  useEffect(() => {
    const { ScrollTrigger } = initGsap();
    const probe = () => {
      const y = (bar.current?.offsetHeight ?? 64) + 8;
      const el = document.elementFromPoint(window.innerWidth / 2, y);
      setOverDark(Boolean(el?.closest(".on-dark")));
    };
    probe();
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: probe });
    window.addEventListener("resize", probe);
    return () => {
      st.kill();
      window.removeEventListener("resize", probe);
    };
  }, []);

  /* Build the overlay timeline once */
  useEffect(() => {
    const { gsap } = initGsap();
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({
          paused: true,
          onReverseComplete: () => {
            if (overlay.current) overlay.current.style.pointerEvents = "none";
          },
        })
        .fromTo(
          ".ov-bg",
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power4.inOut" }
        )
        .fromTo(
          ".ov-link > span",
          { yPercent: 115, rotate: 4 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 0.85,
            ease: "power4.out",
            stagger: 0.06,
          },
          "-=0.4"
        )
        .fromTo(
          ".ov-meta",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" },
          "-=0.5"
        );
    }, overlay);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!tl.current || !overlay.current) return;
    if (open) {
      const { gsap } = initGsap();
      if (bar.current) {
        gsap.to(bar.current, { yPercent: 0, duration: 0.45, ease: "power3.out", overwrite: "auto" });
      }
      overlay.current.style.pointerEvents = "auto";
      tl.current.play();
      document.body.style.overflow = "hidden";
    } else {
      tl.current.reverse();
      document.body.style.overflow = "";
    }
  }, [open]);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const active = (href) => {
    if (href === "/#top") return pathname === "/";
    if (href === "/events") return pathname.startsWith("/events");
    if (href.startsWith("/#")) return false;
    return pathname === href;
  };

  const dark = overDark || open;

  const desk = nav.filter((item) => item.label !== "Home");

  return (
    <>
      <header
        ref={bar}
        className={`fixed inset-x-0 top-0 z-[70] border-b transition-[background-color,border-color] duration-500 ${
          dark ? "on-dark" : ""
        } ${open ? "border-transparent bg-transparent" : scrolled ? "border-bone/10 bg-ink/90" : "border-transparent bg-transparent"}`}
      >
        <div className="mx-auto flex max-w-[1680px] items-center justify-between px-5 py-4 md:px-10 md:py-5">
          <Link href="/#top" className="flex items-center gap-3" aria-label={company.name}>
            <Image
              src={dark ? "/brands/agt-logo.png" : "/brands/agt-logo-ink.png"}
              alt=""
              width={44}
              height={56}
              className="h-9 w-auto md:h-11"
              priority
            />
            <span className="hidden leading-[1.05] sm:block">
              <span className="block font-display text-[17px] tracking-[0.02em] text-bone md:text-[17px]">
                AMBIKA GLOBAL
              </span>
              <span className="block font-mono text-[12px] font-medium tracking-[0.18em] text-bone-600">
                TRADERS · EST. 2021
              </span>
            </span>
          </Link>

          <nav className={`${open ? "hidden" : "hidden lg:flex"} min-w-0 items-center gap-x-3 xl:gap-x-7`}>
            {desk.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active(n.href) ? "page" : undefined}
                className={`link-sweep shrink-0 font-mono text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors hover:text-bone xl:text-[13px] xl:tracking-[0.12em] ${
                  active(n.href) ? "text-bone" : "text-bone-600"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/contact" className="btn btn-ghost hidden shrink-0 !px-6 !py-3 md:inline-flex">
              Get a Quote
            </Link>

            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition-colors hover:border-steel ${
                open ? "border-bone/50 bg-ink/50" : "border-bone/20"
              }`}
            >
              <span className="relative block h-3 w-5">
                <span className="absolute left-0 top-0 block h-px w-full bg-bone" />
                <span className="absolute left-0 top-full block h-px w-3/5 bg-bone" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Full-screen overlay menu ---------- */}
      <div
        ref={overlay}
        className="on-dark pointer-events-none fixed inset-0 z-[60]"
        aria-hidden={!open}
      >
        <div className="ov-bg absolute inset-0 bg-ink-800 [clip-path:inset(0_0_100%_0)]">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "url(/img/texture-concrete.webp)",
              backgroundSize: "cover",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-steel/10 via-transparent to-transparent" />

          <div className="relative mx-auto flex h-full max-w-[1680px] flex-col justify-between px-5 pb-8 pt-28 md:px-10 md:pt-36">
            <nav className="flex min-h-0 flex-col overflow-y-auto">
              {nav.map((n, i) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={active(n.href) ? "page" : undefined}
                  className="ov-link group block overflow-hidden py-1"
                >
                  <span
                    className={`display flex items-baseline gap-3 text-[clamp(2.15rem,7.4vw,3rem)] transition-colors duration-300 group-hover:text-steel-400 md:gap-4 md:text-[clamp(2.4rem,3.1vw,3.75rem)] ${
                      active(n.href) ? "text-steel-400" : "text-bone"
                    }`}
                  >
                    <em className="font-mono text-[12px] not-italic tracking-[0.25em] text-bone-500 md:text-[13px]">
                      0{i + 1}
                    </em>
                    {n.label}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="grid gap-8 border-t border-bone/10 pt-7 md:grid-cols-3">
              <div className="ov-meta">
                <p className="eyebrow mb-3">Stocked today</p>
                <p className="text-sm leading-relaxed text-bone-600">
                  {products.slice(0, 6).map((p) => p.title).join(" · ")} and more
                </p>
              </div>
              <div className="ov-meta">
                <p className="eyebrow mb-3">Yard</p>
                <p className="text-sm leading-relaxed text-bone-600">
                  {company.address.line1}
                  <br />
                  {company.address.line2}
                </p>
              </div>
              <div className="ov-meta">
                <p className="eyebrow mb-3">Talk to us</p>
                <a
                  href={`tel:${company.phones[1].replace(/\s/g, "")}`}
                  className="link-sweep block text-sm text-bone"
                >
                  {company.phones[1]}
                </a>
                <a
                  href={`mailto:${company.email}`}
                  className="link-sweep mt-1 block text-sm text-bone-600"
                >
                  {company.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
