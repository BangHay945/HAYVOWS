'use client';

import { Music2 } from 'lucide-react';

interface MusicButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function BatikJawaMusicButton({ isPlaying, onToggle }: MusicButtonProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
      title={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
      className="batik-music-btn w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hy-accent,#B8860B)] cursor-pointer relative"
      style={{
        backgroundColor: 'rgba(61,43,31,0.90)',
        border: '1px solid color-mix(in srgb, var(--hy-accent, #B8860B) 60%, transparent)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow:
          '0 4px 24px rgba(0,0,0,0.55), 0 1px 4px color-mix(in srgb, var(--hy-accent, #B8860B) 25%, transparent), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--hy-accent, #D4A853)',
          animation: isPlaying ? 'music-spin 4s linear infinite' : 'none',
        }}
      >
        <Music2
          size={18}
          strokeWidth={1.8}
          className="text-[#D4A853]"
          style={{ color: 'var(--hy-accent, #D4A853)' }}
        />
      </span>

      {/* Spin keyframes injected via style tag */}
      <style>{`
        @keyframes music-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* Ripple ring when playing */}
      {isPlaying && (
        <span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: '1px solid color-mix(in srgb, var(--hy-accent, #B8860B) 40%, transparent)',
            animation: 'music-ripple 2s ease-out infinite',
          }}
        />
      )}
      <style>{`
        @keyframes music-ripple {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </button>
  );
}
