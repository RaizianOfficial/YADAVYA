import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "YADAVYA — Quiet Luxury & Measured Form",
    template: "%s — YADAVYA",
  },
  description:
    "YADAVYA is a study in minimal, premium garments crafted with architectural precision, raw material, and calm discipline.",
  keywords: ["YADAVYA", "clothing", "minimalist luxury", "menswear", "womenswear", "tailoring"],
  openGraph: {
    title: "YADAVYA — Quiet Luxury & Measured Form",
    description: "A study in minimal, premium garments crafted with architectural precision.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={instrumentSans.variable}>
      <body className="antialiased font-sans bg-white text-ink selection:bg-blue-100 selection:text-ink">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
