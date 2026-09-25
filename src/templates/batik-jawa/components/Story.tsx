"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { DiamondDivider, SulurDivider, KawungBorder } from "./Ornaments";

export function BatikJawaStory({ context }: TemplateComponentProps) {
  const stories = context.wedding.stories ?? [];
  if (stories.length === 0) return null;

  return (
    <section className="relative w-full py-20 sm:py-28 overflow-hidden bg-[#FDF6E3]">
      {/* Kawung border atas & bawah */}
      <div className="absolute top-0 left-0 right-0">
        <KawungBorder color="#B8860B" height={18} />
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <KawungBorder color="#B8860B" height={18} />
      </div>

      {/* Pola latar titik halus */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #B8860B 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p
            className="font-jawa-body text-[10px] tracking-[0.45em] uppercase text-[#8B6E5A] mb-3"
            style={{ fontStyle: "normal" }}
          >
            Perjalanan Cinta
          </p>
          <h2 className="font-jawa-serif text-3xl sm:text-4xl text-[#3D2B1F]">
            Kisah Kita
          </h2>
          <div className="mt-5">
            <SulurDivider color="#B8860B" height={22} />
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Garis vertikal emas */}
          <div
            className="absolute left-5 top-0 bottom-0 w-px"
            style={{
              background: "linear-gradient(to bottom, transparent, #B8860B50, #B8860B80, #B8860B50, transparent)",
            }}
          />

          <div className="space-y-10">
            {stories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="relative pl-14"
              >
                {/* Penanda diamond di timeline */}
                <div className="absolute left-5 top-4 -translate-x-1/2 z-10">
                  <DiamondDivider color="#B8860B" size={14} />
                </div>

                {/* Kartu cerita */}
                <div
                  className="p-5 sm:p-6 border"
                  style={{
                    background: "#FEFCF7",
                    borderColor: "#D9C9A0",
                    boxShadow: "2px 2px 8px rgba(184,134,11,0.08)",
                  }}
                >
                  <span
                    className="font-jawa-body text-[9px] tracking-[0.35em] uppercase text-[#B8860B] block mb-2"
                    style={{ fontStyle: "normal" }}
                  >
                    {story.date}
                  </span>
                  <h3 className="font-jawa-serif text-lg sm:text-xl text-[#3D2B1F] mb-2">
                    {story.title}
                  </h3>
                  <p
                    className="font-jawa-body text-xs sm:text-sm text-[#5C3D2E] leading-relaxed"
                    style={{ fontStyle: "normal" }}
                  >
                    {story.description}
                  </p>
                  {story.image && (
                    <div
                      className="mt-4 overflow-hidden border"
                      style={{ borderColor: "#D9C9A0" }}
                    >
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-auto object-cover max-h-52"
                        style={{ filter: "sepia(0.1) brightness(0.95)" }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
