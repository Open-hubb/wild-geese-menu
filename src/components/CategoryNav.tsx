"use client";

import { useRef, useEffect } from "react";
import { categories } from "@/data/menu";

interface CategoryNavProps {
  activeCategory: string;
  onCategoryClick: (slug: string) => void;
}

export default function CategoryNav({
  activeCategory,
  onCategoryClick,
}: CategoryNavProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current && navRef.current) {
      const nav = navRef.current;
      const btn = activeRef.current;
      const scrollLeft = btn.offsetLeft - nav.offsetWidth / 2 + btn.offsetWidth / 2;
      nav.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeCategory]);

  return (
    <nav className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-sm border-b border-border">
      <div
        ref={navRef}
        className="flex overflow-x-auto hide-scrollbar gap-1.5 px-4 py-3"
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              ref={isActive ? activeRef : null}
              onClick={() => onCategoryClick(cat.slug)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-accent-copper text-bg-primary shadow-lg shadow-accent-copper/25"
                  : "bg-bg-surface text-text-secondary border border-border hover:border-accent-copper/30 hover:text-accent-cream"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
