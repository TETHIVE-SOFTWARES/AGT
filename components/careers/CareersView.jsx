"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ApplicationForm from "@/components/careers/ApplicationForm";
import PosterLightbox, { GeneratedPoster } from "@/components/careers/PosterLightbox";
import { initGsap } from "@/lib/anim";
import { blurFor } from "@/lib/blur";
import { getJobs } from "@/lib/api";
import { jobs as seedJobs } from "@/data/careers";

const HERO = "/img/about-1.webp";

const LEGACY_IDS = new Set([
  "sales-executive",
  "yard-supervisor",
  "delivery-driver",
  "accounts-assistant",
]);

function slugify(value) {
  return String(value || "role")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function asOpening(job) {
  return {
    id: job.id,
    slug: job.slug || slugify(job.title),
    title: job.title,
    company: job.company || job.department || "Ambika Global Traders",
    poster: job.poster || job.image || "",
    qualification: job.qualification || "",
    experience: job.experience || "",
    skills: job.skills || [],
    workingHours: job.workingHours || "",
    location: job.location || "Erachakulam, Nagercoil",
    type: job.type || "Full-time",
    isOpen: job.isOpen !== false,
    postedAt: job.postedAt || "",
  };
}

/** Seed roles stay on the page. A poster saved in the yard desk is added beside them. */
function mergeOpenings(live) {
  const seed = seedJobs.filter((job) => job.isOpen !== false).map(asOpening);
  const seedIds = new Set(seed.map((job) => job.id));
  const extras = (live || [])
    .filter((job) => job && job.isOpen !== false && !LEGACY_IDS.has(job.id) && !seedIds.has(job.id))
    .map(asOpening);
  const overrides = new Map();
  for (const job of live || []) {
    if (!job || !seedIds.has(job.id)) continue;
    const base = seed.find((item) => item.id === job.id);
    overrides.set(
      job.id,
      asOpening({
        ...base,
        ...job,
        poster: job.poster || job.image || base.poster || "",
      })
    );
  }
  const merged = seed.map((job) => overrides.get(job.id) || job);
  return [...merged, ...extras];
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -8, duration: 1.1 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CareersView() {
  const root = useRef(null);
  const [jobs, setJobs] = useState(() => seedJobs.filter((job) => job.isOpen).map(asOpening));
  const [role, setRole] = useState("");
  const [poster, setPoster] = useState(null);
  const blur = blurFor(HERO);

  useEffect(() => {
    let live = true;
    getJobs().then((list) => {
      if (live) setJobs(mergeOpenings(list));
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const { gsap } = initGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cr-rise",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }
      );
      gsap.fromTo(".cr-shot", { scale: 1.18 }, { scale: 1.05, duration: 14, ease: "power2.out" });
      gsap.utils.toArray(".cr-card").forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            delay: (index % 3) * 0.08,
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, [jobs]);

  const apply = (title) => {
    setRole(title);
    scrollToId("apply");
  };

  const columns = jobs.length > 2 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2";

  return (
    <div ref={root}>
      <section className="on-dark relative min-h-[55vh] overflow-hidden bg-ink">
        <div className="cr-shot absolute inset-[-8%] will-change-transform">
          <Image
            src={HERO}
            alt=""
            fill
            priority
            sizes="100vw"
            placeholder={blur ? "blur" : "empty"}
            blurDataURL={blur}
            className="object-cover"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--c-ink)/0.34)_0%,rgb(var(--c-ink)/0)_26%,rgb(var(--c-ink)/0.1)_48%,rgb(var(--c-ink)/0.62)_78%,rgb(var(--c-ink)/0.94)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(94deg,rgb(var(--c-ink)/0.72)_0%,rgb(var(--c-ink)/0.3)_34%,transparent_62%)]" />

        <div className="relative z-10 mx-auto flex min-h-[55vh] max-w-[1680px] flex-col justify-end px-5 pb-12 pt-28 md:px-10 md:pb-16 md:pt-36">
          <p className="cr-rise mb-6 font-mono text-[12px] uppercase tracking-[0.24em] text-bone-500">
            <Link href="/" className="link-sweep text-bone-600 transition-colors hover:text-bone">
              Home
            </Link>
            <span className="mx-2 text-bone-400">/</span>
            <span className="text-bone">Careers</span>
          </p>
          <p className="cr-rise eyebrow mb-5 md:mb-7">09 — Careers</p>
          <h1 className="cr-rise display text-bone">
            <span className="block text-[11vw] leading-[1.05] md:text-[6.1vw]">We&apos;re</span>
            <span className="block text-[11vw] leading-[1.05] text-steel-400 md:text-[6.1vw]">hiring.</span>
          </h1>
          <p className="cr-rise mt-6 max-w-[46ch] text-[17px] leading-relaxed text-bone-600 md:mt-8 md:text-base">
            Accountant, site supervisor and e-service roles, open at the yard.
          </p>
          <div className="cr-rise mt-8 flex flex-wrap gap-3 md:mt-10">
            <button type="button" className="btn btn-solid" onClick={() => scrollToId("apply")}>
              Apply now
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => scrollToId("openings")}>
              View openings
            </button>
          </div>
        </div>
      </section>

      <section id="openings" className="hair-t relative bg-ink-800 py-24 md:py-36">
        <div className="mx-auto max-w-[1680px] px-5 md:px-10">
          <p className="eyebrow mb-5">01 — Openings</p>
          <h2 className="display text-[8.6vw] leading-[1.05] text-bone md:text-[3.3vw]">
            Current
            <br />
            <span className="text-steel-400">openings.</span>
          </h2>

          {jobs.length === 0 ? (
            <p className="mt-10 max-w-[46ch] text-[17px] leading-relaxed text-bone-600">
              No roles are open right now. The yard will post the next one here.
            </p>
          ) : (
            <div className={`mt-12 grid grid-cols-1 items-stretch gap-8 md:mt-16 md:gap-10 ${columns}`}>
              {jobs.map((job) => (
                <article key={job.id} className="cr-card group flex h-full flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-bone/10 bg-ink-800 shadow-[0_16px_40px_rgb(var(--c-bone)/0.08)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
                    <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
                      {job.poster ? (
                        <Image
                          src={job.poster}
                          alt={`${job.title} hiring poster`}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-contain"
                        />
                      ) : (
                        <GeneratedPoster job={job} />
                      )}
                    </div>
                  </div>

                  <p className="mt-5 font-mono text-[12px] uppercase tracking-[0.18em] text-bone-500">
                    {job.company}
                  </p>
                  <h3 className="mt-2 font-display text-2xl uppercase tracking-wide text-bone">{job.title}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {[job.qualification, job.experience, job.workingHours].filter(Boolean).map((chip) => (
                      <li
                        key={chip}
                        className="border border-bone/15 px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.12em] text-bone-600"
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-3 pt-6">
                    <button type="button" className="btn btn-solid" onClick={() => apply(job.title)}>
                      Apply for this role
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={() => setPoster(job)}>
                      View poster
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-14 flex justify-center md:mt-20">
            <button type="button" className="btn btn-solid" onClick={() => scrollToId("apply")}>
              Apply Now
            </button>
          </div>
        </div>
      </section>

      <ApplicationForm jobs={jobs} role={role} />
      {poster ? <PosterLightbox job={poster} onClose={() => setPoster(null)} /> : null}
    </div>
  );
}
