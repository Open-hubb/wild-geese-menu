import type { Metadata, Viewport } from "next";
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
    description: "Premium Irish Pub in Freetown, Sierra Leone",
    type: "website",
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
      </body>
    </html>
  );
}
