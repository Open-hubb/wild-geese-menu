"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-black/80 flex flex-col"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-bg-surface border-b border-accent-copper/20">
            <span className="text-sm font-serif font-semibold text-accent-cream">
              Wild Geese Checkout
            </span>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-bg-elevated border border-border hover:border-accent-copper/30 text-text-secondary hover:text-accent-cream transition-colors"
              aria-label="Close checkout"
            >
              <X size={18} />
            </button>
          </div>
          <iframe
            src="https://pay.flotme.ai/lagoonda"
            className="flex-1 w-full border-none bg-white"
            title="Payment Checkout"
            allow="payment"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
