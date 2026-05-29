"use client";

import type { MenuCategory } from "@/data/menu";

interface CategoryGridProps {
  categories: MenuCategory[];
  onCategorySelect: (slug: string) => void;
}

export default function CategoryGrid({
  categories,
  onCategorySelect,
}: CategoryGridProps) {
  return (
    <div className="px-4 pb-6">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onCategorySelect(cat.slug)}
            className="group relative rounded-2xl overflow-hidden bg-bg-surface border border-border/40 hover:border-accent-copper/30 transition-all active:scale-[0.97]"
          >
            {/* Image */}
            {cat.image ? (
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />
              </div>
            ) : (
              <div className="aspect-[4/3] w-full bg-bg-elevated flex items-center justify-center">
                <span className="text-3xl opacity-30">🍺</span>
              </div>
            )}

            {/* Label overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="font-serif text-sm font-bold text-accent-cream leading-tight tracking-wide">
                {cat.name}
              </h3>
              <p className="text-[10px] text-accent-copper/80 mt-0.5 font-medium">
                {cat.items.length} items
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
