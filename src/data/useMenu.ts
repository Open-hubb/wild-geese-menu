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

interface DashboardVariant { label: string; price: string }
interface DashboardItem {
  name: string;
  price: string;
  description: string;
  subHeader: string;
  variants: DashboardVariant[];
}
interface DashboardSection { id: string; title: string; image: string; items: DashboardItem[] }
interface DashboardDoc { branding?: Partial<Branding>; sections: DashboardSection[] }

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function nonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function price(value: unknown): string | null {
  return typeof value === "number" && Number.isFinite(value)
    ? String(value)
    : typeof value === "string" && value.trim()
      ? value
      : null;
}

function normalizeDoc(value: unknown): DashboardDoc | null {
  const doc = asRecord(value);
  if (!doc || !Array.isArray(doc.sections)) return null;

  const sections = doc.sections.flatMap((rawSection) => {
    const section = asRecord(rawSection);
    const id = nonEmptyString(section?.id);
    const title = nonEmptyString(section?.title);
    if (!section || !id || !title || !Array.isArray(section.items)) return [];

    const items = section.items.flatMap((rawItem): DashboardItem[] => {
      const item = asRecord(rawItem);
      const name = nonEmptyString(item?.name);
      const itemPrice = price(item?.price);
      if (!item || !name || !itemPrice) return [];

      const variants = Array.isArray(item.variants)
        ? item.variants.flatMap((rawVariant): DashboardVariant[] => {
            const variant = asRecord(rawVariant);
            const label = nonEmptyString(variant?.label);
            const variantPrice = price(variant?.price);
            return label && variantPrice ? [{ label, price: variantPrice }] : [];
          })
        : [];

      return [{
        name,
        price: itemPrice,
        description: text(item.description),
        subHeader: text(item.subHeader),
        variants,
      }];
    });

    return items.length ? [{ id, title, image: text(section.image), items }] : [];
  });

  // A dashboard response without usable sellable items must never replace the
  // bundled menu: it would turn an API migration or bad draft into an empty site.
  if (!sections.length) return null;

  const branding = asRecord(doc.branding);
  return {
    sections,
    branding: branding
      ? {
          restaurantName: text(branding.restaurantName),
          subtitle: text(branding.subtitle),
          phone: text(branding.phone),
          logoUrl: text(branding.logoUrl),
          checkoutUrl: text(branding.checkoutUrl),
          currency: text(branding.currency),
        }
      : undefined,
  };
}

// One shared fetch for the whole document, so useMenu() and useBranding()
// don't each hit the network.
let docPromise: Promise<DashboardDoc | null> | null = null;
function fetchDoc(): Promise<DashboardDoc | null> {
  if (!docPromise) {
    docPromise = fetch(MENU_API)
      .then(async (r) => (r.ok ? normalizeDoc(await r.json()) : null))
      .catch(() => null);
  }
  return docPromise;
}

function adapt(d: DashboardDoc): MenuCategory[] {
  const currency = d.branding?.currency || "SLL";
  return d.sections.map((s) => ({
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
          : it.price,
      currency,
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
    const normalized = normalizeDoc(data.menu);
    if (normalized) {
      previewDoc = normalized;
      previewSubs.forEach((fn) => fn());
    }
  });
  window.parent.postMessage(
    { source: "flot-site", type: "preview-ready" },
    "https://dashboard.flotme.ai"
  );
}

export function useMenu(): MenuCategory[] {
  const [categories, setCategories] = useState<MenuCategory[]>(fallbackCategories);
  useEffect(() => {
    let cancelled = false;
    initPreview();
    const applyDoc = (d: DashboardDoc | null) => {
      if (cancelled || !d) return;
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
