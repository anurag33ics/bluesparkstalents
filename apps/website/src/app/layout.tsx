import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://bluesparkstalents.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Bluespark Talents | Get Screened. Get Verified. Get Hired.",
  description:
    "Bluespark Talents connects verified, pre-screened candidates with hiring companies. Professional interview screening, document verification, and structured feedback so every candidate is interview-ready.",
  openGraph: {
    title: "Bluespark Talents | Get Screened. Get Verified. Get Hired.",
    description:
      "Connecting verified talent with hiring companies. Real interview screening, verified candidate profiles, and direct access for companies.",
    url: siteUrl,
    siteName: "Bluespark Talents",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bluespark Talents | Get Screened. Get Verified. Get Hired.",
    description:
      "Connecting verified talent with hiring companies. Real interview screening, verified candidate profiles, and direct access for companies.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
