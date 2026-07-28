import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createBoardEventMap } from './eventPool'
import { SURPRISE_CELL_INDICES } from '../data/cells'

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

  it('does not repeat events across two consecutive boards', () => {
    const first = Object.values(createBoardEventMap())
    const second = Object.values(createBoardEventMap())

    expect(new Set(first).size).toBe(first.length)
    expect(new Set(second).size).toBe(second.length)
    expect(first.some((id) => second.includes(id))).toBe(false)
  })
})
