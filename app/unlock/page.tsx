"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UnlockPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(true);
        setPassword("");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-full max-w-xs px-6"
      >
        <p className="text-zinc-400 text-sm tracking-wide">enter password to continue</p>

        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          autoFocus
          placeholder=""
          className="w-full bg-transparent border-0 border-b border-zinc-700 focus:border-zinc-400 outline-none text-zinc-100 text-sm py-2 text-center tracking-widest transition-colors placeholder:text-zinc-600"
        />

        {error && (
          <p className="text-xs text-red-400">wrong password</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-30 mt-1"
        >
          {loading ? "checking…" : "enter →"}
        </button>
      </form>
    </div>
  );
}