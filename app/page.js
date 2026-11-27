"use client";

import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import About from "@/components/About";
import Dealers from "@/components/Dealers";
import Products from "@/components/Products";
import WhyUs from "@/components/WhyUs";
import Process from "@/components/Process";
import Areas from "@/components/Areas";
import Cut from "@/components/Cut";

export default function Home() {
  return (
    <main>
      <Hero ready />
      <Ticker />

      <Cut n="01" label="Origin" note="Erachakulam · Nagercoil" />
      <About />

      <Cut n="02" label="Provenance" note="Manufacturer-backed supply" />
      <Dealers />

      <Cut n="03" label="Catalogue" note="Retail & wholesale" />
      <Products />

      <Cut n="04" label="Assurance" note="Price · Quality · Provenance" />
      <WhyUs />

      <Cut n="05" label="Method" note="Enquiry to site" />
      <Process />

      <Cut n="06" label="Territory" note="Kanyakumari district" />
      <Areas />
    </main>
  );
}
