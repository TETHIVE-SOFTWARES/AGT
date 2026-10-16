"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { loginAdmin } from "@/app/admin/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-solid mt-8" disabled={pending}>
      {pending ? "Checking" : "Enter"}
    </button>
  );
}

function Eye({ off }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {off ? (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.5 10.7a2 2 0 0 0 2.8 2.8" />
          <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.2 0 8.8 4.2 10 7-0.5 1.1-1.4 2.5-2.6 3.7" />
          <path d="M6.1 6.8C4.2 8.2 2.8 10.2 2 12c1.2 2.8 4.8 7 10 7 1.1 0 2.1-.2 3.1-.5" />
        </>
      ) : (
        <>
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="2.6" />
        </>
      )}
    </svg>
  );
}

export default function AdminLogin() {
  const [state, action] = useFormState(loginAdmin, null);
  const [show, setShow] = useState(false);

  return (
    <form action={action} className="mt-10 max-w-md">
      <label className="block">
        <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-bone">Password</span>
        <span className="relative mt-2 block">
          <input
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            className="w-full border-b border-bone/35 bg-transparent py-3.5 pr-10 text-[17px] font-medium text-bone outline-none focus:border-steel"
          />
          <button
            type="button"
            onClick={() => setShow((open) => !open)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-bone-500 outline-none hover:text-bone focus-visible:text-steel"
          >
            <Eye off={show} />
          </button>
        </span>
      </label>
      {state?.error ? <p className="mt-4 text-[15px] font-medium text-sand">{state.error}</p> : null}
      <Submit />
    </form>
  );
}
