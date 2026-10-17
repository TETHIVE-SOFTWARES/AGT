"use client";

import { useEffect, useRef, useState } from "react";
import Media from "@/components/Media";
import PageHero from "@/components/PageHero";
import { initGsap } from "@/lib/anim";
import { enquiryWhatsAppUrl, submitEnquiry } from "@/lib/api";
import { areas, company, products } from "@/lib/data";

const MATERIALS = [...products.map((product) => product.title), "Other"];
const STAGES = ["Foundation", "Slab", "Plaster", "Finishing", "Not sure"];
const REPLIES = ["Call", "WhatsApp"];

const LINE =
  "min-h-12 w-full border-b border-bone/35 bg-transparent px-0 py-3.5 text-[17px] font-medium text-bone outline-none transition-colors placeholder:text-bone-500 focus:border-steel";

const PILL = "btn btn-ghost cursor-pointer !px-4 !py-2.5 text-[13px] tracking-[0.1em]";
const PILL_ON = "!border-steel !bg-steel !text-white";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  town: "",
  notes: "",
  preferred: "",
};

function Mark({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7 text-steel transition-transform duration-500 group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function kolkataOpen(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value])
  );
  if (parts.weekday === "Sun") return false;
  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  return minutes >= 8 * 60 && minutes < 20 * 60;
}

function YardStatus() {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const tick = () => setOpen(kolkataOpen());
    tick();
    const timer = setInterval(tick, 30000);
    return () => clearInterval(timer);
  }, []);

  if (open === null) return null;

  return (
    <p className="mb-5 font-mono text-[12px] uppercase tracking-[0.18em] text-bone">
      <span className={open ? "text-steel" : "text-bone-500"}>●</span>{" "}
      {open ? "Open now · until 8:00 PM" : "Closed · opens 8:00 AM"}
    </p>
  );
}

function validPhone(value) {
  const digits = value.replace(/\D/g, "");
  const local =
    digits.length === 12 && digits.startsWith("91")
      ? digits.slice(2)
      : digits.length === 11 && digits.startsWith("0")
        ? digits.slice(1)
        : digits;
  return /^[6-9]\d{9}$/.test(local);
}

function validate(form, materials, stage) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Add your name.";
  if (!validPhone(form.phone)) errors.phone = "Enter a 10-digit mobile number.";
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "That email does not look right.";
  }
  if (!materials.length) errors.materials = "Choose at least one material.";
  if (!stage) errors.stage = "Tell us the stage.";
  if (!form.preferred) errors.preferred = "Choose how we should reply.";
  return errors;
}

