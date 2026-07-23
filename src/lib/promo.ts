import { getPromoPool, PAY_BASE_URL } from '../data/promoCodes'

const STORAGE_KEY = 'blancvpn-free-internet-promo'

type PromoRecord = {
  code: string
  issuedAt: number
  completed: boolean
}

function readRecord(): PromoRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PromoRecord
  } catch {
    return null
  }
}

function writeRecord(record: PromoRecord): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
}

/** Already issued code for this device, if any */
export function getIssuedPromo(): string | null {
  return readRecord()?.code ?? null
}

export function hasCompletedOnce(): boolean {
  return Boolean(readRecord()?.completed)
}

/**
 * Issue a promo code on first finish. Replays reuse the same code.
 * Picks a random code from the pool (local uniqueness only).
 */
export function issuePromoOnWin(): string {
  const existing = readRecord()
  if (existing?.code) {
    writeRecord({ ...existing, completed: true })
    return existing.code
  }

  const pool = getPromoPool()
  const code = pool[Math.floor(Math.random() * pool.length)] ?? pool[0]!

  writeRecord({
    code,
    issuedAt: Date.now(),
    completed: true,
  })

  return code
}

export function buildPayUrl(code: string): string {
  const url = new URL(PAY_BASE_URL)
  url.searchParams.set('promo', code)
  return url.toString()
}
