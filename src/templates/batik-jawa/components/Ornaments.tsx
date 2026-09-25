// Ornamen SVG Kraton Jawa untuk Tema Batik Jawa Heritage
// Semua komponen adalah SVG inline tanpa dependensi eksternal

interface OrnamentProps {
  className?: string;
  color?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

// ─────────────────────────────────────────
// 1. GUNUNGAN TOP — pembatas atas section, ornamen gunungan wayang menghadap atas
// ─────────────────────────────────────────
export function GununganTop({ className = "", color = "#B8860B", width = 120, height = 80, style }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 120 80"
      width={width}
      height={height}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      {/* Mahkota atas */}
      <path d="M60 4 L64 10 L68 6 L72 12 L60 14 L48 12 L52 6 L56 10 Z" fill={color} opacity="0.85" />
      {/* Tubuh gunungan utama */}
      <path
        d="M60 14 L108 72 L96 76 L60 60 L24 76 L12 72 Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      {/* Layer dalam kedua */}
      <path
        d="M60 22 L98 70 L88 73 L60 58 L32 73 L22 70 Z"
        stroke={color}
        strokeWidth="0.75"
        fill="none"
        opacity="0.45"
      />
      {/* Layer dalam ketiga */}
      <path
        d="M60 30 L88 68 L80 70 L60 57 L40 70 L32 68 Z"
        stroke={color}
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
      />
      {/* Lingkaran tengah */}
      <circle cx="60" cy="50" r="7" stroke={color} strokeWidth="1" opacity="0.6" />
      <circle cx="60" cy="50" r="3.5" fill={color} opacity="0.5" />
      {/* Garis horizontal dekoratif */}
      <line x1="34" y1="44" x2="46" y2="44" stroke={color} strokeWidth="0.75" opacity="0.5" />
      <line x1="74" y1="44" x2="86" y2="44" stroke={color} strokeWidth="0.75" opacity="0.5" />
      <line x1="28" y1="54" x2="42" y2="54" stroke={color} strokeWidth="0.5" opacity="0.35" />
      <line x1="78" y1="54" x2="92" y2="54" stroke={color} strokeWidth="0.5" opacity="0.35" />
      {/* Titik ornamen samping */}
      <circle cx="42" cy="36" r="1.5" fill={color} opacity="0.5" />
      <circle cx="78" cy="36" r="1.5" fill={color} opacity="0.5" />
    </svg>
  );
}

// ─────────────────────────────────────────
// 2. GUNUNGAN BOTTOM — gunungan terbalik, penutup section
// ─────────────────────────────────────────
export function GununganBottom({ className = "", color = "#B8860B", width = 120, height = 80, style }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 120 80"
      width={width}
      height={height}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ transform: "scaleY(-1)", ...style }}
    >
      <path d="M60 4 L64 10 L68 6 L72 12 L60 14 L48 12 L52 6 L56 10 Z" fill={color} opacity="0.85" />
      <path
        d="M60 14 L108 72 L96 76 L60 60 L24 76 L12 72 Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M60 22 L98 70 L88 73 L60 58 L32 73 L22 70 Z"
        stroke={color}
        strokeWidth="0.75"
        fill="none"
        opacity="0.45"
      />
      <path
        d="M60 30 L88 68 L80 70 L60 57 L40 70 L32 68 Z"
        stroke={color}
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
      />
      <circle cx="60" cy="50" r="7" stroke={color} strokeWidth="1" opacity="0.6" />
      <circle cx="60" cy="50" r="3.5" fill={color} opacity="0.5" />
      <line x1="34" y1="44" x2="46" y2="44" stroke={color} strokeWidth="0.75" opacity="0.5" />
      <line x1="74" y1="44" x2="86" y2="44" stroke={color} strokeWidth="0.75" opacity="0.5" />
    </svg>
  );
}

// ─────────────────────────────────────────
// 3. KAWUNG BORDER — strip motif kawung horizontal sebagai pemisah section
// ─────────────────────────────────────────
export function KawungBorder({ className = "", color = "#B8860B", width = "100%", height = 24, style }: OrnamentProps) {
  // Unit kawung: 4 elips yang saling tumpang tindih membentuk bunga 4 kelopak
  const unit = (x: number) => (
    <g key={x} transform={`translate(${x}, 12)`}>
      <ellipse cx="0" cy="-4.5" rx="4" ry="6" stroke={color} strokeWidth="0.75" fill="none" opacity="0.6" />
      <ellipse cx="0" cy="4.5" rx="4" ry="6" stroke={color} strokeWidth="0.75" fill="none" opacity="0.6" />
      <ellipse cx="-4.5" cy="0" rx="6" ry="4" stroke={color} strokeWidth="0.75" fill="none" opacity="0.6" />
      <ellipse cx="4.5" cy="0" rx="6" ry="4" stroke={color} strokeWidth="0.75" fill="none" opacity="0.6" />
      <circle cx="0" cy="0" r="1.5" fill={color} opacity="0.5" />
    </g>
  );

  const units = Array.from({ length: 20 }, (_, i) => unit(12 + i * 20));

  return (
    <svg
      viewBox="0 0 400 24"
      width={width}
      height={height}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      {units}
    </svg>
  );
}

