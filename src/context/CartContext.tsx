"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type { MenuItem } from "@/data/menu";

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function readSavedItems(): CartItem[] {
  try {
    const saved = localStorage.getItem("wild-geese-cart");
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((entry): entry is CartItem => {
      if (!entry || typeof entry !== "object") return false;
      const { item, quantity } = entry as { item?: unknown; quantity?: unknown };
      if (
        !item ||
        typeof item !== "object" ||
        typeof quantity !== "number" ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1
      ) {
        return false;
      }
      const menuItem = item as Partial<MenuItem>;
      return typeof menuItem.id === "string" &&
        typeof menuItem.name === "string" &&
        typeof menuItem.price === "string";
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const storageLoaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      storageLoaded.current = true;
      setItems(readSavedItems());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!storageLoaded.current) return;
    localStorage.setItem("wild-geese-cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
    } else {
      setItems((prev) =>
        prev.map((ci) =>
          ci.item.id === itemId ? { ...ci, quantity } : ci
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, ci) => sum + ci.quantity, 0);

  const totalPrice = items.reduce((sum, ci) => {
    const price = parseFloat(ci.item.price.replace(/[^0-9.]/g, "")) || 0;
    return sum + price * ci.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
