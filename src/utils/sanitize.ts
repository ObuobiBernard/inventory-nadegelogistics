/**
 * Security & Input Sanitization Utilities
 * Protects against Cross-Site Scripting (XSS), script injection, and payload poisoning.
 */

// Strip HTML tags and dangerous characters
export function sanitizeText(input: string | undefined | null): string {
  if (!input) return '';
  return String(input)
    .replace(/[<>]/g, '') // remove HTML tag brackets
    .trim();
}

// Sanitize phone number (digits, +, spaces, hyphens only)
export function sanitizePhone(phone: string | undefined | null): string {
  if (!phone) return '';
  return String(phone).replace(/[^\d+ \-()]/g, '').trim().slice(0, 20);
}

// Sanitize email address
export function sanitizeEmail(email: string | undefined | null): string {
  if (!email) return '';
  return String(email).trim().toLowerCase().slice(0, 100);
}

// Sanitize numbers to valid floats/integers
export function sanitizeNumber(val: any, defaultVal = 0, min = 0, max = 10000000): number {
  const num = Number(val);
  if (isNaN(num)) return defaultVal;
  return Math.min(Math.max(num, min), max);
}

// Client-side rate-limiting / throttle tracker
const rateLimitMap = new Map<string, number>();

export function checkRateLimit(actionKey: string, cooldownMs = 2500): boolean {
  const now = Date.now();
  const lastTime = rateLimitMap.get(actionKey) || 0;
  if (now - lastTime < cooldownMs) {
    return false; // throttled / rate limited
  }
  rateLimitMap.set(actionKey, now);
  return true; // allowed
}
