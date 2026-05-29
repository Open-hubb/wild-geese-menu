"use client";

import { Plus, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MenuCategory, MenuItem } from "@/data/menu";
import { useCart } from "@/context/CartContext";

interface MenuSectionProps {
  category: MenuCategory;
  isOpen: boolean;
  onToggle: () => void;
}

function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();

  return (
    <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border/30 last:border-b-0 active:bg-bg-elevated/50 transition-colors">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-accent-cream capitalize leading-tight">
          {item.name}
        </h3>
        {item.description && item.description !== "—" && (
          <p className="mt-1 text-xs text-text-secondary leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
        <p className="mt-1.5 text-sm font-semibold text-accent-copper">
          SLL {item.price}
        </p>
      </div>
      <button
        onClick={() => addItem(item)}
        className="shrink-0 mt-1 w-8 h-8 flex items-center justify-center rounded-full border border-accent-copper/40 bg-accent-copper/10 hover:bg-accent-copper/25 text-accent-copper transition-all hover:scale-110 active:scale-95"
        aria-label={`Add ${item.name} to cart`}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

export default function MenuSection({ category, isOpen, onToggle }: MenuSectionProps) {
  return (
    <section id={`category-${category.slug}`} className="scroll-mt-16">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-5 group transition-colors hover:bg-bg-surface/50"
      >
        {/* Category name */}
        <h2 className="font-serif text-base font-bold text-accent-cream tracking-widest uppercase shrink-0">
          {category.name}
        </h2>

        {/* Item count badge */}
        <span className="shrink-0 text-[11px] font-medium text-accent-copper bg-accent-copper/10 border border-accent-copper/20 px-2.5 py-0.5 rounded-full">
          {category.items.length} items
        </span>

        {/* Dotted line fill */}
        <span className="flex-1 border-b border-dashed border-border-light/60 min-w-[20px] translate-y-[-1px]" />

        {/* Chevron */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-accent-copper/60 group-hover:text-accent-copper transition-colors"
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Category image banner (if exists) */}
            {category.image && (
              <div className="relative h-32 mx-5 mb-3 rounded-xl overflow-hidden border border-border/50">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 to-transparent" />
              </div>
            )}

            {/* Items list */}
            <div className="border-t border-border/30">
              {category.items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>

            {/* Bottom spacer */}
            <div className="h-2" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider between sections */}
      {!isOpen && <div className="mx-5 border-b border-border/20" />}
    </section>
  );
}
