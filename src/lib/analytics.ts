type AnalyticsPayload = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

export function track(event: string, payload: AnalyticsPayload = {}): void {
  const entry = { event, ...payload, ts: Date.now() }

  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(entry)

  if (import.meta.env.DEV) {
    console.debug('[analytics]', entry)
  }
}
