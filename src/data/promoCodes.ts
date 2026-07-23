/**
 * Placeholder promo pool. Replace with real billing codes before launch.
 * Encoded with a light XOR + base64 split so codes are not plain in one place.
 */

const KEY = 0x5a

function encode(code: string): string {
  const bytes = Array.from(code).map((ch) => ch.charCodeAt(0) ^ KEY)
  return btoa(String.fromCharCode(...bytes))
}

function decode(chunk: string): string {
  const raw = atob(chunk)
  return Array.from(raw)
    .map((ch) => String.fromCharCode(ch.charCodeAt(0) ^ KEY))
    .join('')
}

/** Split encoded pool — join at runtime */
const POOL_A = [
  encode('FREE-NET-001'),
  encode('FREE-NET-002'),
  encode('FREE-NET-003'),
  encode('FREE-NET-004'),
  encode('FREE-NET-005'),
  encode('FREE-NET-006'),
  encode('FREE-NET-007'),
  encode('FREE-NET-008'),
  encode('FREE-NET-009'),
  encode('FREE-NET-010'),
]

const POOL_B = [
  encode('FREE-NET-011'),
  encode('FREE-NET-012'),
  encode('FREE-NET-013'),
  encode('FREE-NET-014'),
  encode('FREE-NET-015'),
  encode('FREE-NET-016'),
  encode('FREE-NET-017'),
  encode('FREE-NET-018'),
  encode('FREE-NET-019'),
  encode('FREE-NET-020'),
]

const POOL_C = [
  encode('FREE-NET-021'),
  encode('FREE-NET-022'),
  encode('FREE-NET-023'),
  encode('FREE-NET-024'),
  encode('FREE-NET-025'),
  encode('FREE-NET-026'),
  encode('FREE-NET-027'),
  encode('FREE-NET-028'),
  encode('FREE-NET-029'),
  encode('FREE-NET-030'),
]

export function getPromoPool(): string[] {
  return [...POOL_A, ...POOL_B, ...POOL_C].map(decode)
}

export const PAY_BASE_URL = 'https://blancvpn.com/pay?plan=43'
