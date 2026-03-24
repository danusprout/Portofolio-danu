import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Syahrial Danu",
  description: "Portfolio of Syahrial Danu, a Fullstack Developer specializing in Next.js, Flutter, NestJS, and AI integrations.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Syahrial Danu",
    description:
      "Portfolio of Syahrial Danu, a Fullstack Developer specializing in Next.js, Flutter, NestJS, and AI integrations.",
    url: siteUrl,
    siteName: "Syahrial Danu Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syahrial Danu",
    description:
      "Portfolio of Syahrial Danu, a Fullstack Developer specializing in Next.js, Flutter, NestJS, and AI integrations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
