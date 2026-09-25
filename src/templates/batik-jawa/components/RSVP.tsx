'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TemplateComponentProps, RSVPSubmitData } from '@/types/template';
import type { GuestMessage } from '@/types/wedding';
import { KawungBorder, SulurDivider } from './Ornaments';
import { Check, UserCheck, MessageSquare, Send, Users, Lock } from 'lucide-react';

type AttendanceStatus = 'attending' | 'not_attending';

export function BatikJawaRSVP({ context, onRSVPSubmit }: TemplateComponentProps) {
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>('attending');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localMessages, setLocalMessages] = useState<GuestMessage[]>(context?.messages ?? []);

  const wedding = context?.wedding;
  const guest = context?.guest;
  const isDemo = Boolean(wedding?.isDemo);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo || !attendanceStatus) return;

    setErrorMessage(null);
    setLoading(true);
    try {
      if (onRSVPSubmit) {
        const data: RSVPSubmitData = {
          guestId: guest?.id ?? '',
          weddingId: wedding.id,
          attendanceStatus,
          guestCount: attendanceStatus === 'attending' ? guestCount : 1,
          message: message.trim(),
        };
        await onRSVPSubmit(data);
      }
      if (message.trim()) {
        const newMsg: GuestMessage = {
          id: 'msg-' + Date.now(),
          weddingId: wedding?.id || '',
          guestId: guest?.id || '',
          guest: { name: guest?.name || 'Tamu Undangan' },
          message: message.trim(),
          status: 'approved',
          isPinned: false,
          createdAt: new Date(),
        };
        setLocalMessages((prev) => [newMsg, ...prev]);
      }
      setSubmitted(true);
    } catch (err: any) {
      console.error('RSVP submit error:', err);
      setErrorMessage(err?.message || 'Konfirmasi kehadiran gagal dikirim. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <section className="relative w-full py-20 px-4 sm:px-6" style={{ backgroundColor: '#3D2B1F' }}>
      {/* Top KawungBorder */}
      <div className="w-full overflow-hidden mb-12">
        <KawungBorder color="#B8860B" height={18} />
      </div>

      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p
            className="font-jawa-body uppercase tracking-[0.35em] text-[10px] mb-2 font-semibold"
            style={{ color: '#B8860B', fontStyle: 'normal' }}
          >
            Konfirmasi Kehadiran
          </p>
          <h2 className="font-jawa-serif text-3xl sm:text-4xl text-[#EDE0C4] mb-3">
            RSVP &amp; Doa Restu
          </h2>
          <div className="flex justify-center mb-3">
            <SulurDivider color="#B8860B" width={180} height={20} />
          </div>
          <p className="font-jawa-body text-xs sm:text-sm text-[#D4A853]" style={{ fontStyle: 'normal' }}>
            Merupakan suatu kehormatan dan kebahagiaan bagi kami atas kehadiran Bapak/Ibu/Saudara/i
          </p>
        </motion.div>

        {/* Card Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="rounded-2xl border p-6 sm:p-8"
          style={{
            borderColor: 'rgba(184, 134, 11, 0.35)',
            backgroundColor: '#2D1B0E',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Guest Identity Banner */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#B8860B]/20">
            <div>
              <p className="font-jawa-body text-[10px] tracking-wider uppercase text-[#A89078]" style={{ fontStyle: 'normal' }}>
                Tamu Undangan
              </p>
              <p className="font-jawa-serif text-lg sm:text-xl text-[#EDE0C4]">
                {guest?.name || 'Tamu Undangan'}
              </p>
            </div>
            {guest?.name && (
              <span
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-jawa-body tracking-wider uppercase"
                style={{
                  backgroundColor: 'rgba(184,134,11,0.15)',
                  color: '#D4A853',
                  border: '1px solid rgba(184,134,11,0.3)',
                  fontStyle: 'normal',
                }}
              >
                <UserCheck size={12} />
                <span>Terverifikasi</span>
              </span>
            )}
          </div>

          {/* Demo Mode Notice */}
          {isDemo && (
            <div
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border mb-6"
              style={{
                backgroundColor: 'rgba(184, 134, 11, 0.1)',
                borderColor: 'rgba(184, 134, 11, 0.35)',
              }}
            >
              <span
                className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase font-jawa-body whitespace-nowrap"
                style={{
                  backgroundColor: '#B8860B',
                  color: '#1A0F07',
                  fontStyle: 'normal',
                }}
              >
                Mode Demo
              </span>
              <p className="font-jawa-body text-xs text-[#EDE0C4] leading-snug" style={{ fontStyle: 'normal' }}>
                Halaman pratinjau demo. Pengisian konfirmasi kehadiran dan doa restu dinonaktifkan.
              </p>
            </div>
          )}

          {submitted ? (
            <div className="text-center py-8 px-4 space-y-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{
                  backgroundColor: 'rgba(184,134,11,0.15)',
                  border: '2px solid #B8860B',
                  color: '#D4A853',
                }}
              >
                <Check size={32} strokeWidth={2.5} />
              </div>
              <h3 className="font-jawa-serif text-2xl sm:text-3xl text-[#EDE0C4]">
                Matur Nuwun
              </h3>
              <p className="font-jawa-body text-xs sm:text-sm text-[#D4A853] max-w-md mx-auto leading-relaxed" style={{ fontStyle: 'normal' }}>
                Konfirmasi rencana kehadiran ({attendanceStatus === 'attending' ? `Hadir - ${guestCount} Tamu` : 'Tidak Hadir'}) dan doa restu Anda telah berhasil dicatat. Merupakan suatu kehormatan besar bagi kami sekeluarga.
              </p>
              {isDemo && (
                <div className="pt-2 space-y-2">
                  <p className="font-jawa-body text-[11px] text-[#A89078] italic">
                    (Simulasi pengiriman berhasil dicatat pada mode demo)
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-jawa-body tracking-wider uppercase font-bold transition-all cursor-pointer hover:bg-[#B8860B]/20 active:scale-98"
                    style={{
                      border: '1px solid rgba(184, 134, 11, 0.5)',
                      color: '#D4A853',
                      fontStyle: 'normal',
                      backgroundColor: 'rgba(61,43,31,0.6)',
                    }}
                  >
                    Kirim Konfirmasi Ulang (Uji Coba)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Attendance Radio Pills */}
              <div>
                <label
                  className="font-jawa-body block text-xs uppercase tracking-widest mb-3 font-semibold"
                  style={{ color: '#D4A853', fontStyle: 'normal' }}
                >
                  Konfirmasi Rencana Kehadiran
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'attending', label: 'Ya, Saya Hadir' },
                    { value: 'not_attending', label: 'Maaf, Tidak Hadir' },
                  ].map((opt) => {
                    const isSelected = attendanceStatus === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={isDemo}
                        onClick={() => !isDemo && setAttendanceStatus(opt.value as AttendanceStatus)}
                        className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-jawa-body font-bold tracking-wider transition-all flex items-center justify-center gap-2 border ${
                          isDemo ? 'cursor-not-allowed opacity-80' : 'cursor-pointer active:scale-98'
                        }`}
                        style={{
                          fontStyle: 'normal',
                          borderColor: isSelected ? '#FDF6E3' : 'rgba(184,134,11,0.3)',
                          background: isSelected
                            ? isDemo
                              ? 'rgba(184, 134, 11, 0.35)'
                              : 'linear-gradient(135deg, #E6C687 0%, #D4A853 50%, #B8860B 100%)'
                            : 'rgba(61,43,31,0.6)',
                          color: isSelected ? (isDemo ? '#EDE0C4' : '#1A0F07') : '#EDE0C4',
                          boxShadow: isSelected && !isDemo
                            ? '0 4px 16px rgba(184,134,11,0.4)'
                            : 'none',
                        }}
                      >
                        {isSelected && <Check size={15} strokeWidth={3} />}
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guest Count (if attending) */}
              <AnimatePresence>
                {attendanceStatus === 'attending' && (
                  <motion.div
                    key="guest-count"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden space-y-2"
                  >
                    <label
                      className="font-jawa-body block text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5"
                      style={{ color: '#D4A853', fontStyle: 'normal' }}
                    >
                      <Users size={14} />
                      <span>Jumlah Tamu yang Hadir</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <select
                        disabled={isDemo}
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className={`px-4 py-2.5 rounded-lg text-sm font-jawa-body outline-none ${
                          isDemo ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                        }`}
                        style={{
                          backgroundColor: '#3D2B1F',
                          border: '1px solid rgba(184,134,11,0.5)',
                          color: '#EDE0C4',
                          fontStyle: 'normal',
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} Orang
                          </option>
                        ))}
                      </select>
                      <span className="font-jawa-body text-xs text-[#A89078]" style={{ fontStyle: 'normal' }}>
                        (Termasuk Anda)
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message Textarea */}
              <div>
                <label
                  className="font-jawa-body block text-xs uppercase tracking-widest mb-2 font-semibold flex items-center gap-1.5"
                  style={{ color: '#D4A853', fontStyle: 'normal' }}
                >
                  <MessageSquare size={14} />
                  <span>Untaian Doa &amp; Harapan</span>
                </label>
                <textarea
                  rows={3}
                  disabled={isDemo}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isDemo
                      ? 'Pengisian ucapan dan doa restu dinonaktifkan pada mode demo.'
                      : 'Sampaikan doa dan harapan terbaik Anda untuk kedua mempelai...'
                  }
                  className={`w-full px-4 py-3 rounded-xl text-sm outline-none resize-none font-jawa-body transition-colors ${
                    isDemo ? 'cursor-not-allowed opacity-75' : ''
                  }`}
                  style={{
                    backgroundColor: '#3D2B1F',
                    border: '1px solid rgba(184,134,11,0.4)',
                    color: '#EDE0C4',
                    fontStyle: 'normal',
                    lineHeight: '1.7',
                  }}
                  onFocus={(e) => {
                    if (!isDemo) e.currentTarget.style.borderColor = '#B8860B';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(184,134,11,0.4)';
                  }}
                />
              </div>

              {/* Submit Button */}
              {errorMessage && (
                <div
                  className="p-3 rounded-xl text-xs text-center animate-in fade-in"
                  style={{
                    backgroundColor: 'rgba(124, 45, 18, 0.4)',
                    border: '1px solid rgba(220, 38, 38, 0.4)',
                    color: '#FCA5A5',
                    fontFamily: 'inherit',
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isDemo || !attendanceStatus || loading}
                className="w-full py-3.5 rounded-xl font-jawa-body text-xs uppercase tracking-[0.22em] font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                style={{
                  fontStyle: 'normal',
                  background:
                    isDemo || !attendanceStatus || loading
                      ? 'rgba(184, 134, 11, 0.15)'
                      : 'linear-gradient(135deg, #E6C687 0%, #D4A853 50%, #B8860B 100%)',
                  color: isDemo || !attendanceStatus || loading ? '#A89078' : '#1A0F07',
                  border:
                    isDemo || !attendanceStatus || loading
                      ? '1px solid rgba(184, 134, 11, 0.3)'
                      : '1px solid rgba(253, 246, 227, 0.5)',
                  boxShadow:
                    isDemo || !attendanceStatus || loading
                      ? 'none'
                      : '0 4px 20px rgba(184,134,11,0.35)',
                }}
              >
                {isDemo ? (
                  <>
                    <Lock size={15} />
                    <span>Pengisian Dinonaktifkan (Mode Demo)</span>
                  </>
                ) : loading ? (
                  <span>Mengirimkan...</span>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Kirim Konfirmasi Kehadiran</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Untaian Doa Tamu List */}
        {localMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-14"
          >
            <div className="flex justify-center mb-4">
              <SulurDivider color="#B8860B" width={160} height={20} />
            </div>
            <h3 className="font-jawa-serif text-2xl text-center text-[#EDE0C4] mb-2">
              Untaian Doa Tamu
            </h3>
            <p className="font-jawa-body text-xs text-center text-[#D4A853] mb-6" style={{ fontStyle: 'normal' }}>
              Doa tulus dari para sahabat dan sanak keluarga
            </p>

            <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
              {localMessages.map((msg, idx) => {
                const guestName = msg.guest?.name ?? 'Tamu Undangan';
                return (
                  <motion.div
                    key={msg.id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.3) }}
                    className="flex gap-3.5 items-start p-4 rounded-xl border"
                    style={{
                      backgroundColor: '#2D1B0E',
                      borderColor: 'rgba(184,134,11,0.25)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: 'rgba(184,134,11,0.15)',
                        border: '1.5px solid #B8860B',
                        color: '#D4A853',
                      }}
                    >
                      {getInitials(guestName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-jawa-serif text-sm font-semibold text-[#D4A853] truncate">
                          {guestName}
                        </p>
                        {msg.createdAt && (
                          <span className="text-[10px] text-[#8B6E5A] font-jawa-body" style={{ fontStyle: 'normal' }}>
                            {new Date(msg.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        )}
                      </div>
                      <p
                        className="font-jawa-body text-xs sm:text-sm text-[#EDE0C4] italic leading-relaxed"
                      >
                        &ldquo;{msg.message}&rdquo;
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom KawungBorder */}
      <div className="w-full overflow-hidden mt-12">
        <KawungBorder color="#B8860B" height={18} />
      </div>
    </section>
  );
}
