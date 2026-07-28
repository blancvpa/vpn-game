import { describe, expect, it } from 'vitest'
import { createBoardEventMap } from './eventPool'
import { STORY_CELL_INDICES, SURPRISE_CELL_INDICES } from '../data/cells'
import { STORY_BY_CELL } from '../data/events'

describe('event pool', () => {
  it('creates one event per surprise cell', () => {
    const map = createBoardEventMap()
    expect(Object.keys(map)).toHaveLength(SURPRISE_CELL_INDICES.length)
  })

  it('keeps the product story funnel fixed', () => {
    const map = createBoardEventMap()
    for (const cell of STORY_CELL_INDICES) {
      expect(map[cell]).toBe(STORY_BY_CELL[cell])
    }
  })
})
