"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift as GiftIcon } from "lucide-react";
import type { TemplateComponentProps } from "@/types/template";
import { GiftConfirmationForm } from "@/components/invitation/GiftConfirmationForm";

interface NoirGiftProps extends TemplateComponentProps {
  isModalOpen?: boolean;
  setIsModalOpen?: (open: boolean) => void;
}

export function NoirGift({
  context,
  isModalOpen,
  setIsModalOpen,
}: NoirGiftProps) {
  const gifts = context.wedding.giftAccounts ?? [];
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isModalOpen !== undefined ? isModalOpen : internalOpen;
  const setOpen = setIsModalOpen || setInternalOpen;

  if (gifts.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#111111] border border-[#222222] p-6 sm:p-8 max-h-[90dvh] overflow-y-auto shadow-2xl"
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-[#777777] hover:text-[#c9a84c] transition-colors cursor-pointer z-10"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <GiftIcon className="w-3.5 h-3.5 text-[#c9a84c]" />
                <p className="font-noir-sans text-[9px] tracking-[0.4em] uppercase text-[#c9a84c]">
                  Amplop Digital
                </p>
              </div>
              <h3 className="font-noir-serif text-2xl font-light text-[#fafafa]">
                Tanda Kasih
              </h3>
              <div className="w-8 h-px bg-[#c9a84c] mt-2.5" />
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
