import { STORY_BY_CELL } from '../data/events'
import type { BoardEventMap } from '../game/types'

/** Fixed product funnel — every playthrough sees the same story beats. */
export function createBoardEventMap(): BoardEventMap {
  return { ...STORY_BY_CELL }
}
