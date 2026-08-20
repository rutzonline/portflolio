"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import posthog from "posthog-js";

export function UnlockClient() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting || !password) return;

    setIsSubmitting(true);
    setError(false);

    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        posthog.capture("site_unlocked");

        // Small delay to ensure the httpOnly cookie is committed
        // before the browser navigates and middleware checks it.
        // replace() prevents the back button returning to /unlock.
        await new Promise((r) => setTimeout(r, 300));
        window.location.replace("/");
      } else {
        setError(true);
        setPassword("");
        setIsSubmitting(false);
      }
    } catch {
      setError(true);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            hello!
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            enter password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="password"
              className="block w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-600 focus:border-zinc-600 focus:outline-none transition-colors [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {error && (
            <p className="text-center text-sm text-red-400">
              wrong password
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !password}
            className="flex w-full items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 transition-colors hover:bg-zinc-800 hover:border-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "enter"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}