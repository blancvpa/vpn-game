import { AnimatePresence, motion } from 'framer-motion'
import type { BoardEvent } from '../game/types'
import './EventModal.css'

type EventModalProps = {
  event: BoardEvent | null
  onDismiss: () => void
}

function toneEyebrow(tone: BoardEvent['tone']): string {
  switch (tone) {
    case 'bad':
      return 'Помеха'
    case 'good':
      return 'Удача'
    case 'brand':
      return 'BlancVPN'
    case 'neutral':
      return 'Событие'
  }
}

function effectLabel(event: BoardEvent): string {
  const e = event.effect
  switch (e.kind) {
    case 'move':
      return e.steps > 0 ? `+${e.steps} клеток` : `${e.steps} клеток`
    case 'skip':
      return e.turns === 1 ? 'Пропуск хода' : `Пропуск ${e.turns} ходов`
    case 'flavor':
      return ''
  }
}

export function EventModal({ event, onDismiss }: EventModalProps) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          className="event-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={`event-modal__card event-modal__card--${event.tone}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-title"
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <p className={`event-modal__eyebrow event-modal__eyebrow--${event.tone}`}>
              {toneEyebrow(event.tone)}
            </p>
            <h2 id="event-title" className="event-modal__title">
              {event.title}
            </h2>
            <p className="event-modal__text">{event.text}</p>
            <p className="event-modal__effect">{effectLabel(event)}</p>
            <button type="button" className="btn btn-primary btn-block" onClick={onDismiss}>
              Понятно
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
