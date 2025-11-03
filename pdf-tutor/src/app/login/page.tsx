"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) { setErr("Invalid email or password"); return; }
    window.location.href = "/dashboard";
  }

  return (
    <div className="mx-auto max-w-sm p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Log in</h1>
      <input className="border p-2 w-full rounded" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 w-full rounded" type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button onClick={submit} className="bg-black text-white px-4 py-2 rounded w-full">Sign in</button>
      <p className="text-sm text-center text-gray-500">No account? <a className="underline" href="/signup">Create one</a></p>
    </div>
  );
}
