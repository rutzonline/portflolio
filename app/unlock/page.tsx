"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function UnlockPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || loading) return;
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setSuccess(true);
        // Small delay so loading state is visible before redirect
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 600);
      } else {
        setError(true);
        setPassword("");
      }
    } catch {
      setError(true);
    } finally {
      if (!success) setLoading(false);
    }
  }

  // Full-screen loading overlay after correct password
  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6 w-full max-w-sm"
      >
        <p className="text-zinc-400 text-base tracking-wide">
          enter password to continue
        </p>

        {/* Password input with show/hide toggle */}
        <div className="w-full relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            autoFocus
            className="w-full bg-transparent border-0 border-b border-zinc-700 focus:border-zinc-400 outline-none text-zinc-100 text-base py-3 text-center tracking-widest transition-colors pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400 -mt-2">wrong password</p>
        )}

        {/* Submit button — proper button, not text */}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-2.5 rounded-lg border border-zinc-700 text-zinc-100 text-sm tracking-wide hover:border-zinc-500 hover:bg-zinc-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? "checking…" : "enter"}
        </button>
      </form>
    </div>
  );
}