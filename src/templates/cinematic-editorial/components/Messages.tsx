"use client";

import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { MessageSquare, Sparkles, Heart } from "lucide-react";

export function EditorialMessages({ context }: TemplateComponentProps) {
  const { messages } = context;

  return (
    <section className="relative w-full py-20 px-5 sm:px-6 overflow-hidden bg-[#0a0a0c] text-[#fdfbf7]">
      <div className="relative z-10 max-w-md mx-auto space-y-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[10px] tracking-[0.3em] uppercase font-mono text-[#e8d5b5]">
            <MessageSquare className="w-3 h-3" />
            <span>LETTERS &amp; WISHES</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fdfbf7] font-light tracking-wide">
            Untaian Doa &amp; Restu
          </h2>
          <p className="text-xs text-neutral-400 font-sans max-w-xs mx-auto">
            Doa tulus dan harapan terbaik dari para sahabat dan keluarga tercinta.
          </p>
        </motion.div>

        {/* Messages List */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-neutral-400 space-y-2">
              <Heart className="w-8 h-8 text-[#e8d5b5]/40 mx-auto" />
              <p className="font-serif italic text-sm text-neutral-300">
                Jadilah yang pertama menyampaikan doa restu untuk kedua mempelai di atas.
              </p>
            </div>
          ) : (
            messages.slice(0, 15).map((msg, idx) => {
              const guestName = msg.guest?.name || "Sahabat Pengantin";
              const initial = guestName.charAt(0).toUpperCase();

              return (
                <motion.div
                  key={msg.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: Math.min(idx * 0.08, 0.5) }}
                  className="p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 space-y-2 hover:border-[#e8d5b5]/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/15 text-[#e8d5b5] font-serif font-bold text-xs flex items-center justify-center">
                        {initial}
                      </div>
                      <span className="font-serif font-normal text-sm text-[#fdfbf7]">
                        {guestName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })
                        : "Baru saja"}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed pl-10 font-sans italic">
                    &ldquo;{msg.message}&rdquo;
                  </p>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
