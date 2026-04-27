import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { ConditionalLayout } from "@/components/conditional-layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jaipal Esports - Premier Gaming Tournaments",
  description: "Join India's premier eSports platform for PUBG, Free Fire, and more. Compete for real prizes in legal, regulated tournaments.",
  keywords: ["esports", "gaming", "tournaments", "PUBG", "Free Fire", "BGMI", "India"],
  authors: [{ name: "Jaipal Esports" }],
  openGraph: {
    title: "Jaipal Esports - Premier Gaming Tournaments",
    description: "Join India's premier eSports platform for PUBG, Free Fire, and more.",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
