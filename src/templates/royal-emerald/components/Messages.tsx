"use client";

import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { MessageSquare, Heart } from "lucide-react";
import { RoyalDivider, RoyalCrown } from "./Ornaments";

export function RoyalMessages({ context }: TemplateComponentProps) {
  const messages = context.messages ?? [];

  return (
    <section className="relative w-full py-24 px-6 overflow-hidden bg-[#022c22] text-[#fdfbf7]">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <RoyalCrown className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#d4af37] font-semibold">
            Buku Tamu Kehormatan
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7] font-normal tracking-wide mt-1">
            Untaian Doa Restu
          </h2>
          <RoyalDivider className="max-w-[180px] mx-auto my-3" />
        </motion.div>

        {/* Message Cards List */}
        <div className="w-full space-y-4 max-h-[550px] overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <div className="py-12 px-6 rounded-2xl bg-[#063c2f]/30 border border-[#d4af37]/20 text-center">
              <MessageSquare className="w-8 h-8 text-[#d4af37]/50 mx-auto mb-3" />
              <p className="font-serif text-lg text-[#fdfbf7]">Belum Ada Pesan</p>
              <p className="text-xs text-[#b8c9c1] mt-1 font-light">
                Jadilah yang pertama menyampaikan doa restu untuk kedua mempelai di bagian reservasi di atas.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const senderName = msg.guest?.name || "Tamu Undangan";
              const initial = senderName.charAt(0).toUpperCase();
              const dateStr = msg.createdAt
                ? new Date(msg.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : null;

              return (
                <motion.div
                  key={msg.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (idx % 5) * 0.1 }}
                  className="p-5 rounded-2xl bg-[#063c2f]/45 backdrop-blur-md border border-[#d4af37]/30 shadow-md relative group hover:border-[#d4af37]/60 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Golden Initial Circle Avatar */}
                    <div className="w-10 h-10 rounded-full border border-[#d4af37] bg-[#02241b] flex items-center justify-center text-[#ffd700] font-serif font-bold text-sm shrink-0 shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                      {initial}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-serif text-base font-semibold text-[#fdfbf7] truncate">
                          {senderName}
                        </h4>
                        {dateStr && (
                          <span className="text-[10px] text-[#8ca89c] shrink-0 font-light">
                            {dateStr}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-[#f4eedb] leading-relaxed font-light whitespace-pre-line italic">
                        &ldquo;{msg.message}&rdquo;
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
