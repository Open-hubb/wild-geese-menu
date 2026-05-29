"use client";

import { useState, useEffect } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import type { MenuCategory, MenuItem } from "@/data/menu";
import { useCart } from "@/context/CartContext";

interface CategoryModalProps {
  category: MenuCategory | null;
  onClose: () => void;
}

function ModalItemCard({ item }: { item: MenuItem }) {
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

export default function CategoryModal({ category, onClose }: CategoryModalProps) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (category) {
      setVisible(true);
      requestAnimationFrame(() => setAnimating(true));
    } else {
      setAnimating(false);
      const timer = setTimeout(() => setVisible(false), 250);
      return () => clearTimeout(timer);
    }
  }, [category]);

  if (!visible || !category) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col transition-transform duration-250 ease-out`}
      style={{
        backgroundColor: "#171310",
        transform: animating ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.25s ease-out",
      }}
    >
      {/* Hero image header */}
      {category.image && (
        <div className="relative h-48 shrink-0 overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171310] via-[#171310]/50 to-black/20" />

          {/* Back button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#171310]/70 backdrop-blur-sm border border-[#3A3228]/50 text-[#F2E8D5] hover:bg-[#171310] transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#F2E8D5] tracking-wide drop-shadow-lg">
              {category.name}
            </h2>
            <p className="text-xs text-[#C4853A] font-medium mt-0.5">
              {category.items.length} items
            </p>
          </div>
        </div>
      )}

      {/* Fallback header without image */}
      {!category.image && (
        <div className="shrink-0 flex items-center gap-3 px-5 py-4 border-b border-[#3A3228]">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2C2620] border border-[#3A3228] text-[#F2E8D5]"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#F2E8D5] tracking-wide">
              {category.name}
            </h2>
            <p className="text-xs text-[#C4853A] font-medium">
              {category.items.length} items
            </p>
          </div>
        </div>
      )}

      {/* Scrollable items list */}
      <div className="flex-1 overflow-y-auto pb-28">
        {category.items.map((item) => (
          <ModalItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
