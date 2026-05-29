"use client";

import { X, Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

interface CartSheetProps {
  onCheckout: () => void;
}

export default function CartSheet({ onCheckout }: CartSheetProps) {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, clearCart, totalPrice } =
    useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 z-50"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[80dvh] bg-bg-surface rounded-t-3xl overflow-hidden flex flex-col border-t border-accent-copper/20"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-serif text-lg font-bold text-accent-cream">Your Order</h2>
              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-text-secondary hover:text-red-400 transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-elevated border border-border"
                >
                  <X size={16} className="text-text-secondary" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-3">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-text-secondary text-sm">Your cart is empty</p>
                  <p className="text-text-secondary/60 text-xs mt-1">
                    Add items from the menu to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((cartItem) => (
                    <div
                      key={cartItem.item.id}
                      className="flex items-center gap-3 py-3 border-b border-border/40 last:border-b-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-accent-cream truncate capitalize">
                          {cartItem.item.name}
                        </p>
                        <p className="text-xs text-accent-copper mt-0.5">
                          SLL {cartItem.item.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(cartItem.item.id, cartItem.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-bg-elevated border border-border text-text-secondary hover:text-accent-cream hover:border-accent-copper/30 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-semibold w-5 text-center text-accent-cream">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(cartItem.item.id, cartItem.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-bg-elevated border border-border text-text-secondary hover:text-accent-cream hover:border-accent-copper/30 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(cartItem.item.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-full text-text-secondary hover:text-red-400 transition-colors ml-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-border bg-bg-primary/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-text-secondary">Total</span>
                  <span className="text-lg font-bold text-accent-copper">
                    SLL {totalPrice.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onCheckout();
                  }}
                  className="w-full py-3.5 rounded-xl bg-accent-copper hover:bg-accent-copper-light text-bg-primary font-semibold text-sm tracking-wide transition-colors"
                >
                  PAY NOW
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
