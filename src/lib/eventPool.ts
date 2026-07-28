import { GAME_CELL_INDICES } from '../data/cells'
import { GAME_EVENT_IDS, STORY_BY_CELL } from '../data/events'
import type { BoardEventMap } from '../game/types'

const SEEN_GAME_EVENTS_KEY = 'blancvpn-seen-game-events'

function readSeen(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_GAME_EVENTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed)
      ? parsed.filter((id) => (GAME_EVENT_IDS as readonly string[]).includes(id))
      : []
  } catch {
    return []
  }
}

function writeSeen(ids: string[]): void {
  localStorage.setItem(SEEN_GAME_EVENTS_KEY, JSON.stringify(ids))
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
 * Story funnel cells are fixed. Remaining surprise cells get a rotating
 * game-event subset (no repeats until the pool is exhausted).
 */
export function createBoardEventMap(): BoardEventMap {
  const boardEvents: BoardEventMap = { ...STORY_BY_CELL }

  const needed = GAME_CELL_INDICES.length
  let seen = readSeen()
  let available = GAME_EVENT_IDS.filter((id) => !seen.includes(id))

  if (available.length < needed) {
    seen = []
    available = [...GAME_EVENT_IDS]
  }

  const picked = shuffle(available).slice(0, needed)
  GAME_CELL_INDICES.forEach((cellIndex, idx) => {
    boardEvents[cellIndex] = picked[idx]!
  })

  writeSeen([...seen, ...picked])
  return boardEvents
}
