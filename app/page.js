"use client";

import { useLayoutEffect, useState } from "react";
import Preloader from "@/components/Preloader";
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
  const [ready, setReady] = useState(false);
  const [playIntro, setPlayIntro] = useState(true);

  // The preloader is the homepage's opening shot. Replay it on a fresh visit,
  // not every time a route returns to /.
  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem("agt-introduced") === "1") {
        setPlayIntro(false);
        setReady(true);
      }
    } catch {
      /* private mode — play the intro */
    }
  }, []);

  const finishIntro = () => {
    try {
      sessionStorage.setItem("agt-introduced", "1");
    } catch {
      /* ignore */
    }
    setReady(true);
  };

  return (
    <>
      {playIntro ? <Preloader onDone={finishIntro} /> : null}

      <main>
        <Hero ready={ready} />
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
    </>
  );
}
