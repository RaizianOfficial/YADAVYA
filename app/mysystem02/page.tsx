"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin, onAdminAuthStateChanged } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAdminAuthStateChanged((user, isAdmin) => {
      if (isAdmin && user) {
        router.replace("/mysystem02/dashboard");
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsub();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginAdmin(email, password);
      router.push("/mysystem02/dashboard");
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Invalid credentials or unauthorized.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="text-xs uppercase tracking-[0.25em] text-ink-soft animate-pulse">
          Connecting...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm border-hairline p-8 md:p-10 bg-white">
        {/* Wordmark */}
        <div className="text-center pb-8 border-hairline-b">
          <span className="text-xl font-medium tracking-[0.32em] text-ink uppercase block pl-[0.32em]">
            YADAVYA
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-ink-soft mt-1 block">
            Internal Operations
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="pt-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs tracking-wide border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-[11px] uppercase tracking-[0.2em] font-medium text-ink-soft"
            >
              Email Identifier
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@yadavya.com"
              className="w-full px-3 py-2.5 text-xs text-ink bg-white border border-line focus:border-ink outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-[11px] uppercase tracking-[0.2em] font-medium text-ink-soft"
            >
              Security Key
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2.5 text-xs text-ink bg-white border border-line focus:border-ink outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-ink text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-ink/90 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Verifying..." : "Authenticate"}
          </button>
        </form>
      </div>
    </div>
  );
}
