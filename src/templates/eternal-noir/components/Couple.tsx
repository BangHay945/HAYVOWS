"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";

export function NoirCouple({ context }: TemplateComponentProps) {
  const couple = context.wedding.couple;

  const groom = {
    name: couple?.groomName || "Alexander Pratama",
    nickname: couple?.groomNickname || "Alexander",
    father: couple?.groomFather || "",
    mother: couple?.groomMother || "",
    instagram: couple?.groomInstagram || "",
    photo: couple?.groomPhoto || null,
  };

  const bride = {
    name: couple?.brideName || "Sara Wijaya",
    nickname: couple?.brideNickname || "Sara",
    father: couple?.brideFather || "",
    mother: couple?.brideMother || "",
    instagram: couple?.brideInstagram || "",
    photo: couple?.bridePhoto || null,
  };

  return (
    <section className="relative w-full bg-[#f4efe6] flex flex-col overflow-hidden pt-12 pb-16">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#b38e36]/35 to-transparent" />

      {/* Eyebrow */}
      <div className="w-full flex flex-col items-center pt-2 pb-6 z-10 text-center">
        <p className="font-noir-sans text-[9px] tracking-[0.45em] uppercase text-[#7d7568]">
          Kedua Mempelai
        </p>
        <div className="w-8 h-px bg-[#b38e36] mt-2" />
      </div>

      {/* Groom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full flex flex-col items-center justify-center px-6 py-8 text-center"
      >
        {/* Grayscale photo with warm gold border */}
        {groom.photo ? (
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden mb-5 border-2 border-[#ded7c8] ring-1 ring-[#b38e36]/40 shadow-md">
            <img
              src={groom.photo}
              alt={groom.name}
              className="w-full h-full object-cover filter grayscale contrast-110"
            />
          </div>
        ) : (
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-[#ece5d8] border-2 border-[#ded7c8] ring-1 ring-[#b38e36]/40 flex items-center justify-center mb-5 shadow-md">
            <span className="font-noir-serif text-5xl text-[#9a792c] font-light">
              {groom.nickname.charAt(0)}
            </span>
          </div>
        )}

        <p className="font-noir-sans text-[9px] tracking-[0.35em] uppercase text-[#9a792c] mb-1.5">
          Pengantin Pria
        </p>
        <h2 className="font-noir-serif text-2xl font-light text-[#171717] tracking-wide">
          {groom.name}
        </h2>
        <div className="w-6 h-px bg-[#b38e36] my-3" />
        {(groom.father || groom.mother) && (
          <div className="text-center space-y-0.5">
            <p className="font-noir-sans text-[10px] text-[#7d7568] tracking-wide">
              Putra dari
            </p>
            {groom.father && (
              <p className="font-noir-serif text-sm text-[#333333] font-light italic">
                {groom.father}
              </p>
            )}
            {groom.mother && (
              <p className="font-noir-serif text-sm text-[#333333] font-light italic">
                {groom.mother}
              </p>
            )}
          </div>
        )}
        {groom.instagram && (
          <a
            href={`https://instagram.com/${groom.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 font-noir-sans text-[9px] tracking-[0.2em] text-[#7d7568] hover:text-[#9a792c] transition-colors"
          >
            @{groom.instagram}
          </a>
        )}
      </motion.div>

      {/* Center gold divider */}
      <div className="flex items-center justify-center gap-3 my-2 px-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#b38e36]/50" />
        <span className="font-noir-serif text-[#b38e36] text-2xl font-light italic">&amp;</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#b38e36]/50" />
      </div>

      {/* Bride */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full flex flex-col items-center justify-center px-6 py-8 text-center"
      >
        {/* Grayscale photo with warm gold border */}
        {bride.photo ? (
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden mb-5 border-2 border-[#ded7c8] ring-1 ring-[#b38e36]/40 shadow-md">
            <img
              src={bride.photo}
              alt={bride.name}
              className="w-full h-full object-cover filter grayscale contrast-110"
            />
          </div>
        ) : (
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-[#ece5d8] border-2 border-[#ded7c8] ring-1 ring-[#b38e36]/40 flex items-center justify-center mb-5 shadow-md">
            <span className="font-noir-serif text-5xl text-[#9a792c] font-light">
              {bride.nickname.charAt(0)}
            </span>
          </div>
        )}

        <p className="font-noir-sans text-[9px] tracking-[0.35em] uppercase text-[#9a792c] mb-1.5">
          Pengantin Wanita
        </p>
        <h2 className="font-noir-serif text-2xl font-light text-[#171717] tracking-wide">
          {bride.name}
        </h2>
        <div className="w-6 h-px bg-[#b38e36] my-3" />
        {(bride.father || bride.mother) && (
          <div className="text-center space-y-0.5">
            <p className="font-noir-sans text-[10px] text-[#7d7568] tracking-wide">
              Putri dari
            </p>
            {bride.father && (
              <p className="font-noir-serif text-sm text-[#333333] font-light italic">
                {bride.father}
              </p>
            )}
            {bride.mother && (
              <p className="font-noir-serif text-sm text-[#333333] font-light italic">
                {bride.mother}
              </p>
            )}
          </div>
        )}
        {bride.instagram && (
          <a
            href={`https://instagram.com/${bride.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 font-noir-sans text-[9px] tracking-[0.2em] text-[#7d7568] hover:text-[#9a792c] transition-colors"
          >
            @{bride.instagram}
          </a>
        )}
      </motion.div>
    </section>
  );
}
