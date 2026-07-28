import { EVENT_IDS } from '../data/events'
import { SURPRISE_CELL_INDICES } from '../data/cells'
import type { BoardEventMap } from '../game/types'

const SEEN_EVENTS_KEY = 'blancvpn-seen-events'

function readSeenEvents(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_EVENTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed) ? parsed.filter((id) => EVENT_IDS.includes(id)) : []
  } catch {
    return []
  }
}

function writeSeenEvents(ids: string[]): void {
  localStorage.setItem(SEEN_EVENTS_KEY, JSON.stringify(ids))
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Assign a fresh set of event ids to action cells.
 * Events do not repeat across playthroughs until the full catalog is exhausted.
 */
export function createBoardEventMap(): BoardEventMap {
  const required = SURPRISE_CELL_INDICES.length
  let seen = readSeenEvents()
  let available = EVENT_IDS.filter((id) => !seen.includes(id))

  if (available.length < required) {
    seen = []
    available = [...EVENT_IDS]
  }

  const picked = shuffle(available).slice(0, required)
  const boardEvents: BoardEventMap = {}

  SURPRISE_CELL_INDICES.forEach((cellIndex, idx) => {
    boardEvents[cellIndex] = picked[idx]!
  })

  writeSeenEvents([...seen, ...picked])
  return boardEvents
}
