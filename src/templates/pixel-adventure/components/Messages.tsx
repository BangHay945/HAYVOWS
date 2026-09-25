"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

export function PixelMessages({ context }: TemplateComponentProps) {
  const { messages } = context;
  const [index, setIndex] = useState(0);

  if (!messages || messages.length === 0) return null;
  const current = messages[index];

  return (
    <section className="bg-[#111111] py-16 px-6">
      <div className="max-w-md mx-auto">
        <h2 className="font-mono text-[#FFD700] text-2xl font-bold text-center mb-8">
          ► MESSAGES ◄
        </h2>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="border-4 border-[#FFD700] bg-[#1a1a1a] p-6"
          >
            <p className="font-mono text-[#FFD700] text-xs mb-3 animate-pulse">
              MESSAGE UNLOCKED!
            </p>
            <p className="font-mono text-[#FFD700] text-lg font-bold mb-3">
              ★ {current.guest?.name ?? "Anonymous"}
            </p>
            <p className="font-mono text-white text-sm leading-relaxed">
              &ldquo;{current.message}&rdquo;
            </p>
            <p className="font-mono text-[#555] text-xs mt-4">♥ ♥ ♥</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setIndex(Math.max(0, index - 1))}
            disabled={index === 0}
            className="border-4 border-[#FFD700] text-[#FFD700] font-mono px-4 py-2 disabled:opacity-30 hover:bg-[#FFD700] hover:text-[#111] transition-colors cursor-pointer"
          >
            ◀ PREV
          </button>
          <span className="font-mono text-[#888] text-sm self-center">
            {index + 1} / {messages.length}
          </span>
          <button
            onClick={() => setIndex(Math.min(messages.length - 1, index + 1))}
            disabled={index === messages.length - 1}
            className="border-4 border-[#FFD700] text-[#FFD700] font-mono px-4 py-2 disabled:opacity-30 hover:bg-[#FFD700] hover:text-[#111] transition-colors cursor-pointer"
          >
            NEXT ▶
          </button>
        </div>
      </div>
    </section>
  );
}
