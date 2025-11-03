"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Failed to sign up");
      return;
    }
    r.push("/login");
  }

  return (
    <div className="mx-auto max-w-sm p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <input className="border p-2 w-full rounded" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 w-full rounded" type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button onClick={submit} className="bg-black text-white px-4 py-2 rounded w-full">Sign up</button>
      <p className="text-sm text-center text-gray-500">Already have an account? <a className="underline" href="/login">Log in</a></p>
    </div>
  );
}
