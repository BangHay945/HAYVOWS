"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { X, Gift as GiftIcon } from "lucide-react";
import { GiftConfirmationForm } from "@/components/invitation/GiftConfirmationForm";

interface GiftProps extends TemplateComponentProps {
  isModalOpen?: boolean;
  setIsModalOpen?: (open: boolean) => void;
}

export function EditorialGift({ context, isModalOpen, setIsModalOpen }: GiftProps) {
  const { wedding } = context;
  const giftAccounts = wedding.giftAccounts ?? [];

  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isModalOpen !== undefined ? isModalOpen : internalOpen;
  const setOpen = setIsModalOpen || setInternalOpen;

  if (giftAccounts.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-md bg-[#111115] border border-white/15 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6 text-[#fdfbf7]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-20"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2 pt-2">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center mx-auto text-[#e8d5b5]">
                <GiftIcon className="w-6 h-6" />
              </div>
              <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-[#e8d5b5] block">
                TANDA KASIH
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#fdfbf7]">
                Amplop Digital
              </h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-xs mx-auto">
                Doa restu Anda adalah hadiah terindah bagi kami. Namun jika ingin memberikan tanda kasih secara digital, silakan gunakan formulir dan rekening berikut:
              </p>
            </div>

            {/* Konfirmasi Pengiriman Tanda Kasih */}
            <div>
              <GiftConfirmationForm
                weddingId={wedding.id}
                giftAccounts={giftAccounts}
                defaultSenderName={context.guest?.name || ""}
                theme="editorial"
                onClose={() => setOpen(false)}
                isDemo={Boolean(wedding.isDemo)}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
