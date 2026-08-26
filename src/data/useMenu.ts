"use client";

import { useEffect, useState } from "react";
import { categories, type MenuCategory, type MenuItem } from "@/data/menu";

const DASHBOARD_ORIGIN = "https://dashboard.flotme.ai";
const MERCHANT_ID = "7cbba528-25a2-4164-a879-fe54b9e9eb2f";
const MENU_API_URL = `${DASHBOARD_ORIGIN}/api/public/menu/${MERCHANT_ID}`;

export interface MenuBranding {
  restaurantName: string;
  phone: string;
  logoUrl: string;
  currency: string;
}

export interface MenuData {
  categories: MenuCategory[];
  branding: MenuBranding;
}

const FALLBACK_MENU: MenuData = {
  categories,
  branding: {
    restaurantName: "The Wild Geese Irish Pub",
    phone: "099 100 109",
    logoUrl: "",
    currency: "SLL",
  },
};

let menuRequest: Promise<MenuData | null> | undefined;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function menuFromDashboard(value: unknown): MenuData | null {
  const menu = asRecord(value);
  if (!menu || !Array.isArray(menu.sections)) return null;

  const branding = asRecord(menu.branding);
  const currency = stringValue(branding?.currency, FALLBACK_MENU.branding.currency);
  const remoteCategories = menu.sections.flatMap((rawSection) => {
    const section = asRecord(rawSection);
    const id = stringValue(section?.id);
    const name = stringValue(section?.title);
    if (!section || !id || !name || !Array.isArray(section.items)) return [];

    const items = section.items.flatMap((rawItem, index): MenuItem[] => {
      const item = asRecord(rawItem);
      const itemName = stringValue(item?.name);
      const price = item?.price;
      if (!item || !itemName || (typeof price !== "number" && typeof price !== "string")) return [];

      return [{
        id: `${id}-${stringValue(item.itemNumber, String(index))}`,
        name: itemName,
        description: stringValue(item.description),
        price: String(price),
        currency,
      }];
    });

    return [{
      id,
      name,
      slug: id,
      image: stringValue(section.image),
      items,
    }];
  });

  // A 200 response with no usable menu is not live content. Preserve the
  // bundled menu so a dashboard outage or partial migration cannot empty the site.
  if (!remoteCategories.some((category) => category.items.length > 0)) return null;

  return {
    categories: remoteCategories,
    branding: {
      restaurantName: stringValue(branding?.restaurantName, FALLBACK_MENU.branding.restaurantName),
      phone: stringValue(branding?.phone, FALLBACK_MENU.branding.phone),
      logoUrl: stringValue(branding?.logoUrl),
      currency,
    },
  };
}

function loadDashboardMenu() {
  if (!menuRequest) {
    menuRequest = fetch(MENU_API_URL, { cache: "no-store" })
      .then(async (response) => response.ok ? menuFromDashboard(await response.json()) : null)
      .catch(() => null);
  }
  return menuRequest;
}

function isEmbedded() {
  try {
    return window.top !== window.self;
  } catch {
    return true;
  }
}

export function useMenu() {
  const [menu, setMenu] = useState<MenuData>(FALLBACK_MENU);

  useEffect(() => {
    let cancelled = false;
    void loadDashboardMenu().then((nextMenu) => {
      if (!cancelled && nextMenu) setMenu(nextMenu);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isEmbedded()) return;

    function receivePreview(event: MessageEvent) {
      if (
        event.origin !== DASHBOARD_ORIGIN ||
        event.data?.source !== "flot-dashboard" ||
        event.data?.type !== "menu-preview"
      ) return;

      const previewMenu = menuFromDashboard(event.data.menu);
      if (previewMenu) setMenu(previewMenu);
    }

    window.addEventListener("message", receivePreview);
    window.parent.postMessage(
      { source: "flot-site", type: "preview-ready" },
      DASHBOARD_ORIGIN
    );
    return () => window.removeEventListener("message", receivePreview);
  }, []);

  return menu;
}
