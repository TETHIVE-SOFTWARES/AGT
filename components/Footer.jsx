"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { company, nav } from "@/lib/data";

export default function Footer() {
  const pathname = usePathname();
  return (
    <footer className="hair-t relative overflow-hidden bg-ink-800">
      <div className="mx-auto max-w-[1680px] px-5 pt-20 md:px-10 md:pt-28">
        {/* ---------- Columns ---------- */}
        <div className="grid gap-12 pb-16 md:grid-cols-12 md:gap-8 md:pb-24">
          <div className="md:col-span-5">
            <div className="flex items-center gap-4">
              <Image src="/brands/agt-logo-ink.png" alt="" width={56} height={72} className="h-14 w-auto" />
              <div>
                <p className="font-display text-xl leading-tight tracking-wide text-bone">
                  AMBIKA GLOBAL
                </p>
                <p className="font-mono text-[12px] tracking-[0.12em] text-bone-500 sm:tracking-[0.28em]">
                  TRADERS · EST. {company.since}
                </p>
              </div>
            </div>
            <p className="mt-7 max-w-[42ch] text-sm leading-relaxed text-bone-600">
              A trusted building materials supplier based in Erachakulam, Nagercoil — quality cement,
              M-sand, TMT rods, bricks, blocks and construction products for retail and wholesale
              customers across Kanyakumari district.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                ["Facebook", company.social.facebook],
                ["Instagram", company.social.instagram],
                ["WhatsApp", company.social.whatsapp],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost !px-5 !py-2.5 text-[12px] tracking-[0.16em]"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-6">Quick links</p>
            <ul className="space-y-3">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="link-sweep text-sm text-bone-600 transition-colors hover:text-bone"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow mb-6">Our location</p>
            <p className="text-sm leading-relaxed text-bone-600">
              {company.address.line1}
              <br />
              {company.address.line2}
            </p>
            <div className="mt-5 space-y-1.5">
              <a
                href={`tel:${company.phones[0].replace(/\s/g, "")}`}
                className="link-sweep block text-sm text-bone"
              >
                {company.phones[0]}
              </a>
              <a href={`mailto:${company.email}`} className="link-sweep block text-sm text-bone">
                {company.email}
              </a>
            </div>

            {pathname === "/contact" ? null : (
              <div className="mt-6 overflow-hidden border border-bone/10">
                <iframe
                  title="Ambika Global Traders location"
                  src={company.mapsEmbed}
                  width="100%"
                  height="170"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block grayscale-[0.55] contrast-[1.02]"
                />
              </div>
            )}
          </div>
        </div>

        <div className="h-8 md:h-12" />
      </div>

      {/* ---------- Legal bar ---------- */}
      <div className="hair-t">
        <div className="mx-auto flex max-w-[1680px] flex-col gap-3 px-5 py-6 pb-24 font-mono text-[12px] uppercase tracking-[0.08em] text-bone-500 md:flex-row md:items-center md:justify-between md:px-10 md:pb-6 md:tracking-[0.16em]">
          <span>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </span>
          <span>{company.tagline} · Nagercoil, Tamil Nadu</span>
        </div>
      </div>
    </footer>
  );
}