// ─────────────────────────────────────────
// 4. UKIRAN CORNER — ornamen sudut ukiran untuk membingkai kartu/foto
// ─────────────────────────────────────────
export function UkiranCorner({ className = "", color = "#B8860B", size = 40, style }: OrnamentProps & { size?: number }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      {/* Garis lurus tepian */}
      <line x1="0" y1="0" x2="30" y2="0" stroke={color} strokeWidth="1.25" opacity="0.8" />
      <line x1="0" y1="0" x2="0" y2="30" stroke={color} strokeWidth="1.25" opacity="0.8" />
      {/* Arc sudut ornamental */}
      <path d="M0 22 Q8 8 22 0" stroke={color} strokeWidth="0.75" opacity="0.5" />
      <path d="M0 16 Q6 6 16 0" stroke={color} strokeWidth="0.5" opacity="0.35" />
      {/* Sulur kecil */}
      <path d="M8 0 C10 5 5 10 0 8" stroke={color} strokeWidth="0.75" fill="none" opacity="0.55" />
      <path d="M0 8 C5 10 10 14 8 20" stroke={color} strokeWidth="0.5" fill="none" opacity="0.4" />
      {/* Titik pusat ornamen */}
      <circle cx="5" cy="5" r="2" stroke={color} strokeWidth="0.75" opacity="0.65" />
      <circle cx="5" cy="5" r="0.75" fill={color} opacity="0.6" />
    </svg>
  );
}

// ─────────────────────────────────────────
// 5. SULUR DIVIDER — divider tengah halaman bergaya tanaman sulur adat
// ─────────────────────────────────────────
export function SulurDivider({ className = "", color = "#B8860B", width = "100%", height = 32, style }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 400 32"
      width={width}
      height={height}
      className={className}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      {/* Garis tengah utama */}
      <line x1="0" y1="16" x2="155" y2="16" stroke={color} strokeWidth="0.75" opacity="0.5" />
      <line x1="245" y1="16" x2="400" y2="16" stroke={color} strokeWidth="0.75" opacity="0.5" />
      {/* Ornamen tengah — berlian bertingkat */}
      <path d="M200 6 L212 16 L200 26 L188 16 Z" stroke={color} strokeWidth="1.25" opacity="0.8" />
      <path d="M200 10 L208 16 L200 22 L192 16 Z" fill={color} opacity="0.2" />
      <circle cx="200" cy="16" r="2" fill={color} opacity="0.6" />
      {/* Sulur kiri */}
      <path d="M155 16 C165 8 175 24 185 16" stroke={color} strokeWidth="0.75" opacity="0.55" />
      <circle cx="170" cy="12" r="2" stroke={color} strokeWidth="0.75" opacity="0.5" />
      <line x1="170" y1="10" x2="170" y2="6" stroke={color} strokeWidth="0.5" opacity="0.4" />
      <path d="M168 6 C170 4 172 4 172 6" stroke={color} strokeWidth="0.5" opacity="0.4" />
      {/* Sulur kanan */}
      <path d="M215 16 C225 8 235 24 245 16" stroke={color} strokeWidth="0.75" opacity="0.55" />
      <circle cx="230" cy="12" r="2" stroke={color} strokeWidth="0.75" opacity="0.5" />
      <line x1="230" y1="10" x2="230" y2="6" stroke={color} strokeWidth="0.5" opacity="0.4" />
      <path d="M228 6 C230 4 232 4 232 6" stroke={color} strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

// ─────────────────────────────────────────
// 6. DIAMOND DIVIDER — penanda titik timeline berbentuk berlian emas
// ─────────────────────────────────────────
export function DiamondDivider({ className = "", color = "#B8860B", size = 16, style }: OrnamentProps & { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      <path d="M8 1 L15 8 L8 15 L1 8 Z" stroke={color} strokeWidth="1.25" opacity="0.85" />
      <path d="M8 4 L12 8 L8 12 L4 8 Z" fill={color} opacity="0.35" />
      <circle cx="8" cy="8" r="1.75" fill={color} opacity="0.8" />
    </svg>
  );
}

// ─────────────────────────────────────────
// 7. BATIK PARANG ACCENT — aksen garis diagonal bergaya parang kecil
// ─────────────────────────────────────────
export function ParangAccent({ className = "", color = "#B8860B", width = 60, height = 60, style }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 60 60"
      width={width}
      height={height}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      {/* Motif parang — kurva diagonal berulang */}
      <path d="M5 55 Q15 40 25 30 Q35 20 45 5" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <path d="M15 55 Q25 40 35 30 Q45 20 55 5" stroke={color} strokeWidth="1" opacity="0.35" />
      <path d="M0 40 Q10 30 20 20" stroke={color} strokeWidth="0.75" opacity="0.3" />
      <path d="M30 55 Q40 42 50 30 Q57 22 60 15" stroke={color} strokeWidth="0.75" opacity="0.25" />
      {/* Aksen titik di persimpangan */}
      <circle cx="25" cy="30" r="2" fill={color} opacity="0.45" />
      <circle cx="35" cy="30" r="1.5" fill={color} opacity="0.35" />
    </svg>
  );
}
