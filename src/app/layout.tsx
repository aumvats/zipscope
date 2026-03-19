import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ZipScope — Demographic Reports from Census Data",
  description:
    "Turn Census data into client-ready demographic reports in 15 seconds. Professional PDF exports, ZIP comparisons, and saved report libraries.",
  keywords: [
    "ZIP code demographics",
    "demographic report",
    "Census data",
    "real estate demographics",
    "ZIP code comparison",
    "PDF demographic report",
    "ACS data",
    "population by ZIP code",
  ],
  openGraph: {
    title: "ZipScope",
    description:
      "Turn Census data into client-ready demographic reports in 15 seconds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZipScope",
    description:
      "Turn Census data into client-ready demographic reports in 15 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${inter.variable} font-body antialiased bg-bg text-text-primary`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
