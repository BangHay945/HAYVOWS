"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WeddingContextData, RSVPSubmitData } from "@/types/template";
import type { Story, Event, Gallery } from "@/types/wedding";
import { formatDate, formatTime } from "@/lib/utils";
import { GiftConfirmationForm } from "@/components/invitation/GiftConfirmationForm";
import { playCyberSound } from "../../sound";

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

  // Wishes Form State
  const [wishAuthor] = useState(resolvedGuestName);
  const [wishMessage, setWishMessage] = useState("");
  const [wishLoading, setWishLoading] = useState(false);
  const [wishSuccess, setWishSuccess] = useState(false);

  // Gallery Modal Lightbox
  const [gallerySelected, setGallerySelected] = useState<string | null>(null);

  // RSVP submission
  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest) return;
    setRsvpLoading(true);
    try {
      await onRSVPSubmit?.({
        guestId: guest.id,
        weddingId: wedding.id,
        attendanceStatus: rsvpStatus,
        guestCount: rsvpCount,
        message: "",
      });
      setRsvpSubmitted(true);
      playCyberSound("fanfare");
    } catch {
      alert("Gagal mengirim RSVP. Silakan coba lagi.");
    } finally {
      setRsvpLoading(false);
    }
  };

  // Wish submission
  const handleSendWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishMessage.trim()) return;
    setWishLoading(true);
    try {
      const author = (wishAuthor || resolvedGuestName || "VIP CYBER GUEST").trim();
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weddingId: wedding.id,
          guestId: guest?.id,
          name: author,
          message: wishMessage.trim(),
        }),
      });
      if (res.ok) {
        const newMsg = await res.json();
        setAllMessages((prev) => [
          {
            id: newMsg.id || "msg-" + Date.now(),
            weddingId: wedding.id,
            guestId: guest?.id || null,
            message: wishMessage.trim(),
            isApproved: true,
            createdAt: new Date(),
            guest: { name: author },
          } as any,
          ...prev,
        ]);
        setWishMessage("");
        setWishSuccess(true);
        playCyberSound("fanfare");
        setTimeout(() => setWishSuccess(false), 3500);
      } else {
        alert("Gagal mengirim untaian doa restu. Silakan coba lagi.");
      }
    } catch {
      alert("Gagal mengirim untaian doa restu.");
    } finally {
      setWishLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-[#0b0f19f8] border-3 sm:border-4 border-[#00f0ff] ring-2 ring-[#ff007f]/50 p-3.5 sm:p-6 max-w-md sm:max-w-lg w-full max-h-[82dvh] sm:max-h-[85vh] overflow-y-auto shadow-[0_0_40px_rgba(0,240,255,0.5),inset_0_0_25px_rgba(255,0,127,0.15)] relative select-none font-pixel text-white"
            >
              {/* 4-Corner Neon Brackets */}
              <div className="absolute -top-2 -left-2 w-3.5 h-3.5 bg-[#ff007f] border border-[#00f0ff]" />
              <div className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-[#ff007f] border border-[#00f0ff]" />
              <div className="absolute -bottom-2 -left-2 w-3.5 h-3.5 bg-[#ff007f] border border-[#00f0ff]" />
              <div className="absolute -bottom-2 -right-2 w-3.5 h-3.5 bg-[#ff007f] border border-[#00f0ff]" />

              {/* Close Button [✕] */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-[#121829] border-2 border-[#ff007f] text-[#ff007f] hover:bg-[#ff007f] hover:text-white flex items-center justify-center text-xs font-black cursor-pointer shadow-[0_0_8px_#ff007f] transition-colors"
                title="Tutup Modal [Esc]"
              >
                ✕
              </button>

              {/* 1. PELAMINAN MEMPELAI */}
              {activeModal === "couple" && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-center border-b-2 border-[#00f0ff]/40 pb-2 sm:pb-3 pr-6">
                    <span className="text-[#00f0ff] text-[9px] sm:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                      <span>👑</span>
                      <span>ROYAL CYBERNETIC WEDDING</span>
                      <span>👑</span>
                    </span>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-[#ff007f] mt-0.5 uppercase drop-shadow-[0_0_10px_#ff007f]">
                      KEDUA MEMPELAI
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                    {/* Groom */}
                    <div className="border-2 border-[#00f0ff] bg-[#121829] p-3 text-center shadow">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto border-2 border-[#00f0ff] overflow-hidden mb-2 bg-[#0b0f19]">
                        <img
                          src={
                            couple?.groomPhoto ||
                            "/assets/templates/pixel-cyberpunk/characters/portraits/portrait-groom.png"
                          }
                          alt="Groom"
                          className="w-full h-full object-cover [image-rendering:pixelated]"
                        />
                      </div>
                      <h3 className="font-extrabold text-xs sm:text-sm text-[#00f0ff]">
                        {couple?.groomName || "Liam Vance"}
                      </h3>
                      {couple?.groomNickname && (
                        <p className="text-[10px] text-[#ffe600] font-bold">({couple.groomNickname})</p>
                      )}
                      {(couple?.groomFather || couple?.groomMother) && (
                        <p className="text-[8px] sm:text-[9px] text-gray-400 mt-2">
                          Putra dari:<br />
                          {couple.groomFather} &amp; {couple.groomMother}
                        </p>
                      )}
                      {couple?.groomInstagram && (
                        <a
                          href={`https://instagram.com/${couple.groomInstagram}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-2 px-2 py-0.5 bg-[#0b0f19] text-[#00f0ff] text-[9px] font-bold border border-[#00f0ff]/50 hover:bg-[#00f0ff] hover:text-[#0b0f19] transition-colors"
                        >
                          @{couple.groomInstagram}
                        </a>
                      )}
                    </div>

                    {/* Bride */}
                    <div className="border-2 border-[#ff007f] bg-[#121829] p-3 text-center shadow">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto border-2 border-[#ff007f] overflow-hidden mb-2 bg-[#0b0f19]">
                        <img
                          src={
                            couple?.bridePhoto ||
                            "/assets/templates/pixel-cyberpunk/characters/portraits/portrait-bride.png"
                          }
                          alt="Bride"
                          className="w-full h-full object-cover [image-rendering:pixelated]"
                        />
                      </div>
                      <h3 className="font-extrabold text-xs sm:text-sm text-[#ff007f]">
                        {couple?.brideName || "Elara Chen"}
                      </h3>
                      {couple?.brideNickname && (
                        <p className="text-[10px] text-[#ffe600] font-bold">({couple.brideNickname})</p>
                      )}
                      {(couple?.brideFather || couple?.brideMother) && (
                        <p className="text-[8px] sm:text-[9px] text-gray-400 mt-2">
                          Putri dari:<br />
                          {couple.brideFather} &amp; {couple.brideMother}
                        </p>
                      )}
                      {couple?.brideInstagram && (
                        <a
                          href={`https://instagram.com/${couple.brideInstagram}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-2 px-2 py-0.5 bg-[#0b0f19] text-[#ff007f] text-[9px] font-bold border border-[#ff007f]/50 hover:bg-[#ff007f] hover:text-white transition-colors"
                        >
                          @{couple.brideInstagram}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Stories Milestones */}
                  {wedding.stories && wedding.stories.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#00f0ff]/30">
                      <h4 className="text-xs font-black text-[#00f0ff] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span>📖</span>
                        <span>BABAK KISAH PERJALANAN ASMARA</span>
                      </h4>
                      <div className="space-y-2.5 max-h-[30vh] overflow-y-auto pr-1">
                        {wedding.stories.map((story: Story, i: number) => (
                          <div key={story.id || i} className="bg-[#121829] border border-[#00f0ff]/50 p-2.5 shadow">
                            <span className="text-[10px] text-[#ffe600] font-bold">
                              {story.date ? formatDate(story.date) : `Fase ${i + 1}`} • {story.title}
                            </span>
                            <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">{story.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. JADWAL ACARA & HITUNG MUNDUR */}
              {activeModal === "event" && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-center border-b-2 border-[#00f0ff]/40 pb-2 sm:pb-3 pr-6">
                    <span className="text-[#00f0ff] text-[9px] sm:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                      <span>🏛️</span>
                      <span>CITADEL PROTOCOL &amp; COUNTDOWN</span>
                      <span>🏛️</span>
                    </span>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-[#a855f7] mt-0.5 uppercase drop-shadow-[0_0_10px_#a855f7]">
                      JADWAL &amp; HITUNG MUNDUR
                    </h2>
                  </div>

                  {/* 4-Box Countdown Timer */}
                  <div className="border-2 border-[#ffe600] bg-[#121829] p-3 text-center shadow">
                    <p className="text-[10px] font-bold text-[#ffe600] uppercase tracking-wider mb-2">
                      ⏱️ HITUNG MUNDUR MENUJU HARI PERAYAAN
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-[#0b0f19] border border-[#ffe600]/50 p-1.5 text-center">
                        <span className="text-base sm:text-lg font-black text-[#ffe600]">{countdown.days}</span>
                        <p className="text-[8px] text-gray-400 uppercase">Hari</p>
                      </div>
                      <div className="bg-[#0b0f19] border border-[#ffe600]/50 p-1.5 text-center">
                        <span className="text-base sm:text-lg font-black text-[#ffe600]">{countdown.hours}</span>
                        <p className="text-[8px] text-gray-400 uppercase">Jam</p>
                      </div>
                      <div className="bg-[#0b0f19] border border-[#ffe600]/50 p-1.5 text-center">
                        <span className="text-base sm:text-lg font-black text-[#ffe600]">{countdown.minutes}</span>
                        <p className="text-[8px] text-gray-400 uppercase">Menit</p>
                      </div>
                      <div className="bg-[#0b0f19] border border-[#ffe600]/50 p-1.5 text-center">
                        <span className="text-base sm:text-lg font-black text-[#00f0ff]">{countdown.seconds}</span>
                        <p className="text-[8px] text-gray-400 uppercase">Detik</p>
                      </div>
                    </div>
                  </div>

                  {/* Events List */}
                  <div className="space-y-2.5 sm:space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                    {wedding.events && wedding.events.length > 0 ? (
                      wedding.events.map((event: Event) => (
                        <div
                          key={event.id}
                          className="border-2 border-[#a855f7] bg-[#121829] p-3 shadow"
                        >
                          <h4 className="text-xs sm:text-sm font-black text-[#00f0ff]">
                            {event.title}
                          </h4>
                          <p className="text-[10px] sm:text-[11px] text-gray-300 mt-1">
                            📅 {formatDate(event.date)}<br />
                            ⏰ {formatTime(event.startTime)} - {event.endTime ? formatTime(event.endTime) : "Selesai"}
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-white font-bold mt-1">
                            📍 {event.venue} - {event.address}
                          </p>
                          {event.mapsUrl && (
                            <a
                              href={event.mapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block mt-2 px-3 py-1 bg-[#a855f7] text-white text-[10px] font-black border border-white hover:bg-white hover:text-[#0b0f19] transition-colors"
                            >
                              BUKA GOOGLE MAPS ↗
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-xs text-gray-400 py-4">
                        Jadwal acara sedang disinkronkan...
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 3. AIR MANCUR DOA & UCAPAN */}
              {activeModal === "messages" && (
                <div className="space-y-4">
                  <div className="text-center border-b-2 border-[#00f0ff]/40 pb-2 sm:pb-3 pr-6">
                    <span className="text-[#00f0ff] text-[9px] sm:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                      <span>✨</span>
                      <span>QUANTUM WISHES FOUNTAIN</span>
                      <span>✨</span>
                    </span>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-[#00f0ff] mt-0.5 uppercase drop-shadow-[0_0_10px_#00f0ff]">
                      UNTAIAN DOA &amp; UCAPAN
                    </h2>
                  </div>

                  {wedding?.isDemo ? (
                    <div className="bg-[#121829] border-2 border-[#00f0ff]/70 p-3 sm:p-4 text-center space-y-1.5 shadow">
                      <div className="text-[10px] font-black text-[#00f0ff] uppercase tracking-wider">
                        MODE PRATINJAU TEMA DEMO
                      </div>
                      <p className="text-[11px] text-gray-300 leading-relaxed">
                        Kolom pengiriman ucapan dinonaktifkan khusus pada halaman demo untuk mencegah spam. Tamu undangan resmi dapat mengirimkan doa restu melalui tautan undangan yang dibagikan.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSendWish} className="bg-[#121829] border-2 border-[#00f0ff]/70 p-3 sm:p-4 shadow space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-[#ffe600] uppercase tracking-wider flex items-center gap-1">
                          <span>PANCARKAN DOA &amp; RESTU</span>
                        </span>
                        {wishSuccess && (
                          <span className="text-[9px] font-bold text-emerald-400 animate-pulse">
                            DOA TERKIRIM KE MATRIKS
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[9px] font-bold text-[#00f0ff] uppercase">
                            IDENTITAS PENGIRIM:
                          </label>
                          <span className="text-[9px] font-mono text-[#00f0ff]/80 flex items-center gap-1">
                            <span>Terkunci otomatis</span>
                          </span>
                        </div>
                        <input
                          type="text"
                          readOnly
                          value={wishAuthor || resolvedGuestName}
                          className="w-full bg-[#080c14] border-2 border-[#00f0ff]/50 px-2.5 py-1.5 text-xs font-mono font-bold text-[#00f0ff] cursor-not-allowed select-none opacity-95 shadow-inner"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-[#00f0ff] uppercase block mb-1">
                          PESAN &amp; DOA RESTU:
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={wishMessage}
                          onChange={(e) => setWishMessage(e.target.value)}
                          placeholder="Tuliskan untaian doa dan selamat untuk kedua mempelai..."
                          className="w-full bg-[#0b0f19] border border-[#00f0ff]/60 p-2 text-xs text-white placeholder-gray-500 resize-none focus:outline-none focus:border-[#ffe600]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={wishLoading || !wishMessage.trim()}
                        className="w-full py-2 bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#ff007f] text-[#0b0f19] font-black text-xs uppercase tracking-wider border border-white shadow-[0_0_12px_rgba(0,240,255,0.6)] cursor-pointer disabled:opacity-50 active:scale-98 transition-transform"
                      >
                        {wishLoading ? "MEMANCARKAN..." : "TRANSMIT DOA RESTU"}
                      </button>
                    </form>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-black text-[#00f0ff] uppercase tracking-wider flex items-center gap-1">
                        <span>📜</span>
                        <span>MATRIKS UCAPAN SAHABAT ({allMessages?.length || 0})</span>
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {allMessages && allMessages.length > 0 ? (
                        allMessages.map((msg, i) => (
                          <div
                            key={msg.id || i}
                            className="bg-[#121829] border border-[#00f0ff]/40 p-2.5 shadow hover:border-[#00f0ff] transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-black text-[#ffe600]">
                                👤 {msg.guest?.name || "Tamu Kehormatan"}
                              </span>
                              <span className="text-[8px] text-gray-400 font-mono">
                                {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString("id-ID") : ""}
                              </span>
                            </div>
                            <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                              &ldquo;{msg.message}&rdquo;
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 text-center py-4 bg-[#121829]/60 border border-gray-700">
                          Belum ada pesan. Jadilah yang pertama memberikan doa restu!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. BUKU TAMU (RSVP) */}
              {activeModal === "rsvp" && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-center border-b-2 border-[#00f0ff]/40 pb-2 sm:pb-3 pr-6">
                    <span className="text-[#00f0ff] text-[9px] sm:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                      <span>📑</span>
                      <span>VENDING RSVP ACCESS</span>
                      <span>📑</span>
                    </span>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-[#00f0ff] mt-0.5 uppercase drop-shadow-[0_0_10px_#00f0ff]">
                      KONFIRMASI KEHADIRAN
                    </h2>
                  </div>

                  {rsvpSubmitted ? (
                    <div className="bg-[#121829] border-2 border-[#00f0ff] p-4 text-center">
                      <span className="text-3xl">✅</span>
                      <h3 className="text-sm font-black text-[#00f0ff] mt-2">
                        RSVP BERHASIL DIKONFIRMASI!
                      </h3>
                      <p className="text-[10px] text-gray-300 mt-1">
                        Terima kasih atas konfirmasi Anda. Sampai jumpa di Neo-District!
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleRSVP} className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRsvpStatus("attending");
                            playCyberSound("select");
                          }}
                          className={`p-2.5 border-2 text-[10px] sm:text-xs font-black uppercase transition-all ${
                            rsvpStatus === "attending"
                              ? "border-[#00f0ff] bg-[#00f0ff] text-[#0b0f19] shadow-[0_0_10px_#00f0ff]"
                              : "border-gray-600 bg-[#121829] text-gray-400"
                          }`}
                        >
                          ✓ HADIR
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRsvpStatus("not_attending");
                            playCyberSound("select");
                          }}
                          className={`p-2.5 border-2 text-[10px] sm:text-xs font-black uppercase transition-all ${
                            rsvpStatus === "not_attending"
                              ? "border-[#ff007f] bg-[#ff007f] text-white shadow-[0_0_10px_#ff007f]"
                              : "border-gray-600 bg-[#121829] text-gray-400"
                          }`}
                        >
                          ✕ BERHALANGAN
                        </button>
                      </div>

                      {rsvpStatus === "attending" && (
                        <div>
                          <label className="text-[9px] text-[#00f0ff] font-bold block mb-1">
                            JUMLAH TAMU YANG HADIR:
                          </label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => {
                                  setRsvpCount(num);
                                  playCyberSound("select");
                                }}
                                className={`w-8 h-8 border-2 font-black text-xs ${
                                  rsvpCount === num
                                    ? "border-[#00f0ff] bg-[#00f0ff] text-[#0b0f19]"
                                    : "border-gray-700 bg-[#121829] text-gray-300"
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
                        disabled={rsvpLoading}
                        className="w-full py-2.5 bg-gradient-to-r from-[#00f0ff] to-[#ff007f] text-[#0b0f19] font-black text-xs uppercase border-2 border-white shadow-[0_0_15px_rgba(0,240,255,0.7)] active:scale-95 transition-transform mt-2"
                      >
                        {rsvpLoading ? "MENGIRIM PROTOKOL..." : "KIRIM KONFIRMASI [RSVP]"}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* 5. HOLO-GALERI */}
              {activeModal === "gallery" && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-center border-b-2 border-[#00f0ff]/40 pb-2 sm:pb-3 pr-6">
                    <span className="text-[#00f0ff] text-[9px] sm:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                      <span>🖼️</span>
                      <span>HOLO-PROJECTION MATRIX</span>
                      <span>🖼️</span>
                    </span>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-[#ec4899] mt-0.5 uppercase drop-shadow-[0_0_10px_#ec4899]">
                      GALERI FOTO KENANGAN
                    </h2>
                  </div>

                  <div className="grid grid-cols-3 gap-2 max-h-[45vh] overflow-y-auto pr-1">
                    {wedding.galleries && wedding.galleries.length > 0 ? (
                      wedding.galleries.map((img: Gallery, i: number) => (
                        <div
                          key={img.id || i}
                          onClick={() => {
                            setGallerySelected(img.imageUrl);
                            playCyberSound("select");
                          }}
                          className="aspect-square border-2 border-[#00f0ff]/60 bg-[#121829] overflow-hidden cursor-pointer hover:border-[#ff007f] transition-colors"
                        >
                          <img
                            src={img.imageUrl}
                            alt="Gallery"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="col-span-3 text-center text-xs text-gray-400 py-6">
                        Belum ada foto dalam matriks memori.
                      </p>
                    )}
                  </div>

                  {gallerySelected && (
                    <div
                      onClick={() => setGallerySelected(null)}
                      className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
                    >
                      <img
                        src={gallerySelected}
                        alt="Zoomed Holo Preview"
                        className="max-w-full max-h-[85vh] border-3 border-[#00f0ff] shadow-[0_0_30px_#00f0ff]"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 6. KADO DIGITAL */}
              {activeModal === "gift" && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-center border-b-2 border-[#00f0ff]/40 pb-2 sm:pb-3 pr-6">
                    <span className="text-[#00f0ff] text-[9px] sm:text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                      <span>💳</span>
                      <span>QUANTUM VAULT ENVELOPE</span>
                      <span>💳</span>
                    </span>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-[#ffe600] mt-0.5 uppercase drop-shadow-[0_0_10px_#ffe600]">
                      AMPLOP &amp; KADO DIGITAL
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs text-gray-300 leading-relaxed text-center font-mono">
                      Kirimkan tanda kasih digital dengan memilih rekening dan konfirmasi di bawah ini:
                    </p>

                    {wedding.giftAccounts && wedding.giftAccounts.length > 0 ? (
                      <GiftConfirmationForm
                        weddingId={wedding.id}
                        giftAccounts={wedding.giftAccounts || []}
                        defaultSenderName={resolvedGuestName}
                        theme="cyberpunk"
                        onClose={() => setActiveModal(null)}
                        isDemo={Boolean(wedding.isDemo)}
                      />
                    ) : (
                      <p className="text-center text-xs text-gray-400 py-6 font-mono">
                        Informasi rekening kado digital belum diatur.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
