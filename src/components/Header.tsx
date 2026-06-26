"use client";

import { Phone, MapPin } from "lucide-react";
import { useBranding } from "@/data/useMenu";

export default function Header() {
  const b = useBranding();
  const address = b.subtitle || "80 Cape Road, Aberdeen";
  const phone = b.phone || "099 100 109";
  return (
    <header className="relative px-5 pt-6 pb-5 text-center">
      {/* Subtle warm radial glow behind the logo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-accent-copper/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative mb-3">
        <img
          src="/logo.png"
          alt="The Wild Geese Irish Pub"
          className="w-44 mx-auto object-contain drop-shadow-lg"
          width={176}
          height={176}
        />
      </div>
      <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-accent-copper/50 to-transparent mb-3" />
      <div className="flex items-center justify-center gap-4 text-xs text-text-secondary">
        <a
          href="https://www.google.com/maps/place/+80+CAPE+ROAD+ABERDEEN+FREETOWN+SL"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-accent-copper transition-colors"
        >
          <MapPin size={12} className="text-accent-copper/70" />
          <span>{address}</span>
        </a>
        <span className="text-border-light">|</span>
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="flex items-center gap-1.5 hover:text-accent-copper transition-colors"
        >
          <Phone size={12} className="text-accent-copper/70" />
          <span>{phone}</span>
        </a>
      </div>
    </header>
  );
}
