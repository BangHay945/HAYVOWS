"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

export function PixelGift({ context, onTrack }: TemplateComponentProps) {
  const gifts = context.wedding.giftAccounts ?? [];
  if (gifts.length === 0) return null;

  return (
    <section className="bg-[#F2F2F2] py-16 px-6">
      <div className="max-w-md mx-auto">
        <h2 className="font-mono text-2xl font-bold text-center mb-8 border-b-4 border-[#FFD700] pb-4">
          ► WEDDING GIFT ◄
        </h2>
        <p className="font-mono text-sm text-center text-[#555] mb-6">
          Doa restu Anda adalah hadiah terbaik. Namun jika ingin memberi hadiah:
        </p>
        <div className="space-y-4">
          {gifts.map((gift) => (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => onTrack?.("gift_view")}
              className="border-4 border-[#111] bg-white p-5 shadow-[6px_6px_0px_#111]"
            >
              <p className="font-mono text-xs text-[#888] mb-1">
                {gift.type === "qris" ? "QRIS" : "BANK TRANSFER"}
              </p>
              <p className="font-mono font-bold text-lg">{gift.bankName}</p>
              <p className="font-mono text-sm mt-1">{gift.accountNo}</p>
              <p className="font-mono text-sm text-[#555]">{gift.accountName}</p>
              {gift.qrisUrl && (
                <img
                  src={gift.qrisUrl}
                  alt="QRIS"
                  className="mt-3 w-32 h-32 border-2 border-[#111] object-contain"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
