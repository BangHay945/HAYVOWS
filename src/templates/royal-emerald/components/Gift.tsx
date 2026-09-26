"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift as GiftIcon } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";
import { GiftConfirmationForm } from "@/components/invitation/GiftConfirmationForm";
import { RoyalCrown, RoyalDivider } from "./Ornaments";

interface RoyalGiftProps extends TemplateComponentProps {
  isModalOpen?: boolean;
  setIsModalOpen?: (open: boolean) => void;
}

export function RoyalGift({
  context,
  isModalOpen,
  setIsModalOpen,
}: RoyalGiftProps) {
  const gifts = context.wedding.giftAccounts ?? [];
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isModalOpen !== undefined ? isModalOpen : internalOpen;
  const setOpen = setIsModalOpen || setInternalOpen;

  if (gifts.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#02241b] border border-[#d4af37]/40 p-6 sm:p-8 max-h-[90dvh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-3xl"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#b8c9c1] hover:text-[#ffd700] flex items-center justify-center transition-colors cursor-pointer z-10"
              title="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6 text-center">
              <RoyalCrown className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
              <p className="text-[9px] tracking-[0.4em] uppercase text-[#d4af37] font-semibold">
                Tanda Kasih Kerajaan
              </p>
              <h3 className="font-serif text-2xl font-normal text-[#fdfbf7] mt-1">
                Amplop Digital
              </h3>
              <RoyalDivider className="max-w-[160px] mx-auto my-3" />
              <p className="text-xs text-[#b8c9c1] font-light leading-relaxed">
                Doa restu Anda merupakan karunia terindah. Namun jika ingin memberikan tanda kasih secara digital, Anda dapat melalui rekening di bawah ini:
              </p>
            </div>

            <GiftConfirmationForm
              weddingId={context.wedding.id}
              giftAccounts={gifts}
              defaultSenderName={context.guest?.name || ""}
              theme="noir"
              onClose={() => setOpen(false)}
              isDemo={Boolean(context.wedding?.isDemo)}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
