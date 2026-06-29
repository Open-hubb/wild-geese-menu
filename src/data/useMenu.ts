"use client";

import { useEffect, useState } from "react";
import { categories as fallbackCategories, type MenuCategory } from "@/data/menu";

// The menu + branding, managed in the Flot dashboard and served from its public
// per-merchant API. Falls back to bundled data so nothing renders empty if the
// dashboard is unreachable.
const MENU_API =
  "https://dashboard.flotme.ai/api/public/menu/7cbba528-25a2-4164-a879-fe54b9e9eb2f";

export interface Branding {
  restaurantName: string;
  subtitle: string;
  phone: string;
  logoUrl: string;
  checkoutUrl: string;
  currency: string;
}

interface DashboardVariant { label: string; price: number }
interface DashboardItem {
  name: string;
  price: number;
  description: string;
  subHeader: string | null;
  variants?: DashboardVariant[];
}
interface DashboardSection { id: string; title: string; image: string; items: DashboardItem[] }
interface DashboardDoc { branding?: Partial<Branding>; sections?: DashboardSection[] }

// One shared fetch for the whole document, so useMenu() and useBranding()
// don't each hit the network.
let docPromise: Promise<DashboardDoc | null> | null = null;
function fetchDoc(): Promise<DashboardDoc | null> {
  if (!docPromise) {
    docPromise = fetch(MENU_API)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
  }
  return docPromise;
}

function adapt(d: DashboardDoc): MenuCategory[] {
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

// Live preview: when embedded by the Flot dashboard editor, it streams the
// unsaved menu via postMessage. We prefer that draft over the fetched doc.
let previewDoc: DashboardDoc | null = null;
const previewSubs = new Set<() => void>();
function initPreview() {
  if (typeof window === "undefined" || window.parent === window) return;
  const w = window as unknown as { __flotPreviewInit?: boolean };
  if (w.__flotPreviewInit) return;
  w.__flotPreviewInit = true;
  window.addEventListener("message", (e: MessageEvent) => {
    if (e.origin !== "https://dashboard.flotme.ai") return;
    const data = e.data;
    if (!data || data.source !== "flot-dashboard" || data.type !== "menu-preview" || !data.menu) return;
    previewDoc = data.menu as DashboardDoc;
    previewSubs.forEach((fn) => fn());
  });
  window.parent.postMessage({ source: "flot-site", type: "preview-ready" }, "*");
}

export function useMenu(): MenuCategory[] {
  const [categories, setCategories] = useState<MenuCategory[]>(fallbackCategories);
  useEffect(() => {
    let cancelled = false;
    initPreview();
    const applyDoc = (d: DashboardDoc | null) => {
      if (cancelled || !d || !Array.isArray(d.sections) || !d.sections.length) return;
      const adapted = adapt(d);
      if (adapted.length) setCategories(adapted);
    };
    const onPreview = () => applyDoc(previewDoc);
    previewSubs.add(onPreview);
    if (previewDoc) applyDoc(previewDoc);
    else fetchDoc().then((d) => { if (!previewDoc) applyDoc(d); });
    return () => { cancelled = true; previewSubs.delete(onPreview); };
  }, []);
  return categories;
}

const EMPTY_BRANDING: Branding = {
  restaurantName: "", subtitle: "", phone: "", logoUrl: "", checkoutUrl: "", currency: "",
};

export function useBranding(): Branding {
  const [branding, setBranding] = useState<Branding>(EMPTY_BRANDING);
  useEffect(() => {
    let cancelled = false;
    initPreview();
    const applyDoc = (d: DashboardDoc | null) => {
      if (!cancelled && d && d.branding) setBranding({ ...EMPTY_BRANDING, ...d.branding });
    };
    const onPreview = () => applyDoc(previewDoc);
    previewSubs.add(onPreview);
    if (previewDoc) applyDoc(previewDoc);
    else fetchDoc().then((d) => { if (!previewDoc) applyDoc(d); });
    return () => { cancelled = true; previewSubs.delete(onPreview); };
  }, []);
  return branding;
}