export default function ContactYard() {
  const root = useRef(null);
  const [form, setForm] = useState(emptyForm);
  const [materials, setMaterials] = useState([]);
  const [stage, setStage] = useState("");
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState("");
  const [sent, setSent] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { gsap } = initGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });
      gsap.fromTo(
        ".ct-shot",
        { scale: 1.18 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: ".ct-frame", start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const set = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const toggleMaterial = (title) => {
    setMaterials((current) =>
      current.includes(title) ? current.filter((item) => item !== title) : [...current, title]
    );
    setErrors((current) => ({ ...current, materials: undefined }));
  };

  const payload = () => ({
    name: form.name.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    products: materials,
    service: materials.join(", "),
    stage,
    town: form.town.trim(),
    message: form.notes.trim(),
    preferred: form.preferred,
  });

  const submit = async (event) => {
    event.preventDefault();
    const next = validate(form, materials, stage);
    setErrors(next);
    if (Object.keys(next).length) return;
    const body = payload();
    setSending("enquiry");
    await submitEnquiry(body);
    setSending("");
    setSent(body);
  };

  const sendWhatsApp = () => {
    const next = validate(form, materials, stage);
    setErrors(next);
    if (Object.keys(next).length) return;
    const body = payload();
    window.open(enquiryWhatsAppUrl(body), "_blank", "noopener");
    setSending("whatsapp");
    submitEnquiry(body).then(() => {
      setSending("");
      setSent(body);
    });
  };

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast("Copied");
    } catch {
      setToast("Copy failed");
    }
    window.setTimeout(() => setToast(""), 1600);
  };

  return (
    <div ref={root}>
      <PageHero
        image="/img/contact-wide.webp"
        imageAlt="The yard shed and loaded truck seen from the approach road"
        eyebrow="08 — Contact · We reply the same day"
        title="One call."
        accent="The full bill of materials."
        intro="Retail counter and wholesale loading, Erachakulam, Nagercoil. Tell us the stage you're at and we'll send an itemised quote."
        crumb="Contact"
        actions={
          <>
            <YardStatus />
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="tel:+918870183231" className="btn btn-solid w-full justify-center sm:w-auto">
                Call the counter
              </a>
              <a
                href={company.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost w-full justify-center sm:w-auto"
              >
                WhatsApp a quote
              </a>
            </div>
          </>
        }
      />

      <section className="hair-t bg-ink py-24 md:py-36">
        <div className="mx-auto max-w-[1680px] px-5 md:px-10">
          <p data-reveal className="eyebrow mb-10">
            01 — Reach us
          </p>
          <div data-reveal className="grid grid-cols-1 items-stretch md:grid-cols-2 lg:grid-cols-12">
            <Reach
              className="lg:col-span-3"
              label="Call"
              icon={
                <Mark>
                  <path d="M7 3.5h3.2l1.4 3.4-2 1.2a11 11 0 0 0 5.3 5.3l1.2-2 3.4 1.4V16a1.5 1.5 0 0 1-1.5 1.5A14.5 14.5 0 0 1 4.5 5 1.5 1.5 0 0 1 6 3.5H7Z" />
                </Mark>
              }
              action={
                <a href="tel:+918870183231" className="link-sweep font-mono text-[15px] font-semibold uppercase tracking-[0.14em] text-steel">
                  Call now
                </a>
              }
            >
              <ul className="space-y-2">
                {company.phones.map((phone) => (
                  <li key={phone} className="flex items-baseline justify-between gap-3">
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-[17px] leading-relaxed text-bone">
                      {phone}
                    </a>
                    <button
                      type="button"
                      onClick={() => copy(phone)}
                      className="font-mono text-[12px] uppercase tracking-[0.16em] text-bone-500 outline-none focus-visible:ring-2 focus-visible:ring-steel"
                    >
                      Copy
                    </button>
                  </li>
                ))}
              </ul>
            </Reach>

            <Reach
              className="lg:col-span-3"
              label="WhatsApp"
              icon={
                <Mark>
                  <path d="M5 6.5h14v9H8.5L5 18.5v-12Z" />
                </Mark>
              }
              action={
                <a
                  href={company.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-sweep font-mono text-[15px] font-semibold uppercase tracking-[0.14em] text-steel"
                >
                  Chat on WhatsApp
                </a>
              }
            >
              <p className="text-[17px] leading-relaxed text-bone">+91 63858 01701</p>
            </Reach>

            <Reach
              className="lg:col-span-3"
              label="Email"
              icon={
                <Mark>
                  <path d="M3.5 6.5h17v11h-17z" />
                  <path d="m4 7 8 6.5L20 7" />
                </Mark>
              }
              action={
                <a href={`mailto:${company.email}`} className="link-sweep font-mono text-[15px] font-semibold uppercase tracking-[0.14em] text-steel">
                  Send mail
                </a>
              }
            >
              <div className="flex items-baseline justify-between gap-3">
                <a href={`mailto:${company.email}`} className="text-[17px] leading-relaxed text-bone">
                  {company.email}
                </a>
                <button
                  type="button"
                  onClick={() => copy(company.email)}
                  className="shrink-0 font-mono text-[12px] uppercase tracking-[0.16em] text-bone-500 outline-none focus-visible:ring-2 focus-visible:ring-steel"
                >
                  Copy
                </button>
              </div>
            </Reach>

            <Reach
              className="lg:col-span-3"
              label="Visit"
              icon={
                <Mark>
                  <path d="M12 21s6.5-5.6 6.5-10.2a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21Z" />
                  <circle cx="12" cy="10.5" r="2.1" />
                </Mark>
              }
              action={
                <a
                  href={company.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-sweep font-mono text-[15px] font-semibold uppercase tracking-[0.14em] text-steel"
                >
                  Get directions
                </a>
              }
            >
              <p className="text-[17px] leading-relaxed text-bone">
                8-105/3, Balamore Road
                <br />
                Erachakulam, Nagercoil
                <br />
                Tamil Nadu 629901
              </p>
            </Reach>
          </div>
        </div>
      </section>

      <section id="enquiry" className="hair-t bg-ink-800 py-24 md:py-36">
        <div className="mx-auto grid max-w-[1680px] items-stretch gap-10 px-5 md:px-10 lg:grid-cols-12 lg:gap-14">
          <div data-reveal className="lg:col-span-7">
            <p className="eyebrow mb-5">02 — Enquiry</p>
            <h2 className="display max-w-[14ch] text-[8.6vw] leading-[1.05] text-bone md:text-[3.3vw]">
              What do you need?
            </h2>
            <p className="mt-5 max-w-[60ch] text-[17px] leading-relaxed text-bone-600">
              Tell us the stage and the materials. The yard sends an itemised quote the same day.
            </p>
            <div className="mt-10 border border-bone/10 bg-ink">
            {sent ? (
              <div className="p-6 md:p-10" aria-live="polite">
                <p className="eyebrow mb-5">Received</p>
                <h2 className="display max-w-[14ch] text-4xl text-bone md:text-6xl">We&apos;ll call you back today.</h2>
                <p className="mt-6 max-w-[60ch] text-[17px] leading-relaxed text-bone-600">
                  {sent.products.join(", ")}
                  {sent.stage ? ` · ${sent.stage}` : ""}
                  {sent.town ? ` · ${sent.town}` : ""}
                  {sent.preferred ? ` · reply by ${sent.preferred}` : ""}
                </p>
                <button
                  type="button"
                  className="btn btn-ghost mt-8"
                  onClick={() => {
                    setSent(null);
                    setForm(emptyForm);
                    setMaterials([]);
                    setStage("");
                    setErrors({});
                  }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate aria-busy={Boolean(sending)} className="p-6 md:p-10">
                <div className="grid gap-y-2">
                  <label className="block">
                    <span className="sr-only">Name</span>
                    <input className={LINE} placeholder="Your name" autoComplete="name" value={form.name} onChange={set("name")} aria-invalid={Boolean(errors.name)} />
                    {errors.name ? <span role="alert" className="mt-2 block font-mono text-[13px] text-sand">{errors.name}</span> : null}
                  </label>
                  <label className="block">
                    <span className="sr-only">Phone</span>
                    <input className={LINE} placeholder="Phone number" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} aria-invalid={Boolean(errors.phone)} />
                    {errors.phone ? <span role="alert" className="mt-2 block font-mono text-[13px] text-sand">{errors.phone}</span> : null}
                  </label>
                  <label className="block">
                    <span className="sr-only">Email, optional</span>
                    <input className={LINE} placeholder="Email (optional)" type="email" autoComplete="email" value={form.email} onChange={set("email")} aria-invalid={Boolean(errors.email)} />
                    {errors.email ? <span role="alert" className="mt-2 block font-mono text-[13px] text-sand">{errors.email}</span> : null}
                  </label>
                  <label className="block">
                    <span className="sr-only">Delivery town</span>
                    <input className={LINE} placeholder="Delivery town" list="delivery-towns" value={form.town} onChange={set("town")} />
                    <datalist id="delivery-towns">
                      {areas.map((town) => (
                        <option key={town} value={town} />
                      ))}
                    </datalist>
                  </label>
                </div>

                <div className="mt-8">
                  <p className="eyebrow mb-4">Materials</p>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Materials">
                    {MATERIALS.map((title, index) => {
                      const on = materials.includes(title);
                      return (
                        <button
                          key={title}
                          id={index === 0 ? "product-chip-0" : undefined}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggleMaterial(title)}
                          className={`${PILL} ${on ? PILL_ON : ""}`}
                        >
                          {title}
                        </button>
                      );
                    })}
                  </div>
                  {errors.materials ? <p role="alert" className="mt-3 font-mono text-[13px] text-sand">{errors.materials}</p> : null}
                </div>

                <div className="mt-8">
                  <p className="eyebrow mb-4">Build stage</p>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Build stage">
                    {STAGES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={stage === item}
                        onClick={() => {
                          setStage(item);
                          setErrors((current) => ({ ...current, stage: undefined }));
                        }}
                        className={`${PILL} ${stage === item ? PILL_ON : ""}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  {errors.stage ? <p role="alert" className="mt-3 font-mono text-[13px] text-sand">{errors.stage}</p> : null}
                </div>

                <label className="mt-6 block">
                  <span className="sr-only">Quantity and notes</span>
                  <textarea className={`${LINE} resize-none`} rows={3} placeholder="Quantity, site, when you need it" value={form.notes} onChange={set("notes")} />
                </label>

                <fieldset className="mt-8">
                  <legend className="eyebrow mb-4">Preferred reply</legend>
                  <div className="flex flex-wrap gap-2">
                    {REPLIES.map((choice) => (
                      <label key={choice} className={`${PILL} ${form.preferred === choice ? PILL_ON : ""}`}>
                        <input
                          type="radio"
                          name="preferred"
                          value={choice}
                          checked={form.preferred === choice}
                          onChange={set("preferred")}
                          className="sr-only"
                        />
                        {choice}
                      </label>
                    ))}
                  </div>
                  {errors.preferred ? <p role="alert" className="mt-3 font-mono text-[13px] text-sand">{errors.preferred}</p> : null}
                </fieldset>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row" aria-live="polite">
                  <button type="submit" className="btn btn-solid w-full justify-center disabled:pointer-events-none disabled:opacity-40 sm:w-auto" disabled={Boolean(sending)}>
                    {sending === "enquiry" ? "Sending" : "Send enquiry"}
                  </button>
                  <button
                    type="button"
                    onClick={sendWhatsApp}
                    className="btn btn-ghost w-full justify-center disabled:pointer-events-none disabled:opacity-40 sm:w-auto"
                    disabled={Boolean(sending)}
                  >
                    {sending === "whatsapp" ? "Sending" : "Send via WhatsApp"}
                  </button>
                </div>
              </form>
            )}
            </div>
          </div>

          <div data-reveal className="relative lg:col-span-5">
            <div className="ct-frame relative aspect-[3/4] overflow-hidden lg:absolute lg:inset-0 lg:aspect-auto">
              <div className="ct-shot absolute inset-[-8%] will-change-transform">
                <Media
                  src="/img/enquiry-side.webp"
                  alt="The open yard at dusk, with steel, bricks and a truck by the shed"
                  scrim={false}
                  className="absolute inset-0"
                  imgClassName="object-[center_72%]"
                  sizes="(min-width: 1024px) 38vw, 100vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="on-dark bg-ink py-24 md:py-36">
        <div className="mx-auto max-w-[1680px] px-5 md:px-10">
          <p data-reveal className="eyebrow mb-8">
            03 — The yard
          </p>
          <div data-reveal className="yard-map relative aspect-[4/3] overflow-hidden border border-bone/15 md:aspect-[16/7]">
            <iframe
              title="Ambika Global Traders yard"
              src={company.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute bottom-4 left-4 right-4 hidden max-w-sm border border-bone/15 bg-ink/90 p-5 md:block">
              <YardCard />
            </div>
          </div>
          <div className="mt-4 border border-bone/15 bg-ink p-5 md:hidden">
            <YardCard />
          </div>
        </div>
      </section>

      <section className="relative bg-ink py-24 md:py-36">
        <div className="mx-auto max-w-[1680px] px-5 md:px-10">
          <p data-reveal className="eyebrow mb-6">
            04 — Delivery area
          </p>
          <h2 data-reveal className="display max-w-[14ch] text-[8.6vw] leading-[1.05] text-bone md:text-[3.3vw]">
            One district. <span className="text-steel-400">Covered properly.</span>
          </h2>
          <p data-reveal className="mt-8 max-w-[60ch] text-[17px] leading-relaxed text-bone-600">
            Just outside the district? Call us anyway.
          </p>
          <div data-reveal className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {areas.map((town) => (
              <span key={town} className="flex min-h-[52px] items-center justify-center border border-bone/20 px-3 py-3 text-center font-mono text-[12px] uppercase leading-snug tracking-[0.08em] text-bone-600 sm:tracking-[0.12em]">
                {town}
              </span>
            ))}
          </div>
        </div>
      </section>

      {toast ? (
        <p role="status" className="fixed bottom-24 left-1/2 z-[70] max-w-[90vw] -translate-x-1/2 border border-bone/15 bg-ink px-4 py-2 text-center font-mono text-[12px] uppercase tracking-[0.12em] text-bone md:bottom-6">
          {toast}
        </p>
      ) : null}
    </div>
  );
}

function Reach({ label, icon, action, children, className = "" }) {
  return (
    <article className={`group flex h-full flex-col border-b border-bone/10 py-8 transition-colors last:border-b-0 hover:border-steel md:px-6 md:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-l lg:border-r-0 lg:px-8 lg:py-2 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0 lg:[&:nth-child(odd)]:border-r-0 ${className}`}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="font-mono text-[15px] font-semibold uppercase tracking-[0.16em] text-steel">{label}</p>
        {icon}
      </div>
      <div className="flex-1">{children}</div>
      <div className="mt-8">{action}</div>
    </article>
  );
}

function YardCard() {
  return (
    <>
      <p className="text-sm leading-relaxed text-bone">
        {company.address.line1}
        <br />
        {company.address.line2}
      </p>
      <a href={company.maps} target="_blank" rel="noopener noreferrer" className="btn btn-solid mt-4">
        Open the yard in Maps
      </a>
      <a href="tel:+918870183231" className="link-sweep mt-4 block font-mono text-[12px] uppercase tracking-[0.18em] text-steel">
        Call before you visit
      </a>
    </>
  );
}
