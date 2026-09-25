"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { GiftConfirmationForm } from "@/components/invitation/GiftConfirmationForm";
import { playFloralSound } from "../sound";

export interface FloralGiftProps extends TemplateComponentProps {
  isModalOpen?: boolean;
  setIsModalOpen?: (open: boolean) => void;
}

export function FloralGift({
  context,
  onTrack,
  isModalOpen,
  setIsModalOpen,
}: FloralGiftProps) {
  const gifts = context.wedding.giftAccounts ?? [];
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isModalOpen !== undefined ? isModalOpen : internalOpen;
  const setOpen = setIsModalOpen || setInternalOpen;

  if (gifts.length === 0) return null;

  const handleOpenModal = () => {
    playFloralSound("open");
    setOpen(true);
    onTrack?.("gift_view");
  };

  const handleCloseModal = () => {
    playFloralSound("click");
    setOpen(false);
  };

  return (
    <section id="section-gift" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#fbf8f3]">
      <div className="max-w-md mx-auto text-center">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 text-[#5a7263] mb-2">
            <span className="text-sm">🎁</span>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase">
              WEDDING GIFT
            </span>
            <span className="text-sm">🎁</span>
          </div>
          <h2 className="font-serif-floral text-2xl sm:text-3xl font-semibold text-[#2d4a3e]">
            Tanda Kasih
          </h2>
          <div className="w-16 h-[2px] bg-[#c5a880] mx-auto mt-3" />
          <p className="text-xs text-[#63756b] mt-3 leading-relaxed max-w-sm mx-auto">
            Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda bermaksud memberikan tanda kasih, Anda dapat mengirimkannya melalui amplop digital.
          </p>
        </div>

        {/* Action Card with Trigger Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-6 sm:p-8 border border-[#d8cfc4] shadow-xs flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-full bg-[#e8eee5] border border-[#c5a880] flex items-center justify-center text-2xl mb-4 text-[#2d4a3e] shadow-2xs">
            🎁
          </div>

          <h3 className="font-serif-floral text-xl font-bold text-[#2d4a3e] mb-1">
            Amplop Digital
          </h3>
          <p className="text-xs text-[#7a8c7e] max-w-xs mb-5 leading-relaxed">
            Tersedia opsi transfer langsung ke rekening bank atau scan QRIS digital secara aman dan praktis.
          </p>

          <motion.button
            type="button"
            onClick={handleOpenModal}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2d4a3e] hover:bg-[#233a30] text-[#fbf8f3] font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>🎁</span>
            <span>Kirim Tanda Kasih / Amplop Digital</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Popup Form Modal */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-md sm:max-w-lg max-h-[90dvh] overflow-y-auto rounded-2xl bg-[#fbf8f3] border-2 border-[#c5a880] p-4 sm:p-6 shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white hover:bg-[#e8eee5] text-[#2d4a3e] border border-[#d8cfc4] flex items-center justify-center text-sm font-bold cursor-pointer transition-colors shadow-2xs z-10"
                aria-label="Tutup Popup"
              >
                ✕
              </button>

              {/* Modal Header */}
              <div className="mb-4 pr-8">
                <div className="flex items-center gap-1.5 text-[#5a7263] mb-1">
                  <span className="text-xs">🎁</span>
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">
                    AMPLOP DIGITAL &amp; TANDA KASIH
                  </span>
                </div>
                <h3 className="font-serif-floral text-xl sm:text-2xl font-bold text-[#2d4a3e]">
                  Kirim Tanda Kasih
                </h3>
                <p className="text-xs text-[#63756b] mt-0.5 leading-relaxed">
                  Pilih rekening tujuan, salin nomor rekening, atau scan QRIS dan konfirmasikan kiriman Anda di bawah ini:
                </p>
              </div>

              {/* Form Component */}
              <GiftConfirmationForm
                weddingId={context.wedding.id}
                giftAccounts={gifts}
                defaultSenderName={context.guest?.name || ""}
                theme="floral"
                onClose={() => setOpen(false)}
                isDemo={Boolean(context.wedding?.isDemo)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
