"use client";

import React from "react";

interface AnnouncementBarProps {
  enabled?: boolean;
  text?: string;
}

export function AnnouncementBar({
  enabled = true,
  text = "COMPLIMENTARY SHIPPING ACROSS INDIA ON ALL ORDERS",
}: AnnouncementBarProps) {
  if (!enabled || !text.trim()) return null;

  return (
    <aside
      aria-label="Announcement"
      className="w-full bg-blue-50 py-2 px-4 text-center border-hairline-b border-blue-100/60"
    >
      <p className="text-[11px] font-medium tracking-[0.22em] text-ink uppercase">
        {text}
      </p>
    </aside>
  );
}
