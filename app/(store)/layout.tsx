import React from "react";
import { getSiteSettings } from "@/lib/firestore";
import { AnnouncementBar } from "@/components/store/AnnouncementBar";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-white text-ink">
      <AnnouncementBar
        enabled={settings.announcementBar?.enabled}
        text={settings.announcementBar?.text}
      />
      <Header />
      <main className="flex-1 min-w-0">{children}</main>
      <Footer
        instagramUrl={settings.instagramUrl}
        whatsappNumber={settings.whatsappNumber}
        contactEmail={settings.contactEmail}
      />
    </div>
  );
}
