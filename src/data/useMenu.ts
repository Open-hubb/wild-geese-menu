"use client";

import { useEffect, useState } from "react";
import { categories as fallbackCategories, type MenuCategory } from "@/data/menu";

// The menu, managed in the Flot dashboard and served from its public per-merchant
// API. Falls back to the bundled categories so the menu never renders empty if
// the dashboard is unreachable.
const MENU_API =
  "https://dashboard.flotme.ai/api/public/menu/7cbba528-25a2-4164-a879-fe54b9e9eb2f";

interface DashboardVariant { label: string; price: number }
interface DashboardItem {
  name: string;
  price: number;
  description: string;
  subHeader: string | null;
  variants?: DashboardVariant[];
}
interface DashboardSection { id: string; title: string; image: string; items: DashboardItem[] }

function adapt(d: { sections?: DashboardSection[] }): MenuCategory[] {
  return (d.sections || []).map((s) => ({
    id: s.id,
    name: s.title,
    slug: s.id,
    image: s.image || "",
    items: (s.items || []).map((it, i) => ({
      id: `${s.id}-${i}`,
      name: it.name,
      description: it.subHeader || it.description || "",
      price:
        it.variants && it.variants.length
          ? it.variants.map((v) => `${v.label} ${v.price}`).join(" / ")
          : String(it.price ?? ""),
    })),
  }));
}

export function useMenu(): MenuCategory[] {
  const [categories, setCategories] = useState<MenuCategory[]>(fallbackCategories);

  useEffect(() => {
    let cancelled = false;
    fetch(MENU_API)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d && Array.isArray(d.sections) && d.sections.length) {
          const adapted = adapt(d);
          if (adapted.length) setCategories(adapted);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return categories;
}
