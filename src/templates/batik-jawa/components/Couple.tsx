"use client";
import { motion } from "framer-motion";
import type { TemplateComponentProps } from "@/types/template";
import { UkiranCorner, SulurDivider } from "./Ornaments";

export function BatikJawaCouple({ context }: TemplateComponentProps) {
  const couple = context.wedding.couple;
  if (!couple) return null;

  const groom = {
    name: couple.groomName || "Raden Prasetyo Wibowo",
    nick: couple.groomNickname || "Prasetyo",
    photo: couple.groomPhoto,
    father: couple.groomFather || "Bp. Suryo Wibowo",
    mother: couple.groomMother || "Ibu Endah Rahayu",
    instagram: couple.groomInstagram,
  };

  const bride = {
    name: couple.brideName || "Rr. Kinanti Larasati",
    nick: couple.brideNickname || "Kinanti",
    photo: couple.bridePhoto,
    father: couple.brideFather || "Bp. Heri Larasati",
    mother: couple.brideMother || "Ibu Wulandari",
    instagram: couple.brideInstagram,
  };

  const PersonCard = ({
    person,
    delay,
  }: {
    person: typeof groom;
    delay: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="flex flex-col items-center text-center"
    >
      {/* Foto dengan bingkai ukiran */}
      <div className="relative mb-5">
        {/* Ornamen sudut di 4 pojok */}
        <div className="absolute -top-2 -left-2 z-10"><UkiranCorner color="#B8860B" size={28} /></div>
        <div className="absolute -top-2 -right-2 z-10" style={{ transform: "scaleX(-1)" }}><UkiranCorner color="#B8860B" size={28} /></div>
        <div className="absolute -bottom-2 -left-2 z-10" style={{ transform: "scaleY(-1)" }}><UkiranCorner color="#B8860B" size={28} /></div>
        <div className="absolute -bottom-2 -right-2 z-10" style={{ transform: "scale(-1,-1)" }}><UkiranCorner color="#B8860B" size={28} /></div>

        {/* Foto atau placeholder */}
        <div
          className="w-32 h-32 sm:w-40 sm:h-40 overflow-hidden border-2 m-2"
          style={{ borderColor: "#B8860B66" }}
        >
          {person.photo ? (
            <img
              src={person.photo}
              alt={person.nick}
              className="w-full h-full object-cover"
              style={{ filter: "sepia(0.15) brightness(0.95)" }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #EDE0C4 0%, #D9C9A0 100%)" }}
            >
              <span className="font-jawa-serif text-3xl text-[#B8860B]">
                {person.nick.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nama lengkap */}
      <h2 className="font-jawa-serif text-xl sm:text-2xl text-[#EDE0C4] mb-1 leading-snug">
        {person.name}
      </h2>
      <p
        className="font-jawa-body text-xs tracking-[0.2em] text-[#D4A853] mb-4 uppercase"
        style={{ fontStyle: "normal" }}
      >
        Putra/Putri dari
      </p>

      {/* Nama orang tua */}
      <div className="space-y-1">
        <p className="font-jawa-body text-sm text-[#EDE0C4]/80">{person.father}</p>
        <p
          className="font-jawa-body text-[10px] tracking-widest text-[#B8860B]/60 uppercase"
          style={{ fontStyle: "normal" }}
        >
          &amp;
        </p>
        <p className="font-jawa-body text-sm text-[#EDE0C4]/80">{person.mother}</p>
      </div>

      {/* Instagram */}
      {person.instagram && (
        <a
          href={`https://instagram.com/${person.instagram.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-[10px] tracking-widest text-[#B8860B]/60 hover:text-[#D4A853] transition-colors font-jawa-body"
          style={{ fontStyle: "normal" }}
        >
          @{person.instagram.replace("@", "")}
        </a>
      )}
    </motion.div>
  );

  return (
    <section
      className="relative w-full py-20 sm:py-28 px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #3D2B1F 0%, #2D1B0E 100%)" }}
    >
      {/* Pola titik halus latar */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #D4A853 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header section */}
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
            Mempelai Berdua
          </p>
          <h2 className="font-jawa-serif text-3xl sm:text-4xl text-[#EDE0C4]">
            Yang Berbahagia
          </h2>
          <div className="mt-5">
            <SulurDivider color="#B8860B" height={22} />
          </div>
        </motion.div>

        {/* Dua mempelai tersusun rapi secara vertikal */}
        <div className="flex flex-col gap-10 max-w-md mx-auto">
          <PersonCard person={groom} delay={0.1} />

          {/* Pemisah emas antar mempelai */}
          <div className="flex items-center justify-center gap-3 my-2 px-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#B8860B]/40" />
            <span className="font-jawa-serif text-[#D4A853] text-2xl font-light italic">&amp;</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#B8860B]/40" />
          </div>

          <PersonCard person={bride} delay={0.25} />
        </div>
      </div>
    </section>
  );
}
