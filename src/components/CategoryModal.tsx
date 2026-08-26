"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, ArrowLeft, ShoppingCart, Check } from "lucide-react";
import type { MenuCategory, MenuItem } from "@/data/menu";
import { useCart } from "@/context/CartContext";

interface CategoryModalProps {
  category: MenuCategory | null;
  onClose: () => void;
  onOpenCart: () => void;
}

function ModalItemCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addItem(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 800);
  };

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
          {item.currency || "SLL"} {item.price}
        </p>
      </div>
      <button
        onClick={handleAdd}
        className={`shrink-0 mt-1 w-8 h-8 flex items-center justify-center rounded-full border transition-all active:scale-95 ${
          justAdded
            ? "border-green-500/60 bg-green-500/20 text-green-400 scale-110"
            : "border-accent-copper/40 bg-accent-copper/10 hover:bg-accent-copper/25 text-accent-copper hover:scale-110"
        }`}
        aria-label={`Add ${item.name} to cart`}
      >
        {justAdded ? <Check size={16} /> : <Plus size={16} />}
      </button>
    </div>
  );
}

function FloatingCartBadge({ onOpenCart }: { onOpenCart: () => void }) {
  const { totalItems, totalPrice, currency } = useCart();
  const [bounce, setBounce] = useState(false);
  const prevCount = useRef(totalItems);

  useEffect(() => {
    if (totalItems > prevCount.current) {
      setBounce(true);
      setTimeout(() => setBounce(false), 400);
    }
    prevCount.current = totalItems;
  }, [totalItems]);

  if (totalItems === 0) return null;

  return (
    <button
      onClick={onOpenCart}
      className={`fixed bottom-6 right-5 z-[70] flex items-center gap-2.5 pl-4 pr-5 py-3 rounded-2xl bg-[#211D18] border border-[#C4853A]/30 shadow-2xl shadow-black/50 transition-transform ${
        bounce ? "scale-110" : "scale-100"
      }`}
      style={{ transition: "transform 0.2s ease-out" }}
    >
      <div className="relative">
        <ShoppingCart size={18} className="text-[#F2E8D5]" />
        <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#C4853A] text-[10px] font-bold text-[#171310] px-1">
          {totalItems}
        </span>
      </div>
      <span className="text-sm font-bold text-[#C4853A]">
        {currency} {totalPrice.toLocaleString()}
      </span>
    </button>
  );
}

export default function CategoryModal({ category, onClose, onOpenCart }: CategoryModalProps) {
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
      className="fixed inset-0 z-[60] flex flex-col"
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
      <div className="flex-1 overflow-y-auto pb-24">
        {category.items.map((item) => (
          <ModalItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Floating cart badge inside the modal */}
      <FloatingCartBadge onOpenCart={onOpenCart} />
    </div>
  );
}
