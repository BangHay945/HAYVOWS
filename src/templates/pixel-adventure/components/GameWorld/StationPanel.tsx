"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WeddingContextData, RSVPSubmitData } from "@/types/template";
import type { Story, Event } from "@/types/wedding";
import { formatDate, formatTime } from "@/lib/utils";
import { GiftConfirmationForm } from "@/components/invitation/GiftConfirmationForm";
import { play8BitSound } from "../../sound";

interface StationPanelProps {
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  context: WeddingContextData;
  resolvedGuestName: string;
  countdown: { days: number; hours: number; minutes: number; seconds: number };
  onRSVPSubmit?: (data: RSVPSubmitData) => Promise<void>;
  allMessages: any[];
  setAllMessages: React.Dispatch<React.SetStateAction<any[]>>;
}

export function StationPanel({
  activeModal,
  setActiveModal,
  context,
  resolvedGuestName,
  countdown,
  onRSVPSubmit,
  allMessages,
  setAllMessages,
}: StationPanelProps) {
  const { wedding, guest } = context;
  const couple = wedding.couple;

  // RSVP Form State
  const [rsvpStatus, setRsvpStatus] = useState<"attending" | "not_attending">("attending");
  const [rsvpCount, setRsvpCount] = useState(guest?.guestCount ?? 1);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  // Dedicated Wish Form State
  const [wishAuthor] = useState(resolvedGuestName);
  const [wishMessage, setWishMessage] = useState("");
  const [wishSubmitted, setWishSubmitted] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);

  // Gallery Modal Lightbox
  const [gallerySelected, setGallerySelected] = useState<string | null>(null);

  return (
    <>
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-[#24060ef5] border-3 sm:border-4 border-[#eab308] ring-2 ring-[#78350f] p-4 sm:p-6 max-w-md sm:max-w-lg w-full max-h-[85dvh] overflow-y-auto shadow-[0_12px_50px_rgba(0,0,0,0.95),inset_0_0_25px_rgba(234,179,8,0.25)] relative select-none font-pixel text-white"
            >
              {/* 4-Corner Gold Brackets */}
              <div className="absolute -top-2.5 -left-2.5 w-4 h-4 bg-[#fde047] border-2 border-[#78350f] shadow flex items-center justify-center text-[7px] text-[#78350f] font-black">
                ◆
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-4 h-4 bg-[#fde047] border-2 border-[#78350f] shadow flex items-center justify-center text-[7px] text-[#78350f] font-black">
                ◆
              </div>
              <div className="absolute -bottom-2.5 -left-2.5 w-4 h-4 bg-[#fde047] border-2 border-[#78350f] shadow flex items-center justify-center text-[7px] text-[#78350f] font-black">
                ◆
              </div>
              <div className="absolute -bottom-2.5 -right-2.5 w-4 h-4 bg-[#fde047] border-2 border-[#78350f] shadow flex items-center justify-center text-[7px] text-[#78350f] font-black">
                ◆
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  play8BitSound("select");
                  setActiveModal(null);
                }}
                className="absolute top-3 right-3 w-7 h-7 bg-[#e11d48] border-2 border-white text-white hover:bg-[#be123c] font-black text-xs flex items-center justify-center cursor-pointer shadow z-10"
              >
                ✕
              </button>

              {/* ---------------- 1. OUR STORY & COUPLE PROFILE ---------------- */}
              {activeModal === "couple" && (
                <div className="space-y-4">
                  <div className="text-center border-b-2 border-[#eab308]/40 pb-2.5 pr-6">
                    <span className="text-[#fde047] text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                      <span>👑</span>
                      <span>KEDUA MEMPELAI &amp; KISAH CINTA</span>
                      <span>👑</span>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#fde047] uppercase mt-0.5 drop-shadow">
                      {couple?.groomNickname || "ALEX"} &amp; {couple?.brideNickname || "SARA"}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Groom */}
                    <div className="border-2 border-[#60a5fa]/60 bg-[#3b0d19] p-3 text-center shadow-inner">
                      <span className="text-[10px] text-[#93c5fd] font-extrabold uppercase tracking-wider block mb-1">
                        ☀️ MEMPELAI PRIA
                      </span>
                      <div className="w-16 h-16 border-2 border-[#fde047] mx-auto mb-2 bg-[#24060e] flex items-center justify-center overflow-hidden shadow">
                        {couple?.groomPhoto ? (
                          <img src={couple.groomPhoto} alt="Groom" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">🤵</span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-sm text-white">{couple?.groomName || "Groom"}</h3>
                      {couple?.groomNickname && (
                        <p className="text-[#fde047] text-xs font-bold">({couple.groomNickname})</p>
                      )}
                      <p className="text-[10px] text-[#fce7f3] mt-1 leading-relaxed">
                        Putra Bpk. {couple?.groomFather || "-"}<br />&amp; Ibu {couple?.groomMother || "-"}
                      </p>
                      {couple?.groomInstagram && (
                        <a
                          href={`https://instagram.com/${couple.groomInstagram}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-2 px-2 py-0.5 bg-[#24060e] text-[#93c5fd] text-[10px] font-bold border border-[#60a5fa]/50 hover:bg-[#60a5fa] hover:text-[#24060e]"
                        >
                          @{couple.groomInstagram}
                        </a>
                      )}
                    </div>

                    {/* Bride */}
                    <div className="border-2 border-[#f472b6]/60 bg-[#3b0d19] p-3 text-center shadow-inner">
                      <span className="text-[10px] text-[#f472b6] font-extrabold uppercase tracking-wider block mb-1">
                        🌙 MEMPELAI WANITA
                      </span>
                      <div className="w-16 h-16 border-2 border-[#fde047] mx-auto mb-2 bg-[#24060e] flex items-center justify-center overflow-hidden shadow">
                        {couple?.bridePhoto ? (
                          <img src={couple.bridePhoto} alt="Bride" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">👰</span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-sm text-white">{couple?.brideName || "Bride"}</h3>
                      {couple?.brideNickname && (
                        <p className="text-[#fde047] text-xs font-bold">({couple.brideNickname})</p>
                      )}
                      <p className="text-[10px] text-[#fce7f3] mt-1 leading-relaxed">
                        Putri Bpk. {couple?.brideFather || "-"}<br />&amp; Ibu {couple?.brideMother || "-"}
                      </p>
                      {couple?.brideInstagram && (
                        <a
                          href={`https://instagram.com/${couple.brideInstagram}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-2 px-2 py-0.5 bg-[#24060e] text-[#f472b6] text-[10px] font-bold border border-[#f472b6]/50 hover:bg-[#f472b6] hover:text-[#24060e]"
                        >
                          @{couple.brideInstagram}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Love Story Timeline */}
                  {wedding.stories && wedding.stories.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#eab308]/30">
                      <h4 className="text-xs font-black text-[#fde047] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span>📖</span>
                        <span>BABAK KISAH PERJALANAN CINTA</span>
                      </h4>
                      <div className="space-y-2.5">
                        {wedding.stories.map((story: Story, i: number) => (
                          <div key={i} className="bg-[#3b0d19] border border-[#eab308]/50 p-2.5">
                            <span className="text-[10px] text-[#fde047] font-bold">
                              {story.date ? formatDate(story.date) : `Babak ${i + 1}`} • {story.title}
                            </span>
                            <p className="text-[11px] text-[#fce7f3] mt-1 leading-relaxed">{story.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ---------------- 2. WEDDING DAY (EVENTS & COUNTDOWN) ---------------- */}
              {activeModal === "event" && (
                <div className="space-y-4">
                  <div className="text-center border-b-2 border-[#eab308]/40 pb-2.5 pr-6">
                    <span className="text-[#fde047] text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                      <span>🏰</span>
                      <span>JADWAL RESEPSI AGUNG</span>
                      <span>🏰</span>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#fde047] uppercase mt-0.5 drop-shadow">
                      HARI BAHAGIA KAMI
                    </h2>
                  </div>

                  {/* Countdown Timer */}
                  <div className="bg-[#3b0d19] border-2 border-[#eab308] p-3 text-center shadow-inner">
                    <p className="text-[10px] font-bold text-[#fef08a] uppercase tracking-wider mb-2">
                      ⏱️ HITUNG MUNDUR MENUJU HARI H
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-[#24060e] border border-[#fde047]/50 p-1.5">
                        <span className="text-lg font-black text-[#fde047] block leading-none">{countdown.days}</span>
                        <span className="text-[8px] text-[#cbd5e1] uppercase">HARI</span>
                      </div>
                      <div className="bg-[#24060e] border border-[#fde047]/50 p-1.5">
                        <span className="text-lg font-black text-[#fde047] block leading-none">{countdown.hours}</span>
                        <span className="text-[8px] text-[#cbd5e1] uppercase">JAM</span>
                      </div>
                      <div className="bg-[#24060e] border border-[#fde047]/50 p-1.5">
                        <span className="text-lg font-black text-[#fde047] block leading-none">{countdown.minutes}</span>
                        <span className="text-[8px] text-[#cbd5e1] uppercase">MENIT</span>
                      </div>
                      <div className="bg-[#24060e] border border-[#fde047]/50 p-1.5">
                        <span className="text-lg font-black text-[#fde047] block leading-none">{countdown.seconds}</span>
                        <span className="text-[8px] text-[#cbd5e1] uppercase">DETIK</span>
                      </div>
                    </div>
                  </div>

                  {/* Events List */}
                  <div className="space-y-3">
                    {wedding.events?.map((ev: Event, i: number) => (
                      <div key={i} className="bg-[#3b0d19] border-2 border-[#eab308]/70 p-3 shadow">
                        <h4 className="font-black text-sm text-[#fde047] uppercase">{ev.title}</h4>
                        <p className="text-xs text-[#fce7f3] mt-1">
                          📅 {formatDate(ev.date)} • ⏰ {formatTime(ev.startTime)} - {ev.endTime ? formatTime(ev.endTime) : "Selesai"}
                        </p>
                        <p className="text-xs text-[#cbd5e1] mt-1">
                          📍 <strong className="text-white">{ev.venue}</strong> — {ev.address}
                        </p>
                        {ev.mapsUrl && (
                          <a
                            href={ev.mapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 bg-[#24060e] border border-[#fde047] text-[#fde047] hover:bg-[#fde047] hover:text-[#24060e] text-[10px] font-black uppercase tracking-wider shadow transition-colors"
                          >
                            <span>🗺️</span>
                            <span>BUKA PETA PETUNJUK ARAH (GOOGLE MAPS)</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------------- 3. RSVP REGISTRY ---------------- */}
              {activeModal === "rsvp" && (
                <div className="space-y-4">
                  <div className="text-center border-b-2 border-[#eab308]/40 pb-2.5 pr-6">
                    <span className="text-[#fde047] text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                      <span>📜</span>
                      <span>KONFIRMASI KEHADIRAN</span>
                      <span>📜</span>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#fde047] uppercase mt-0.5 drop-shadow">
                      BUKU TAMU KERAJAAN
                    </h2>
                  </div>

                  {rsvpSubmitted ? (
                    <div className="bg-[#14532d] border-2 border-[#4ade80] p-4 text-center">
                      <span className="text-3xl block mb-2">🎉</span>
                      <h4 className="font-black text-sm text-[#86efac] uppercase">KONFIRMASI TERKIRIM!</h4>
                      <p className="text-xs text-white mt-1 leading-relaxed">
                        Terima kasih telah melakukan konfirmasi kehadiran. Kehadiran Anda sangat dinantikan di pesta bahagia kami!
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (wedding.isDemo) return;
                        setRsvpLoading(true);
                        try {
                          await onRSVPSubmit?.({
                            weddingId: wedding.id,
                            guestId: guest?.id || "",
                            attendanceStatus: rsvpStatus,
                            guestCount: rsvpCount,
                          });
                          setRsvpSubmitted(true);
                          play8BitSound("success");
                        } catch {
                          alert("Gagal mengirim RSVP. Mohon coba lagi.");
                        } finally {
                          setRsvpLoading(false);
                        }
                      }}
                      className="space-y-3"
                    >
                      {wedding.isDemo && (
                        <div className="bg-[#1f050c] border border-[#eab308]/60 p-2.5 text-center space-y-1">
                          <div className="text-[9px] font-black text-[#fde047] uppercase tracking-wider">
                            MODE PRATINJAU DEMO
                          </div>
                          <p className="text-[10px] text-[#fce7f3] leading-relaxed">
                            Halaman pratinjau demo. Pengisian konfirmasi kehadiran dinonaktifkan.
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] font-bold text-[#fef08a] uppercase block mb-1">
                          NAMA TAMU UNDANGAN
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={resolvedGuestName}
                          className="w-full bg-[#3b0d19] border border-[#eab308]/60 p-2 text-xs font-bold text-white cursor-not-allowed opacity-80"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#fef08a] uppercase block mb-1">
                          STATUS KONFIRMASI KEHADIRAN
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            disabled={Boolean(wedding.isDemo)}
                            onClick={() => {
                              if (!wedding.isDemo) {
                                setRsvpStatus("attending");
                                play8BitSound("select");
                              }
                            }}
                            className={`p-2.5 text-xs font-black uppercase border-2 transition-all ${
                              wedding.isDemo ? "cursor-not-allowed opacity-80" : "cursor-pointer"
                            } ${
                              rsvpStatus === "attending"
                                ? "bg-[#eab308] border-white text-[#24060e] shadow-[2px_2px_0px_#111]"
                                : "bg-[#24060e] border-[#eab308]/40 text-[#fce7f3]"
                            }`}
                          >
                            ✓ HADIR
                          </button>
                          <button
                            type="button"
                            disabled={Boolean(wedding.isDemo)}
                            onClick={() => {
                              if (!wedding.isDemo) {
                                setRsvpStatus("not_attending");
                                play8BitSound("select");
                              }
                            }}
                            className={`p-2.5 text-xs font-black uppercase border-2 transition-all ${
                              wedding.isDemo ? "cursor-not-allowed opacity-80" : "cursor-pointer"
                            } ${
                              rsvpStatus === "not_attending"
                                ? "bg-[#eab308] border-white text-[#24060e] shadow-[2px_2px_0px_#111]"
                                : "bg-[#24060e] border-[#eab308]/40 text-[#fce7f3]"
                            }`}
                          >
                            ✕ BERHALANGAN
                          </button>
                        </div>
                      </div>

                      {rsvpStatus === "attending" && (
                        <div>
                          <label className="text-[10px] font-bold text-[#fef08a] uppercase block mb-1">
                            JUMLAH ROMBONGAN (PAX)
                          </label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4].map((num) => (
                              <button
                                key={num}
                                type="button"
                                disabled={Boolean(wedding.isDemo)}
                                onClick={() => {
                                  if (!wedding.isDemo) {
                                    setRsvpCount(num);
                                    play8BitSound("select");
                                  }
                                }}
                                className={`w-9 h-9 border-2 font-mono font-black text-xs ${
                                  wedding.isDemo ? "cursor-not-allowed opacity-75" : "cursor-pointer"
                                } ${
                                  rsvpCount === num
                                    ? "bg-[#eab308] border-white text-[#24060e]"
                                    : "bg-[#24060e] border-[#eab308]/40 text-[#fce7f3]"
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={Boolean(wedding.isDemo) || rsvpLoading}
                        className={`w-full py-2.5 font-black text-xs uppercase tracking-wider border-2 transition-all mt-2 ${
                          wedding.isDemo || rsvpLoading
                            ? "bg-[#3b0d19] border-[#eab308]/40 text-[#fce7f3]/60 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#eab308] via-[#fde047] to-[#ca8a04] text-[#451a03] border-white shadow-[2px_2px_0px_#111] cursor-pointer active:translate-y-0.5"
                        }`}
                      >
                        {wedding.isDemo ? (
                          "🔒 PENGISIAN DINONAKTIFKAN (MODE DEMO)"
                        ) : rsvpLoading ? (
                          "MENYIMPAN..."
                        ) : (
                          "⚔️ KIRIM KONFIRMASI [RSVP]"
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* ---------------- 4. KOTAK UCAPAN & DOA RESTU ---------------- */}
              {activeModal === "messages" && (
                <div className="space-y-4">
                  <div className="text-center border-b-2 border-[#eab308]/40 pb-2.5 pr-6">
                    <span className="text-[#fde047] text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                      <span>📜</span>
                      <span>PARCHMENT OF BLESSINGS</span>
                      <span>📜</span>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#fde047] uppercase mt-0.5 drop-shadow">
                      DOA &amp; UCAPAN
                    </h2>
                  </div>

                  {wedding?.isDemo && (
                    <div className="bg-[#1f050c] border border-[#eab308]/60 p-2.5 text-center space-y-1 mb-2">
                      <div className="text-[9px] font-black text-[#fde047] uppercase tracking-wider">
                        MODE PRATINJAU DEMO
                      </div>
                      <p className="text-[10px] text-[#fce7f3] leading-relaxed">
                        Halaman pratinjau demo. Pengisian ucapan dan doa restu dinonaktifkan.
                      </p>
                    </div>
                  )}

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (wedding?.isDemo) return;
                      if (!wishMessage.trim()) return;
                      setWishLoading(true);
                      const finalAuthor = (wishAuthor || resolvedGuestName || "Tamu Kehormatan").trim();
                      try {
                        const res = await fetch("/api/messages", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            weddingId: wedding.id,
                            guestId: guest?.id,
                            name: finalAuthor,
                            message: wishMessage.trim(),
                          }),
                        });
                        if (!res.ok) {
                          const errData = await res.json().catch(() => ({}));
                          throw new Error(errData.error || "Gagal mengirim ucapan");
                        }
                        const newMsg = await res.json();
                        setAllMessages((prev) => [
                          {
                            id: newMsg.id || String(Date.now()),
                            weddingId: wedding.id,
                            guestId: guest?.id || "",
                            message: wishMessage.trim(),
                            status: "approved",
                            isPinned: false,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            guest: { name: finalAuthor },
                          },
                          ...(prev || []),
                        ]);
                        setWishMessage("");
                        setWishSubmitted(true);
                        play8BitSound("success");
                      } catch (err: any) {
                        alert(err?.message || "Gagal mengirim ucapan. Mohon coba lagi.");
                      } finally {
                        setWishLoading(false);
                      }
                    }}
                    className="bg-[#1f050c] border-2 border-[#eab308]/60 p-3 sm:p-4 space-y-3 shadow"
                  >
                    <div className="flex items-center justify-between border-b border-[#eab308]/30 pb-1.5">
                      <span className="text-[11px] font-black text-[#fde047] uppercase tracking-wider flex items-center gap-1.5">
                        <span>TULIS UCAPAN &amp; DOA RESTU</span>
                      </span>
                      {wishSubmitted && (
                        <span className="text-[9px] font-bold text-[#86efac] animate-pulse">
                          UCAPAN TERKIRIM
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[9px] font-bold text-[#fef08a] uppercase">
                          NAMA PENGIRIM
                        </label>
                        <span className="text-[9px] font-mono text-[#fde047]/80 flex items-center gap-1">
                          <span>Terkunci otomatis</span>
                        </span>
                      </div>
                      <input
                        type="text"
                        readOnly
                        disabled
                        value={wishAuthor || resolvedGuestName}
                        className="w-full bg-[#180309] border-2 border-[#eab308]/60 p-2 text-xs font-mono font-bold text-[#fde047] cursor-not-allowed select-none opacity-95 shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-[#fef08a] uppercase block mb-1">
                        UNTAIAN DOA &amp; UCAPAN
                      </label>
                      <textarea
                        rows={3}
                        disabled={Boolean(wedding?.isDemo)}
                        value={wishMessage}
                        onChange={(e) => {
                          setWishMessage(e.target.value);
                          if (wishSubmitted) setWishSubmitted(false);
                        }}
                        placeholder={
                          wedding?.isDemo
                            ? "Pengisian ucapan dan doa restu dinonaktifkan pada mode demo."
                            : "Tuliskan untaian doa restu dan ucapan bahagiamu untuk kedua mempelai..."
                        }
                        className={`w-full p-2 text-xs text-white resize-none focus:outline-none ${
                          wedding?.isDemo
                            ? "bg-[#24060e] border border-[#eab308]/30 text-white/50 cursor-not-allowed"
                            : "bg-[#3b0d19] border border-[#eab308]/60 focus:border-[#fde047]"
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={Boolean(wedding?.isDemo) || wishLoading || !wishMessage.trim()}
                      className={`w-full py-2 font-black text-xs uppercase tracking-wider border transition-all ${
                        wedding?.isDemo
                          ? "bg-[#3b0d19] border-[#eab308]/40 text-[#fce7f3]/60 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#eab308] via-[#fde047] to-[#ca8a04] text-[#451a03] border-white shadow cursor-pointer disabled:opacity-50 active:translate-y-0.5"
                      }`}
                    >
                      {wedding?.isDemo ? (
                        "🔒 PENGISIAN DINONAKTIFKAN (MODE DEMO)"
                      ) : wishLoading ? (
                        "MENGIRIM..."
                      ) : (
                        "KIRIM DOA & UCAPAN"
                      )}
                    </button>
                  </form>

                  {/* Messages List */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-black text-[#fde047] uppercase tracking-wider flex items-center gap-1">
                        <span>📜</span>
                        <span>DAFTAR UCAPAN SAHABAT ({allMessages?.length || 0})</span>
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {allMessages && allMessages.length > 0 ? (
                        allMessages.map((msg, i) => (
                          <div key={msg.id || i} className="bg-[#3b0d19] border border-[#eab308]/50 p-2.5 shadow">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-black text-[#fde047]">{msg.guest?.name || "Tamu Kehormatan"}</span>
                              <span className="text-[8px] text-[#cbd5e1]">
                                {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString("id-ID") : ""}
                              </span>
                            </div>
                            <p className="text-xs text-[#fce7f3] mt-1 leading-relaxed">&ldquo;{msg.message}&rdquo;</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-[#cbd5e1] text-center py-4 bg-[#3b0d19]/40 border border-[#eab308]/30">
                          Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 5. WEDDING GIFT ---------------- */}
              {activeModal === "gift" && (
                <div className="space-y-3">
                  <div className="text-center border-b-2 border-[#eab308]/40 pb-2.5 pr-6">
                    <span className="text-[#fde047] text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                      <span>🎁</span>
                      <span>TANDA KASIH &amp; KADO DIGITAL</span>
                      <span>🎁</span>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#fde047] uppercase mt-0.5 drop-shadow">
                      AMPLOP DIGITAL
                    </h2>
                  </div>

                  <p className="text-xs text-[#fce7f3] leading-relaxed text-center">
                    Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda bermaksud memberikan tanda kasih, silakan pilih rekening dan kirim konfirmasi di bawah ini:
                  </p>

                  {wedding.giftAccounts && wedding.giftAccounts.length > 0 ? (
                    <GiftConfirmationForm
                      weddingId={wedding.id}
                      giftAccounts={wedding.giftAccounts || []}
                      defaultSenderName={resolvedGuestName}
                      theme="adventure"
                      onClose={() => setActiveModal(null)}
                      isDemo={Boolean(wedding.isDemo)}
                    />
                  ) : (
                    <div className="p-4 bg-[#3b0d19] border-2 border-[#eab308]/70 text-center text-xs text-[#fce7f3] font-mono">
                      Informasi rekening kado digital belum diatur.
                    </div>
                  )}
                </div>
              )}

              {/* ---------------- 6. GALLERY ---------------- */}
              {activeModal === "gallery" && (
                <div className="space-y-4">
                  <div className="text-center border-b-2 border-[#eab308]/40 pb-2.5 pr-6">
                    <span className="text-[#fde047] text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                      <span>💎</span>
                      <span>GALERI FOTO PREWEDDING</span>
                      <span>💎</span>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#fde047] uppercase mt-0.5 drop-shadow">
                      POTRET KENANGAN
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
                    {(wedding.galleries && wedding.galleries.length > 0 ? wedding.galleries : [
                      { id: "g1", imageUrl: "/assets/templates/pixel-adventure/characters/npcs/couple_portrait.png", caption: "Potret Bahagia Kedua Mempelai" },
                      { id: "g2", imageUrl: "/assets/templates/pixel-adventure/maps/floating-island-v1/map.png", caption: "Pulau Langit Impian" },
                      { id: "g3", imageUrl: "/assets/templates/pixel-adventure/characters/npcs/artist_portrait.png", caption: "Karya Pelukis Istana" },
                      { id: "g4", imageUrl: "/assets/templates/pixel-adventure/characters/npcs/guide_portrait.png", caption: "Pemandu Pulau Langit" },
                    ]).map((img: { id?: string; imageUrl: string; caption?: string }, i: number) => (
                      <div
                        key={i}
                        onClick={() => setGallerySelected(img.imageUrl)}
                        className="group aspect-square border-2 border-[#eab308]/60 overflow-hidden bg-[#3b0d19] cursor-pointer hover:border-white transition-all shadow relative"
                      >
                        <img src={img.imageUrl} alt={img.caption || "Gallery"} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        {img.caption && (
                          <div className="absolute inset-x-0 bottom-0 bg-[#24060e]/90 px-1.5 py-1 text-[8px] text-[#fef08a] font-bold text-center truncate">
                            {img.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox for Gallery */}
      <AnimatePresence>
        {gallerySelected && (
          <div
            onClick={() => setGallerySelected(null)}
            className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative max-w-xl max-h-[85vh] border-3 border-[#fde047] bg-[#24060e] p-2 shadow-2xl"
            >
              <img src={gallerySelected} alt="Enlarged view" className="w-full h-full object-contain" />
              <p className="text-center text-xs text-[#fef08a] mt-2 font-bold">[ KLIK DI MANA SAJA UNTUK MENUTUP ]</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
