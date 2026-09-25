'use client';

import { motion } from 'framer-motion';
import type { TemplateComponentProps } from '@/types/template';
import { GununganBottom, SulurDivider } from './Ornaments';

export function BatikJawaFooter({ context }: TemplateComponentProps) {
  const couple = context?.wedding?.couple ?? null;
  const groomName = couple?.groomNickname ?? couple?.groomName ?? 'Sang Mempelai Pria';
  const brideName = couple?.brideNickname ?? couple?.brideName ?? 'Sang Mempelai Wanita';
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative w-full pt-0 pb-10 overflow-hidden"
      style={{ backgroundColor: '#2D1B0E' }}
    >
      {/* Gunungan Bottom — top of footer */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex justify-center mb-10"
      >
        <GununganBottom
          className="w-36 md:w-44 text-[#B8860B]"
          style={{ opacity: 0.85 }}
        />
      </motion.div>

      <div className="max-w-lg mx-auto px-6 text-center">
        {/* Closing Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8"
        >
          {/* Decorative quote mark */}
          <div
            className="font-jawa-serif text-5xl leading-none mb-4 opacity-30"
            style={{ color: '#B8860B' }}
            aria-hidden="true"
          >
            ❝
          </div>
          <p
            className="font-jawa-serif text-base md:text-lg leading-loose"
            style={{ color: '#EDE0C4' }}
          >
            Dengan segala ketulusan hati, kami mengundang Bapak/Ibu/Saudara/i
            untuk hadir di hari yang penuh berkah ini.
          </p>
        </motion.div>

        {/* Groom & Bride Names */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <p
            className="font-jawa-serif text-2xl md:text-3xl"
            style={{ color: '#D4A853' }}
          >
            {groomName}
          </p>
          <p
            className="font-jawa-body text-sm my-2"
            style={{ color: '#B8860B', fontStyle: 'normal', letterSpacing: '0.2em' }}
          >
            &amp;
          </p>
          <p
            className="font-jawa-serif text-2xl md:text-3xl"
            style={{ color: '#D4A853' }}
          >
            {brideName}
          </p>
        </motion.div>

        {/* Sulur Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.6 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <SulurDivider className="w-40 text-[#B8860B]" style={{ opacity: 0.7 }} />
        </motion.div>

        {/* Hayvows Credit & Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-2"
        >
          <p
            className="font-jawa-body text-xs"
            style={{ color: '#B8860B', fontStyle: 'normal', letterSpacing: '0.15em' }}
          >
            Dibuat dengan cinta oleh{' '}
            <span style={{ color: '#D4A853', fontWeight: 600 }}>Hayvows</span>
          </p>
          <p
            className="font-jawa-body text-xs opacity-40"
            style={{ color: '#EDE0C4', fontStyle: 'normal' }}
          >
            &copy; {currentYear} Hayvows. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
