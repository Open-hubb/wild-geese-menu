"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import MenuSection from "@/components/MenuSection";
import FloatingBar from "@/components/FloatingBar";
import CartSheet from "@/components/CartSheet";
import CheckoutModal from "@/components/CheckoutModal";
import { categories } from "@/data/menu";

export default function Home() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(categories[0].slug);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleToggle = useCallback((slug: string) => {
    setOpenCategory((prev) => (prev === slug ? null : slug));
  }, []);

  const handleCategoryClick = useCallback((slug: string) => {
    setActiveCategory(slug);
    // Open the category
    setOpenCategory(slug);
    // Wait for React to render the open state + animation to begin, then scroll
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById(`category-${slug}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 350);
    });
  }, []);

  return (
    <main className="pb-28">
      <Header />
      <CategoryNav
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />
      <div className="max-w-lg mx-auto">
        {categories.map((category) => (
          <MenuSection
            key={category.slug}
            category={category}
            isOpen={openCategory === category.slug}
            onToggle={() => handleToggle(category.slug)}
          />
        ))}
      </div>
      <footer className="mt-12 pb-8 text-center">
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
      <FloatingBar onCheckout={() => setIsCheckoutOpen(true)} />
      <CartSheet onCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </main>
  );
}
