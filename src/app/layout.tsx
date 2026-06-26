import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Wild Geese Irish Pub | Menu",
  description:
    "Browse our full menu of premium whiskeys, craft cocktails, Irish food & more. 80 Cape Road Aberdeen, Freetown, Sierra Leone.",
  openGraph: {
    title: "The Wild Geese Irish Pub | Menu",
    description:
      "Premium Whiskeys · Craft Cocktails · Irish Food — 80 Cape Road Aberdeen, Freetown, Sierra Leone",
    type: "website",
    url: "https://wild-geese-menu.vercel.app",
    siteName: "The Wild Geese Irish Pub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Wild Geese Irish Pub — View Our Menu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Wild Geese Irish Pub | Menu",
    description:
      "Premium Whiskeys · Craft Cocktails · Irish Food — Freetown, Sierra Leone",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1A1A1A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-dvh bg-bg-primary text-text-primary font-sans antialiased">
        <CartProvider>{children}</CartProvider>
        <Script
          src="https://dashboard.flotme.ai/api/public/tracker.js?id=7cbba528-25a2-4164-a879-fe54b9e9eb2f"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
