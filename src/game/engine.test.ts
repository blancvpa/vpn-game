import { describe, expect, it } from 'vitest'
import { createInitialState, reduce, rollDie } from './engine'
import type { BoardEventMap, GameState } from './types'
import { FINISH_INDEX } from './types'

const TEST_BOARD_EVENTS: BoardEventMap = {
  2: 'whitelist',
  4: 'email_support',
  6: 'wb_blocked',
  8: 'dpi_cut',
  10: 'blancvpn_youtube',
  12: 'max_order',
  14: 'support_silent',
  16: 'mirror_found',
  18: 'router_broken',
  19: 'captcha_everywhere',
  20: 'telegram_blocked',
  21: 'wifi_neighbor',
  22: 'unpaid_month',
}

describe('game engine', () => {
  it('creates idle state at start', () => {
    const state = createInitialState(TEST_BOARD_EVENTS)
    expect(state.position).toBe(0)
    expect(state.phase).toBe('idle')
    expect(state.skipsLeft).toBe(0)
    expect(state.vpnConnected).toBe(false)
    expect(state.boardEvents[10]).toBe('blancvpn_youtube')
  })

  it('connects VPN when landing on BlancVPN cell', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      position: 9,
      phase: 'rolling',
    }
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 1 })
    state = reduce(state, { type: 'STEP' })
    expect(state.position).toBe(10)
    expect(state.activeEventId).toBe('blancvpn_youtube')
    expect(state.vpnConnected).toBe(true)
  })

  it('disconnects VPN on unpaid event', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      position: 21,
      phase: 'rolling',
      vpnConnected: true,
    }
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 1 })
    state = reduce(state, { type: 'STEP' })
    expect(state.activeEventId).toBe('unpaid_month')
    expect(state.vpnConnected).toBe(false)
  })

  it('moves forward on roll and lands idle on normal cell', () => {
    let state = createInitialState(TEST_BOARD_EVENTS)
    state = reduce(state, { type: 'START_ROLL' })
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 1 })
    expect(state.phase).toBe('moving')
    expect(state.pendingSteps).toBe(1)

    state = reduce(state, { type: 'STEP' })
    expect(state.position).toBe(1)
    expect(state.phase).toBe('idle')
    expect(state.visited).toContain(1)
  })

  it('marks visited cells along the path', () => {
    let state = createInitialState(TEST_BOARD_EVENTS)
    state = reduce(state, { type: 'START_ROLL' })
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 3 })
    while (state.phase === 'moving') {
      state = reduce(state, { type: 'STEP' })
    }
    expect(state.visited).toEqual(expect.arrayContaining([0, 1, 2, 3]))
  })

  it('opens mapped event modal on surprise cell', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      position: 1,
      phase: 'rolling',
    }
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 1 })
    state = reduce(state, { type: 'STEP' })
    expect(state.position).toBe(2)
    expect(state.phase).toBe('event')
    expect(state.activeEventId).toBe('whitelist')
  })

  it('applies move effect and chains into another event on land', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      position: 4,
      phase: 'event',
      activeEventId: 'email_support',
      visited: [0, 4],
    }
    state = reduce(state, { type: 'DISMISS_EVENT' })
    expect(state.phase).toBe('moving')

    while (state.phase === 'moving') {
      state = reduce(state, { type: 'STEP' })
    }

    expect(state.position).toBe(6)
    expect(state.phase).toBe('event')
    expect(state.activeEventId).toBe('wb_blocked')
  })

  it('move effect landing on a normal cell stays idle', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      position: 2,
      phase: 'event',
      activeEventId: 'whitelist',
      visited: [0, 2],
    }
    state = reduce(state, { type: 'DISMISS_EVENT' })
    expect(state.phase).toBe('moving')

    while (state.phase === 'moving') {
      state = reduce(state, { type: 'STEP' })
    }

    expect(state.position).toBe(0)
    expect(state.phase).toBe('idle')
    expect(state.activeEventId).toBeNull()
  })

  it('applies skip turns', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      position: 6,
      phase: 'event',
      activeEventId: 'wb_blocked',
    }
    state = reduce(state, { type: 'DISMISS_EVENT' })
    expect(state.skipsLeft).toBe(1)
    expect(state.phase).toBe('idle')

    state = reduce(state, { type: 'CONSUME_SKIP' })
    expect(state.skipsLeft).toBe(0)
    expect(state.turns).toBe(1)
  })

  it('restarts on MAX event and preserves board events', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      position: 12,
      phase: 'event',
      activeEventId: 'max_order',
      turns: 5,
      skipsLeft: 2,
    }
    state = reduce(state, { type: 'DISMISS_EVENT' })
    expect(state.position).toBe(0)
    expect(state.phase).toBe('idle')
    expect(state.skipsLeft).toBe(0)
    expect(state.turns).toBe(5)
    expect(state.boardEvents[12]).toBe('max_order')
  })

  it('wins when roll reaches or passes finish', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      position: FINISH_INDEX - 2,
      phase: 'rolling',
    }
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 6 })
    expect(state.pendingSteps).toBe(2)

    state = reduce(state, { type: 'STEP' })
    state = reduce(state, { type: 'STEP' })
    expect(state.position).toBe(FINISH_INDEX)
    expect(state.phase).toBe('won')
  })

  it('blocks roll while skips remain', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      skipsLeft: 2,
    }
    const next = reduce(state, { type: 'START_ROLL' })
    expect(next.phase).toBe('idle')
  })

  it('resets with a new board map', () => {
    const nextMap: BoardEventMap = { ...TEST_BOARD_EVENTS, 2: 'mirror_found' }
    const state = reduce(createInitialState(TEST_BOARD_EVENTS), { type: 'RESET', boardEvents: nextMap })
    expect(state.boardEvents[2]).toBe('mirror_found')
    expect(state.position).toBe(0)
  })

  it('rollDie returns 1..6', () => {
    for (let i = 0; i < 40; i++) {
      const v = rollDie()
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(6)
    }
  })
})
