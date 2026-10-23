"use client";

import React, { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { onAdminAuthStateChanged } from "@/lib/adminAuth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAdminAuthStateChanged((user, isAdmin) => {
      if (isAdmin && user) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[11px] uppercase tracking-[0.3em] text-ink-soft animate-pulse">
          Authenticating Atelier System...
        </div>
      </div>
    );
  }

  if (!authorized) {
    notFound();
  }

  return <>{children}</>;
}
