"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Cover from "@/components/Cover";
import { deleteJob, getJobs } from "@/lib/api";

function pictureOf(job) {
  return job.poster || job.image || "";
}

export default function CareersAdmin() {
  const [jobs, setJobs] = useState([]);
  const [pending, setPending] = useState(null);
  const [notice, setNotice] = useState("");
  const [noticeBad, setNoticeBad] = useState(false);

  const load = () => getJobs().then(setJobs);

  useEffect(() => {
    load();
  }, []);

  const onDelete = async () => {
    if (!pending) return;
    const job = pending;
    setPending(null);
    const result = await deleteJob(job.id);
    if (!result?.ok) {
      setNoticeBad(true);
      setNotice("Could not store this change. The role will come back after a refresh.");
      return;
    }
    setNotice("");
    load();
  };

  return (
    <div className="mx-auto max-w-[1680px] px-5 pb-16 pt-12 md:px-10 md:pb-24 md:pt-16">
      <AdminNav current="/admin/careers" />

      <div className="mb-8">
        <Link href="/admin/careers/new" className="btn btn-solid">
          Add career
        </Link>
      </div>

      {notice ? (
        <p className={`mb-6 font-mono text-[12px] uppercase tracking-[0.14em] ${noticeBad ? "text-sand" : "text-steel"}`}>
          {notice}
        </p>
      ) : null}

      <ul className="border-t border-bone/10">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="flex flex-col gap-4 border-b border-bone/10 py-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="on-dark relative h-20 w-14 shrink-0 overflow-hidden border border-bone/15 bg-ink">
                <Cover src={pictureOf(job)} alt="" sizes="56px" fit="contain" className="absolute inset-0" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-bone-600">
                  {job.isOpen ? "Open" : "Closed"}
                </p>
                <p className="truncate font-display text-lg uppercase tracking-wide text-bone">{job.title}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/admin/careers/${job.id}`} className="btn btn-ghost !px-5 !py-3">
                Edit
              </Link>
              <button type="button" onClick={() => setPending(job)} className="btn btn-ghost !px-5 !py-3">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {pending ? (
        <ConfirmDialog
          title={pending.title}
          body="This role will come off the public careers page in this browser."
          onConfirm={onDelete}
          onCancel={() => setPending(null)}
        />
      ) : null}
    </div>
  );
}
