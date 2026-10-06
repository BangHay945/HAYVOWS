"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift as GiftIcon } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";
import { GiftConfirmationForm } from "@/components/invitation/GiftConfirmationForm";

interface VintageRoyalGiftProps extends TemplateComponentProps {
  isModalOpen?: boolean;
  setIsModalOpen?: (open: boolean) => void;
}

export function VintageRoyalGift({
  context,
  isModalOpen,
  setIsModalOpen,
}: VintageRoyalGiftProps) {
  const gifts = context.wedding.giftAccounts ?? [];
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = isModalOpen !== undefined ? isModalOpen : internalOpen;
  const setOpen = setIsModalOpen || setInternalOpen;

  if (gifts.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#1c1e22] border border-[#d5be9b]/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-6 sm:p-8 max-h-[90dvh] overflow-y-auto text-[#f8f6f0]"
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#141517] border border-white/10 hover:border-[#d5be9b]/50 text-[#b8b5ad] hover:text-[#f8f6f0] flex items-center justify-center transition-colors cursor-pointer z-10"
              title="Tutup"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center mb-6 space-y-2 pt-1">
              <div className="w-12 h-12 rounded-full bg-[#141517] border border-[#d5be9b]/40 text-[#d5be9b] flex items-center justify-center mx-auto">
                <GiftIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-[#d5be9b] block">
                Tanda Kasih
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-light text-[#f8f6f0]">
                Amplop Digital
              </h3>
              <div className="w-8 h-px bg-[#d5be9b]/50 mx-auto" />
              <p className="text-xs text-[#b8b5ad] font-serif italic leading-relaxed max-w-xs mx-auto">
                Doa restu Anda merupakan karunia terindah bagi kami. Bagi yang ingin memberikan tanda kasih secara digital, dapat melalui formulir berikut.
              </p>
            </div>

            <GiftConfirmationForm
              weddingId={context.wedding.id}
              giftAccounts={gifts}
              defaultSenderName={context.guest?.name || ""}
              theme="ivory"
              onClose={() => setOpen(false)}
              isDemo={Boolean(context.wedding?.isDemo)}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
