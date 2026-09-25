"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

function PersonCard({
  name,
  nickname,
  father,
  mother,
  instagram,
  photo,
  label,
  role,
}: {
  name: string;
  nickname: string;
  father: string;
  mother: string;
  instagram: string;
  photo?: string | null;
  label: string;
  role: "groom" | "bride";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative rounded-2xl bg-white border border-[#d8cfc4] p-6 sm:p-8 shadow-[0_8px_30px_rgba(45,74,62,0.06)] flex flex-col items-center text-center"
    >
      {/* Decorative Corner Ornaments */}
      <span className="absolute top-3 left-3 text-xs text-[#c5a880]">❦</span>
      <span className="absolute top-3 right-3 text-xs text-[#c5a880]">❦</span>

      <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#5a7263] uppercase mb-4">
        {label}
      </span>

      {/* Portrait with botanical double border */}
      <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1.5 border-2 border-[#c5a880] shadow-sm mb-4">
        <div className="w-full h-full rounded-full overflow-hidden bg-[#f0ece4]">
          {photo ? (
            <img src={photo} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl bg-[#e8eee5] text-[#2d4a3e]">
              {role === "groom" ? "👨" : "👩"}
            </div>
          )}
        </div>
      </div>

      <h3 className="font-serif-floral text-xl sm:text-2xl font-bold text-[#2d4a3e]">
        {name || "-"}
      </h3>
      {nickname && (
        <p className="font-serif-floral text-sm italic text-[#c5a880] mt-0.5">
          ({nickname})
        </p>
      )}

      {/* Parents info */}
      <div className="mt-4 pt-4 border-t border-[#e8ded1] w-full text-xs text-[#63756b] space-y-1 leading-relaxed">
        <p className="text-[#7a8c7e] font-medium">Putra/i tercinta dari:</p>
        <p className="font-semibold text-[#2d4a3e] text-sm">{father || "-"}</p>
        <p className="text-[#c5a880] font-serif-floral italic">&amp;</p>
        <p className="font-semibold text-[#2d4a3e] text-sm">{mother || "-"}</p>

        {instagram && (
          <div className="pt-3">
            <a
              href={`https://instagram.com/${instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fbf8f3] text-[#2d4a3e] text-xs font-medium border border-[#c5a880]/50 hover:bg-[#2d4a3e] hover:text-[#fbf8f3] transition-all shadow-2xs"
            >
              <span>📷</span>
              <span>@{instagram.replace(/^@/, "")}</span>
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function FloralCouple({ context }: TemplateComponentProps) {
  const couple = context.wedding.couple;
  if (!couple) return null;

  return (
    <section id="section-couple" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#f7f4ee]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-[#5a7263] mb-2">
            <span className="text-sm">🌿</span>
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase">
              THE BRIDE &amp; GROOM
            </span>
            <span className="text-sm">🌿</span>
          </div>
          <h2 className="font-serif-floral text-2xl sm:text-3xl font-semibold text-[#2d4a3e]">
            Mempelai Bahagia
          </h2>
          <div className="w-16 h-[2px] bg-[#c5a880] mx-auto mt-3" />
        </div>

        <div className="flex flex-col gap-6 sm:gap-8 max-w-md mx-auto">
          <PersonCard
            label="Mempelai Pria"
            role="groom"
            name={couple.groomName}
            nickname={couple.groomNickname}
            father={couple.groomFather}
            mother={couple.groomMother}
            instagram={couple.groomInstagram}
            photo={couple.groomPhoto}
          />
          <PersonCard
            label="Mempelai Wanita"
            role="bride"
            name={couple.brideName}
            nickname={couple.brideNickname}
            father={couple.brideFather}
            mother={couple.brideMother}
            instagram={couple.brideInstagram}
            photo={couple.bridePhoto}
          />
        </div>
      </div>
    </section>
  );
}
