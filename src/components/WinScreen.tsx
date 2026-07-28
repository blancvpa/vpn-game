import { useState } from 'react'
import { motion } from 'framer-motion'
import { buildPayUrl } from '../lib/promo'
import { copyText, shareResult } from '../lib/share'
import { track } from '../lib/analytics'
import './WinScreen.css'

type WinScreenProps = {
  code: string
  turns: number
  onReplay: () => void
}

export function WinScreen({ code, turns, onReplay }: WinScreenProps) {
  const [copyHint, setCopyHint] = useState<string | null>(null)

  async function handleCopy() {
    const ok = await copyText(code)
    setCopyHint(ok ? 'Скопировано' : 'Не удалось скопировать')
    track('promo_copy', { ok })
    window.setTimeout(() => setCopyHint(null), 1800)
  }

  async function handleShare() {
    const result = await shareResult(code)
    track('share', { result })
    if (result === 'copied') {
      setCopyHint('Текст скопирован')
      window.setTimeout(() => setCopyHint(null), 1800)
    }
  }

  function handlePay() {
    track('pay_click', { code })
    window.open(buildPayUrl(code), '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.section
      className="win"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="win__eyebrow">Финиш</p>
      <h1 className="win__title">Вы нашли свободный интернет</h1>
      <p className="win__lead">
        Вы добрались за {turns} {turnsLabel(turns)}. Промокод на подписку BlancVPN. Можно
        протестировать 30 дней — если не подойдет, вернем деньги.
      </p>

      <div className="win__code-block">
        <code className="win__code">{code}</code>
        <button type="button" className="btn btn-ghost win__copy" onClick={handleCopy}>
          Копировать
        </button>
      </div>
      {copyHint && <p className="win__hint">{copyHint}</p>}

      <div className="win__actions">
        <button type="button" className="btn btn-primary btn-block" onClick={handlePay}>
          Попробовать
        </button>
        <button type="button" className="btn btn-ghost btn-block" onClick={handleShare}>
          Поделиться
        </button>
        <button type="button" className="btn btn-ghost btn-block" onClick={onReplay}>
          Сыграть ещё
        </button>
      </div>
    </motion.section>
  )
}

function turnsLabel(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'ход'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'хода'
  return 'ходов'
}
