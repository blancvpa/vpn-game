import { FRICTION_CELL_INDICES } from '../data/cells'
import { FRICTION_EVENT_IDS, STORY_BY_CELL } from '../data/events'
import type { BoardEventMap } from '../game/types'

const SEEN_FRICTION_KEY = 'blancvpn-seen-friction'

function readSeenFriction(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_FRICTION_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed)
      ? parsed.filter((id) => (FRICTION_EVENT_IDS as readonly string[]).includes(id))
      : []
  } catch {
    return []
  }
}

function writeSeenFriction(ids: string[]): void {
  localStorage.setItem(SEEN_FRICTION_KEY, JSON.stringify(ids))
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
 * Story funnel cells are fixed. Friction cells get a rotating subset
 * of the friction pool (no repeats until the pool is exhausted).
 */
export function createBoardEventMap(): BoardEventMap {
  const boardEvents: BoardEventMap = { ...STORY_BY_CELL }

  const needed = FRICTION_CELL_INDICES.length
  let seen = readSeenFriction()
  let available = FRICTION_EVENT_IDS.filter((id) => !seen.includes(id))

  if (available.length < needed) {
    seen = []
    available = [...FRICTION_EVENT_IDS]
  }

  const picked = shuffle(available).slice(0, needed)
  FRICTION_CELL_INDICES.forEach((cellIndex, idx) => {
    boardEvents[cellIndex] = picked[idx]!
  })

  writeSeenFriction([...seen, ...picked])
  return boardEvents
}
