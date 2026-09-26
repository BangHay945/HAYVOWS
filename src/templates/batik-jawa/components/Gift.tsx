'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TemplateComponentProps } from '@/types/template';
import { SulurDivider } from './Ornaments';
import { GiftConfirmationForm } from '@/components/invitation/GiftConfirmationForm';
import { Gift, X } from 'lucide-react';

interface GiftProps extends TemplateComponentProps {
  isModalOpen?: boolean;
  setIsModalOpen?: (v: boolean) => void;
}

export function BatikJawaGift({ context, isModalOpen, setIsModalOpen }: GiftProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isModalOpen !== undefined ? isModalOpen : internalOpen;
  const setOpen = setIsModalOpen || setInternalOpen;

  const giftAccounts = context?.wedding?.giftAccounts ?? [];

  if (!giftAccounts || giftAccounts.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 lg:left-auto lg:right-0 lg:w-[500px] z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: 'rgba(25, 14, 7, 0.92)', backdropFilter: 'blur(6px)' }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-5 sm:p-7 text-left"
            style={{
              backgroundColor: '#2D1B0E',
              border: '1.5px solid rgba(184, 134, 11, 0.5)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(212,168,83,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Top */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer z-20 hover:scale-105"
              style={{
                backgroundColor: 'rgba(61,43,31,0.9)',
                border: '1px solid rgba(184,134,11,0.4)',
                color: '#D4A853',
              }}
              aria-label="Tutup modal"
              title="Tutup"
            >
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-5 pr-4 sm:pr-0">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-2.5"
                style={{
                  backgroundColor: 'rgba(184,134,11,0.15)',
                  border: '1.5px solid #B8860B',
                  color: '#D4A853',
                }}
              >
                <Gift size={20} />
              </div>
              <p
                className="font-jawa-body text-[10px] tracking-[0.35em] uppercase mb-1 font-semibold"
                style={{ color: '#B8860B', fontStyle: 'normal' }}
              >
                Tanda Kasih
              </p>
              <h2
                className="font-jawa-serif text-2xl sm:text-3xl font-light"
                style={{ color: '#EDE0C4' }}
              >
                Amplop Digital
              </h2>
              <div className="flex justify-center my-2.5">
                <SulurDivider color="#B8860B" width={160} height={18} />
              </div>
              <p
                className="font-jawa-body text-xs leading-relaxed max-w-sm mx-auto"
                style={{ color: '#C4A882', fontStyle: 'normal' }}
              >
                Doa restu Anda merupakan karunia terindah bagi kami. Bagi keluarga dan sahabat yang ingin memberikan tanda kasih secara digital, dapat melalui formulir berikut:
              </p>
            </div>

            {/* Standard Gift Confirmation Form */}
            <GiftConfirmationForm
              weddingId={context.wedding.id}
              giftAccounts={giftAccounts}
              defaultSenderName={context.guest?.name || ''}
              theme="jawa"
              onClose={() => setOpen(false)}
              isDemo={Boolean(context.wedding?.isDemo)}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
