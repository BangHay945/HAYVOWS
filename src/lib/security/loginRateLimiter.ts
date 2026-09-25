/**
 * Hayvows Login Security & Anti-Brute-Force Rate Limiter
 *
 * Mencegah serangan brute-force, password guessing, dan credential stuffing
 * dengan membatasi jumlah percobaan login yang gagal per identifier (email / IP).
 */

interface RateLimitRecord {
  attempts: number;
  firstAttempt: number;
  lockedUntil: number | null;
}

// In-memory store untuk pelacakan percobaan login
const loginAttempts = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5; // Maksimal 5 kali salah password
const WINDOW_MS = 15 * 60 * 1000; // Jendela waktu 15 menit
const LOCKOUT_MS = 15 * 60 * 1000; // Durasi penguncian 15 menit

/**
 * Membersihkan record usang secara berkala untuk mencegah kebocoran memori
 */
function cleanupExpiredRecords() {
  const now = Date.now();
  for (const [key, record] of loginAttempts.entries()) {
    if (record.lockedUntil && now > record.lockedUntil) {
      loginAttempts.delete(key);
    } else if (now - record.firstAttempt > WINDOW_MS && !record.lockedUntil) {
      loginAttempts.delete(key);
    }
  }
}

// Jalankan pembersihan setiap 10 menit
setInterval(cleanupExpiredRecords, 10 * 60 * 1000).unref();

export interface RateLimitCheckResult {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
  message?: string;
}

/**
 * Memeriksa apakah identifier (email) sedang terkunci karena terlalu banyak percobaan gagal
 */
export function checkLoginRateLimit(identifier: string): RateLimitCheckResult {
  const key = identifier.toLowerCase().trim();
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // Jika akun sedang dalam masa penguncian (lockout)
  if (record.lockedUntil && now < record.lockedUntil) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    const minutes = Math.ceil(remainingSeconds / 60);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds: remainingSeconds,
      message: `Terlalu banyak percobaan masuk yang gagal. Demi keamanan, akun ini dikunci sementara selama ${minutes} menit. Silakan coba kembali nanti.`,
    };
  }

  // Jika masa jendela waktu sudah terlewati, reset record
  if (now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.delete(key);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - record.attempts);
  return { allowed: true, remainingAttempts: remaining };
}

/**
 * Mencatat percobaan login yang gagal
 */
export function recordFailedLogin(identifier: string): RateLimitCheckResult {
  const key = identifier.toLowerCase().trim();
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record || now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.set(key, {
      attempts: 1,
      firstAttempt: now,
      lockedUntil: null,
    });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  record.attempts += 1;

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
    const minutes = Math.ceil(LOCKOUT_MS / (60 * 1000));
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000),
      message: `Terlalu banyak percobaan masuk yang gagal. Demi keamanan, akun ini dikunci sementara selama ${minutes} menit. Silakan coba kembali nanti.`,
    };
  }

  const remaining = MAX_ATTEMPTS - record.attempts;
  return {
    allowed: true,
    remainingAttempts: remaining,
    message: `Email atau kata sandi tidak sesuai. Sisa kesempatan: ${remaining} kali sebelum akun dikunci sementara.`,
  };
}

/**
 * Mereset catatan kegagalan saat login berhasil
 */
export function resetLoginRateLimit(identifier: string): void {
  const key = identifier.toLowerCase().trim();
  loginAttempts.delete(key);
}
