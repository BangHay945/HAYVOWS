"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift as GiftIcon } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";
import { GiftConfirmationForm } from "@/components/invitation/GiftConfirmationForm";

interface CinematicIvoryGiftProps extends TemplateComponentProps {
  isModalOpen?: boolean;
  setIsModalOpen?: (open: boolean) => void;
}

export function CinematicIvoryGift({
  context,
  isModalOpen,
  setIsModalOpen,
}: CinematicIvoryGiftProps) {
  const gifts = context.wedding.giftAccounts ?? [];
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = isModalOpen !== undefined ? isModalOpen : internalOpen;
  const setOpen = setIsModalOpen || setInternalOpen;

  if (gifts.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#141519] border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-6 sm:p-8 max-h-[90dvh] overflow-y-auto text-[#f5f3ef]"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-[#8a8b90] hover:text-[#f5f3ef] transition-colors duration-200 cursor-pointer z-10"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <GiftIcon className="w-3.5 h-3.5 text-[#d4c4b0]" />
                <p className="font-ci-sans text-[8px] tracking-[0.45em] uppercase text-[#8a8b90]">
                  Amplop Digital
                </p>
              </div>
              <h3 className="font-ci-serif text-2xl font-light text-[#f5f3ef]">
                Tanda Kasih
              </h3>
              <div className="w-8 h-px bg-[#d4c4b0] mt-3" />
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
