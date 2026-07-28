import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createBoardEventMap } from './eventPool'
import { GAME_CELL_INDICES, STORY_CELL_INDICES, SURPRISE_CELL_INDICES } from '../data/cells'
import { GAME_EVENT_IDS, STORY_BY_CELL } from '../data/events'

const store = new Map<string, string>()

vi.stubGlobal('localStorage', {
  getItem(key: string) {
    return store.get(key) ?? null
  },
  setItem(key: string, value: string) {
    store.set(key, value)
  },
  removeItem(key: string) {
    store.delete(key)
  },
})

describe('event pool', () => {
  beforeEach(() => {
    store.clear()
  })

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

  it('fills game cells from the rotating pool without repeats in one board', () => {
    const map = createBoardEventMap()
    const gameIds = GAME_CELL_INDICES.map((i) => map[i]!)
    expect(new Set(gameIds).size).toBe(gameIds.length)
    for (const id of gameIds) {
      expect((GAME_EVENT_IDS as readonly string[]).includes(id)).toBe(true)
    }
  })
})
