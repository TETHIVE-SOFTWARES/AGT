"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cover from "@/components/Cover";
import { getJobs } from "@/lib/api";
import { jobs as seedJobs } from "@/data/careers";

function posters(list) {
  return list.filter((job) => job.isOpen && (job.poster || job.image));
}

export default function CareersBoard() {
  const [jobs, setJobs] = useState(() => posters(seedJobs));

  useEffect(() => {
    let live = true;
    getJobs().then((list) => {
      if (live) setJobs(posters(list));
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <>
    <section className="bg-ink py-16 md:py-28">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center px-5 md:px-10">
        {jobs.length ? (
          <div className="grid w-full grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 sm:gap-10">
            {jobs.map((job) => (
              <div key={job.id} className="relative aspect-[640/905] w-full max-w-[420px] overflow-hidden border border-bone/10">
                <Cover
                  src={job.poster || job.image}
                  alt={job.title}
                  sizes="(max-width: 640px) 100vw, 420px"
                  className="absolute inset-0"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="max-w-[46ch] text-center text-[17px] leading-relaxed text-bone-600">
            No roles are open right now. The yard will post the next one here.
          </p>
        )}

        <Link href="/apply-now" className="btn btn-solid mt-12 md:mt-16">
          Apply now
        </Link>
      </div>
    </section>
    </>
  );
}
