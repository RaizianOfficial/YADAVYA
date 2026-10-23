"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdmin } from "@/lib/adminAuth";
import { Icon } from "@/components/ui/Icon";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Dashboard", href: "/mysystem02/dashboard" },
    { label: "Products", href: "/mysystem02/products" },
    { label: "Categories", href: "/mysystem02/categories" },
    { label: "Orders", href: "/mysystem02/orders" },
    { label: "Site Settings", href: "/mysystem02/settings" },
  ];

  const handleSignOut = async () => {
    try {
      await logoutAdmin();
      router.push("/mysystem02");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-hairline-r md:min-h-screen flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-hairline-b flex items-center justify-between">
          <div>
            <span className="text-sm font-medium tracking-[0.25em] text-ink uppercase block">
              YADAVYA
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              Management Portal
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/mysystem02/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-medium tracking-wider transition-colors ${
                  isActive
                    ? "bg-blue-50 text-ink border-l-2 border-ink pl-3"
                    : "text-ink-soft hover:text-ink hover:bg-surface"
                }`}
              >
                <span>{item.label}</span>
                {isActive && <Icon name="chevronRight" size={14} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-hairline-t space-y-2 bg-surface/30">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-xs text-ink-soft hover:text-ink transition-colors tracking-wider"
          >
            <Icon name="externalLink" size={14} />
            <span>View Public Store</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-ink-soft hover:text-red-700 transition-colors tracking-wider text-left"
          >
            <span>Exit Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
