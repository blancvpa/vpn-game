import { describe, expect, it } from 'vitest'
import { createInitialState, reduce, rollDie } from './engine'
import type { BoardEventMap, GameState } from './types'
import { BOARD_SIZE, FINISH_INDEX } from './types'
import { STORY_BY_CELL } from '../data/events'

const TEST_BOARD_EVENTS: BoardEventMap = {
  ...STORY_BY_CELL,
  2: 'captcha_wall',
  4: 'mirror_found',
  7: 'slow_dns',
  9: 'incognito',
  12: 'right_tip',
  15: 'whitelist',
  18: 'stable_dns',
  21: 'phone_works',
}

describe('game engine', () => {
  it('uses a 24-cell board', () => {
    expect(BOARD_SIZE).toBe(24)
    expect(FINISH_INDEX).toBe(23)
  })

  it('creates idle state at start', () => {
    const state = createInitialState(TEST_BOARD_EVENTS)
    expect(state.position).toBe(0)
    expect(state.phase).toBe('idle')
    expect(state.boardEvents[5]).toBe('blancvpn_locations')
  })

  it('can land on a normal cell without opening an event', () => {
    let state = createInitialState(TEST_BOARD_EVENTS)
    state = reduce(state, { type: 'START_ROLL' })
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 1 })
    state = reduce(state, { type: 'STEP' })
    expect(state.position).toBe(1)
    expect(state.phase).toBe('idle')
  })

  it('opens a game event only on exact landing', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      position: 1,
      phase: 'rolling',
    }
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 1 })
    state = reduce(state, { type: 'STEP' })
    expect(state.position).toBe(2)
    expect(state.phase).toBe('event')
    expect(state.activeEventId).toBe('captcha_wall')
  })

  it('stops on a story cell instead of jumping over the funnel', () => {
    let state = createInitialState(TEST_BOARD_EVENTS)
    state = reduce(state, { type: 'START_ROLL' })
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 6 })

    while (state.phase === 'moving') {
      state = reduce(state, { type: 'STEP' })
    }

    expect(state.position).toBe(5)
    expect(state.phase).toBe('event')
    expect(state.activeEventId).toBe('blancvpn_locations')
    expect(state.vpnConnected).toBe(true)
  })

  it('can pass a game surprise without stopping when rolling past it', () => {
    // From 0, roll 3: path 1→2→3. Cell 2 is game surprise — should NOT force-stop.
    let state = createInitialState(TEST_BOARD_EVENTS)
    state = reduce(state, { type: 'START_ROLL' })
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 3 })

    while (state.phase === 'moving') {
      state = reduce(state, { type: 'STEP' })
    }

    expect(state.position).toBe(3)
    expect(state.phase).toBe('idle')
  })

  it('chains a story bonus into a later cell', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      position: 5,
      phase: 'event',
      activeEventId: 'blancvpn_locations',
      visited: [0, 5],
      vpnConnected: true,
    }
    state = reduce(state, { type: 'DISMISS_EVENT' })
    while (state.phase === 'moving') {
      state = reduce(state, { type: 'STEP' })
    }
    // +2 from 5 → 7, exact game surprise
    expect(state.position).toBe(7)
    expect(state.phase).toBe('event')
    expect(state.activeEventId).toBe('slow_dns')
  })

  it('applies skip turns', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      position: 7,
      phase: 'event',
      activeEventId: 'slow_dns',
    }
    state = reduce(state, { type: 'DISMISS_EVENT' })
    expect(state.skipsLeft).toBe(1)
    state = reduce(state, { type: 'CONSUME_SKIP' })
    expect(state.skipsLeft).toBe(0)
    expect(state.turns).toBe(1)
  })

  it('wins when reaching finish', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      position: FINISH_INDEX - 1,
      phase: 'rolling',
    }
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 6 })
    while (state.phase === 'moving') {
      state = reduce(state, { type: 'STEP' })
    }
    expect(state.position).toBe(FINISH_INDEX)
    expect(state.phase).toBe('won')
  })

  it('rollDie returns 1..6', () => {
    for (let i = 0; i < 40; i++) {
      const v = rollDie()
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(6)
    }
  })
})
