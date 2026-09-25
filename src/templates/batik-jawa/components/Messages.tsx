'use client';

import { motion } from 'framer-motion';
import type { TemplateComponentProps } from '@/types/template';
import { SulurDivider } from './Ornaments';

export function BatikJawaMessages({ context }: TemplateComponentProps) {
  const messages = context?.messages ?? [];

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  return (
    <section
      className="relative w-full py-16 px-4"
      style={{ backgroundColor: '#FDF6E3' }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p
            className="font-jawa-body uppercase tracking-[0.3em] text-xs mb-3"
            style={{ color: '#B8860B', fontStyle: 'normal' }}
          >
            Doa &amp; Harapan
          </p>
          <h2
            className="font-jawa-serif text-3xl md:text-4xl mb-4"
            style={{ color: '#3D2B1F' }}
          >
            Untaian Doa
          </h2>
          <div className="flex justify-center mb-4">
            <SulurDivider className="w-48 text-[#B8860B]" />
          </div>
          <p
            className="font-jawa-body text-sm"
            style={{ color: '#7C2D12', fontStyle: 'normal' }}
          >
            Setiap doa yang terucap adalah cahaya bagi perjalanan kami
          </p>
        </motion.div>

        {/* Messages Grid */}
        {messages.length > 0 ? (
          <div className="space-y-5">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="flex gap-4 items-start p-5 rounded-lg"
                style={{
                  backgroundColor: '#FEFCF7',
                  border: '1px solid #D9C9A0',
                  boxShadow: '0 2px 12px rgba(61,43,31,0.06)',
                }}
              >
                {/* Avatar */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor: '#B8860B22',
                    border: '1.5px solid #B8860B',
                    color: '#B8860B',
                  }}
                >
                  {getInitials(msg.guest?.name ?? 'Tamu')}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name */}
                  <p
                    className="font-jawa-serif text-base mb-1"
                    style={{ color: '#3D2B1F' }}
                  >
                    {msg.guest?.name ?? 'Tamu Undangan'}
                  </p>

                  {/* Message */}
                  <p
                    className="font-jawa-body text-sm leading-relaxed mb-2"
                    style={{ color: '#5C3D2E', fontStyle: 'italic' }}
                  >
                    &ldquo;{msg.message ?? ''}&rdquo;
                  </p>

                  {/* Date */}
                  {(msg as any).createdAt && (
                    <p
                      className="font-jawa-body text-xs"
                      style={{ color: '#B8860B', fontStyle: 'normal', opacity: 0.7 }}
                    >
                      {formatDate((msg as any).createdAt)}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State — Elegant Kraton Placeholder */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center py-16 px-8"
            style={{
              backgroundColor: '#FEFCF7',
              border: '1px solid #D9C9A0',
              borderRadius: '0.75rem',
            }}
          >
            {/* Ornamental Diamond */}
            <div className="flex justify-center mb-5">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                className="opacity-50"
              >
                <rect
                  x="24"
                  y="4"
                  width="28"
                  height="28"
                  rx="2"
                  transform="rotate(45 24 24)"
                  stroke="#B8860B"
                  strokeWidth="1.5"
                />
                <rect
                  x="24"
                  y="12"
                  width="18"
                  height="18"
                  rx="1"
                  transform="rotate(45 24 24)"
                  stroke="#B8860B"
                  strokeWidth="1"
                />
              </svg>
            </div>

            <p
              className="font-jawa-serif text-lg mb-2"
              style={{ color: '#3D2B1F' }}
            >
              Belum Ada Ucapan
            </p>
            <p
              className="font-jawa-body text-sm"
              style={{ color: '#7C5E50', fontStyle: 'normal', lineHeight: 1.8 }}
            >
              Jadilah yang pertama menyampaikan doa dan harapan terbaik
              <br />
              untuk kedua mempelai
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
