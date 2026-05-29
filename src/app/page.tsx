"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import CategoryGrid from "@/components/CategoryGrid";
import CategoryModal from "@/components/CategoryModal";
import FloatingBar from "@/components/FloatingBar";
import CartSheet from "@/components/CartSheet";
import CheckoutModal from "@/components/CheckoutModal";
import { categories } from "@/data/menu";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const activeCategory = selectedCategory
    ? categories.find((c) => c.slug === selectedCategory) ?? null
    : null;

  const handleCategorySelect = useCallback((slug: string) => {
    setSelectedCategory(slug);
  }, []);

  const handleCloseCategory = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  return (
    <main className="pb-28">
      <Header />

      {/* Section label */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-lg font-bold text-accent-cream tracking-wide">
            Our Menu
          </h2>
          <div className="flex-1 border-b border-dashed border-border-light/40" />
          <span className="text-xs text-text-secondary">
            {categories.length} categories
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        <CategoryGrid
          categories={categories}
          onCategorySelect={handleCategorySelect}
        />
      </div>

      <footer className="mt-8 pb-8 text-center">
        <div className="w-12 h-px mx-auto bg-gradient-to-r from-transparent via-accent-copper/30 to-transparent mb-4" />
        <p className="text-xs text-text-secondary/50">
          &copy; 2024 The Wild Geese Irish Pub &middot; Freetown, Sierra Leone
        </p>
        <p className="text-[10px] text-text-secondary/30 mt-1">
          Powered by{" "}
          <a
            href="https://www.flotme.ai/business"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-copper transition-colors"
          >
            Flot Business
          </a>
        </p>
      </footer>

      {/* Category detail modal */}
      <CategoryModal
        category={activeCategory}
        onClose={handleCloseCategory}
      />

      {/* Cart & Checkout */}
      <FloatingBar onCheckout={() => setIsCheckoutOpen(true)} />
      <CartSheet onCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </main>
  );
}
