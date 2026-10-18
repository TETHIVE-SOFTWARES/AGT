"use client";

import { useEffect, useState } from "react";
import { getJobs, submitApplication } from "@/lib/api";
import { jobs as seedJobs } from "@/data/careers";
import { company } from "@/lib/data";

const FIELD =
  "w-full rounded-[8px] border border-bone/45 bg-ink px-4 py-4 text-[17px] font-medium text-bone outline-none transition-colors placeholder:text-bone-500 focus:border-steel focus:ring-2 focus:ring-steel";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  age: "",
  qualifications: "",
  employment: "",
  position: "",
  address: "",
};

function ageFromDob(value) {
  if (!value) return "";
  const dob = new Date(value);
  if (Number.isNaN(dob.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const month = now.getMonth() - dob.getMonth();
  if (month < 0 || (month === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age >= 0 && age < 100 ? String(age) : "";
}

function validate(form, resume, jobs) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = "Give your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid email.";
  if (form.phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a phone number we can call.";
  if (!form.qualifications.trim()) errors.qualifications = "Add your qualifications.";
  if (!jobs.some((job) => job.title === form.position)) errors.position = "Choose a role.";
  if (!resume) errors.resume = "Attach your CV — PDF or Word.";
  else if (!/\.(pdf|doc|docx)$/i.test(resume.name)) errors.resume = "Use a PDF or Word file.";
  else if (resume.size > 5 * 1024 * 1024) errors.resume = "Keep the file under 5 MB.";
  return errors;
}

export default function ApplicationForm({ jobs: jobsProp, role }) {
  const [jobs, setJobs] = useState(() => (jobsProp || seedJobs).filter((job) => job.isOpen !== false));
  const [form, setForm] = useState(EMPTY);
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (jobsProp) {
      setJobs(jobsProp.filter((job) => job.isOpen !== false));
      return;
    }
    let live = true;
    getJobs().then((list) => {
      if (live) setJobs(list.filter((job) => job.isOpen !== false));
    });
    return () => {
      live = false;
    };
  }, [jobsProp]);

  useEffect(() => {
    if (!role) return;
    setForm((current) => ({ ...current, position: role }));
    setErrors((current) => ({ ...current, position: undefined }));
    setSent(false);
  }, [role]);

  const set = (key) => (event) => {
    const value = event.target.value;
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "dob") next.age = ageFromDob(value);
      return next;
    });
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const next = validate(form, resume, jobs);
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    const formData = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      gender: form.gender,
      dob: form.dob,
      age: form.age,
      qualifications: form.qualifications.trim(),
      employment: form.employment.trim(),
      position: form.position,
      address: form.address.trim(),
      resume: resume ? { name: resume.name, size: resume.size, type: resume.type } : null,
    };
    await submitApplication(formData);
    setSending(false);
    setSent(true);
  };

  return (
    <section id="apply" className="hair-t relative bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="rounded-[8px] border border-bone/10 bg-ink-800 p-6 md:p-10">
          {sent ? (
            <div>
              <p className="eyebrow mb-5">Received</p>
              <h2 className="display text-[8vw] leading-[1.05] text-bone md:text-[3.3vw]">
                We have
                <br />
                <span className="text-steel-400">your application.</span>
              </h2>
              <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-bone-600">
                The yard will be in touch about the {form.position} role.
              </p>
              <button
                type="button"
                className="btn btn-ghost mt-8"
                onClick={() => {
                  setSent(false);
                  setForm(EMPTY);
                  setResume(null);
                  setErrors({});
                }}
              >
                Send another
              </button>
            </div>
          ) : (
            <>
              <p className="eyebrow mb-5">Apply now</p>
              <h2 className="display text-[8vw] leading-[1.05] text-bone md:text-[3.3vw]">
                Professional
                <br />
                <span className="text-steel-400">recruitment service for you.</span>
              </h2>
              <form onSubmit={onSubmit} noValidate className="mt-10">
                <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
                  <Field label="Name" error={errors.name} required>
                    <input className={FIELD} aria-label="Name" autoComplete="name" value={form.name} onChange={set("name")} />
                  </Field>
                  <Field label="Email" error={errors.email} required>
                    <input className={FIELD} aria-label="Email" type="email" autoComplete="email" value={form.email} onChange={set("email")} />
                  </Field>
                  <Field label="Phone number" error={errors.phone} required>
                    <input className={FIELD} aria-label="Phone" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} />
                  </Field>
                  <Field label="Gender">
                    <div className="flex flex-wrap gap-x-6 gap-y-3 py-3">
                      {["Male", "Female", "Prefer Not To Say"].map((option) => (
                        <label key={option} className="flex cursor-pointer items-center gap-3 text-[17px] font-medium text-bone">
                          <span className="relative h-7 w-7 shrink-0">
                            <input
                              type="radio"
                              name="gender"
                              value={option}
                              checked={form.gender === option}
                              onChange={set("gender")}
                              className="peer sr-only"
                            />
                            <span className="block h-7 w-7 rounded-full border-2 border-bone/40 peer-checked:border-steel" />
                            <span className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-steel opacity-0 peer-checked:opacity-100" />
                          </span>
                          {option}
                        </label>
                      ))}
                    </div>
                  </Field>
                  <Field label="DOB">
                    <input className={FIELD} aria-label="Date of birth" type="date" value={form.dob} onChange={set("dob")} />
                  </Field>
                  <Field label="Age">
                    <input className={FIELD} aria-label="Age" inputMode="numeric" value={form.age} onChange={set("age")} />
                  </Field>
                  <Field label="Qualifications" error={errors.qualifications} required wide>
                    <input className={FIELD} aria-label="Qualifications" value={form.qualifications} onChange={set("qualifications")} />
                  </Field>
                  <Field label="Previous / current employment details" wide>
                    <textarea className={`${FIELD} resize-none`} rows={4} aria-label="Previous or current employment" value={form.employment} onChange={set("employment")} />
                  </Field>
                  <Field label="Apply for" error={errors.position} required wide>
                    <select className={FIELD} aria-label="Apply for" value={form.position} onChange={set("position")}>
                      <option value="">Select a role</option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.title}>
                          {job.title}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Address" wide>
                    <textarea className={`${FIELD} resize-none`} rows={3} aria-label="Address" value={form.address} onChange={set("address")} />
                  </Field>
                  <Field label="Upload your CV" error={errors.resume} required wide>
                    <span className="mt-1 flex flex-wrap items-center gap-4">
                      <span className="btn btn-ghost cursor-pointer !px-5 !py-2.5 text-[13px]">Choose file</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        aria-label="Upload your CV"
                        className="sr-only"
                        onChange={(event) => {
                          setResume(event.target.files?.[0] ?? null);
                          setErrors((current) => ({ ...current, resume: undefined }));
                        }}
                      />
                      <span className="text-[16px] font-medium text-bone-600">
                        {resume ? resume.name : "No file chosen"}
                      </span>
                    </span>
                    {resume ? (
                      <p className="mt-2 font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-bone-600">
                        {resume.name}
                      </p>
                    ) : null}
                  </Field>
                </div>
                <div className="mt-10 flex justify-center">
                  <button
                    type="submit"
                    className="btn btn-solid !min-w-[220px] !justify-center !px-14 !py-5 !text-[20px]"
                    disabled={sending}
                  >
                    {sending ? "Sending" : "Send"}
                  </button>
                </div>
              </form>
            </>
          )}

          <p className="mt-8 text-[17px] leading-relaxed text-bone-600">
            Or send your CV to{" "}
            <a href={`mailto:${company.email}`} className="link-sweep text-bone">
              {company.email}
            </a>
            {" / "}
            <a href={company.social.whatsapp} target="_blank" rel="noreferrer" className="link-sweep text-bone">
              WhatsApp {company.phones[1]}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

function Field({ label, error, required, wide, children }) {
  return (
    <label className={wide ? "block md:col-span-2" : "block"}>
      <span className="mb-2.5 block font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-bone">
        {label}
        {required ? "*" : ""}
      </span>
      {children}
      {error ? <p className="mt-2 text-[17px] font-medium text-sand">{error}</p> : null}
    </label>
  );
}
