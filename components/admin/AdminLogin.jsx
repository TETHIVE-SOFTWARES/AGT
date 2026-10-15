"use client";

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

export default function AdminLogin() {
  const [state, action] = useFormState(loginAdmin, null);

  return (
    <form action={action} className="mt-10 max-w-md">
      <label className="block">
        <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-bone">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full border-b border-bone/35 bg-transparent px-0 py-3.5 text-[17px] font-medium text-bone outline-none focus:border-steel"
        />
      </label>
      {state?.error ? <p className="mt-4 text-[15px] font-medium text-sand">{state.error}</p> : null}
      <Submit />
    </form>
  );
}
