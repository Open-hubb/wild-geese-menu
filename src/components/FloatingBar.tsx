"use client";

import { ShoppingCart, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

interface FloatingBarProps {
  onCheckout: () => void;
}

export default function FloatingBar({ onCheckout }: FloatingBarProps) {
  const { totalItems, totalPrice, setIsCartOpen } = useCart();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="max-w-lg mx-auto flex items-center gap-3">
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsCartOpen(true)}
              className="flex-1 flex items-center justify-between px-5 py-3.5 rounded-2xl bg-bg-surface/95 backdrop-blur-md border border-accent-copper/20 shadow-xl shadow-black/40"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <ShoppingCart size={18} className="text-accent-cream" />
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center rounded-full bg-accent-copper text-[10px] font-bold text-bg-primary">
                    {totalItems}
                  </span>
                </div>
                <span className="text-sm font-medium text-accent-cream">
                  View Order
                </span>
              </div>
              <span className="text-sm font-bold text-accent-copper">
                SLL {totalPrice.toLocaleString()}
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        <button
          onClick={onCheckout}
          className="shrink-0 flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-accent-copper hover:bg-accent-copper-light text-bg-primary font-semibold text-sm shadow-xl shadow-accent-copper/25 transition-colors"
        >
          <CreditCard size={16} />
          <span>PAY BILL</span>
        </button>
      </div>
    </div>
  );
}
