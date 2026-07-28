import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createBoardEventMap } from './eventPool'
import { FRICTION_CELL_INDICES, STORY_CELL_INDICES, SURPRISE_CELL_INDICES } from '../data/cells'
import { FRICTION_EVENT_IDS, STORY_BY_CELL } from '../data/events'

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

  it('rotates friction events across playthroughs', () => {
    const firstMap = createBoardEventMap()
    const first = FRICTION_CELL_INDICES.map((i) => firstMap[i]!)
    const secondMap = createBoardEventMap()
    const second = FRICTION_CELL_INDICES.map((i) => secondMap[i]!)

    expect(first).toHaveLength(FRICTION_CELL_INDICES.length)
    expect(second).toHaveLength(FRICTION_CELL_INDICES.length)
    expect((FRICTION_EVENT_IDS as readonly string[]).includes(first[0]!)).toBe(true)
    expect(first[0]).not.toBe(second[0])
  })
})
