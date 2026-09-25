'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TemplateComponentProps } from '@/types/template';
import { GiftConfirmationForm } from '@/components/invitation/GiftConfirmationForm';
import { Gift, X } from 'lucide-react';

export interface MonogramGiftProps extends TemplateComponentProps {
  isModalOpen?: boolean;
  setIsModalOpen?: (open: boolean) => void;
}

export function MonogramGift({
  context,
  onTrack,
  isModalOpen,
  setIsModalOpen,
}: MonogramGiftProps) {
  const gifts = context.wedding.giftAccounts ?? [];
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isModalOpen !== undefined ? isModalOpen : internalOpen;
  const setOpen = setIsModalOpen || setInternalOpen;

  if (gifts.length === 0) return null;

  const handleOpenModal = () => {
    setOpen(true);
    onTrack?.('gift_view');
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <section id="section-gift" className="py-16 sm:py-20 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="text-center mb-10 space-y-2">
        <span className="text-[11px] font-semibold tracking-[0.2em] text-[#8c7e72] uppercase block">
          TANDA KASIH DIGITAL
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Amplop Digital
        </h2>
        <div className="w-12 h-0.5 bg-[#c5a880] mx-auto rounded-full mt-2" />
        <p className="text-xs sm:text-sm text-slate-500 font-light max-w-md mx-auto pt-1 leading-relaxed">
          Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda bermaksud memberikan tanda kasih, Anda dapat melalui tautan amplop digital di bawah ini.
        </p>
      </div>

      {/* Trigger Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col items-center text-center"
      >
        <div className="w-13 h-13 rounded-2xl bg-[#faf8f5] border border-[#e2d9cc] flex items-center justify-center text-[#2d4a3e] mb-4 shadow-2xs">
          <Gift className="w-6 h-6" />
        </div>

        <h3 className="font-serif text-xl font-bold text-slate-900 mb-1">
          Kirim Tanda Kasih Digital
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mb-5 leading-relaxed">
          Pemberian tanda kasih dapat disalurkan secara aman dan praktis melalui rekening bank atau transfer digital.
        </p>

        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2d4a3e] hover:bg-[#233a30] text-white font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-sm hover:shadow transition-all cursor-pointer active:scale-98"
        >
          <Gift className="w-4 h-4" />
          <span>Buka Amplop Digital</span>
        </button>
      </motion.div>

      {/* Standard Envelope Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-md sm:max-w-lg max-h-[90dvh] overflow-y-auto rounded-3xl bg-[#faf8f5] border border-[#e2d9cc] p-5 sm:p-7 shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors shadow-2xs z-10"
                aria-label="Tutup Popup"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="mb-5 pr-8">
                <div className="flex items-center gap-2 text-[#8c7e72] mb-1">
                  <Gift className="w-4 h-4 text-[#2d4a3e]" />
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">
                    TANDA KASIH &amp; AMPLOP DIGITAL
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#2d4a3e]">
                  Amplop Digital
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Pilih rekening tujuan, salin nomor rekening, dan konfirmasikan kiriman Anda di bawah ini:
                </p>
              </div>

              {/* Standard Gift Confirmation Form */}
              <GiftConfirmationForm
                weddingId={context.wedding.id}
                giftAccounts={gifts}
                defaultSenderName={context.guest?.name || ''}
                theme="monogram"
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
