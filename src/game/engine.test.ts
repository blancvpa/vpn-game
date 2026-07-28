import { describe, expect, it } from 'vitest'
import { createInitialState, reduce, rollDie } from './engine'
import type { BoardEventMap, GameState } from './types'
import { BOARD_SIZE, FINISH_INDEX } from './types'
import { STORY_BY_CELL } from '../data/events'

const TEST_BOARD_EVENTS: BoardEventMap = {
  ...STORY_BY_CELL,
  1: 'whitelist',
}

describe('game engine', () => {
  it('uses a 12-cell board', () => {
    expect(BOARD_SIZE).toBe(12)
    expect(FINISH_INDEX).toBe(11)
  })

  it('creates idle state at start', () => {
    const state = createInitialState(TEST_BOARD_EVENTS)
    expect(state.position).toBe(0)
    expect(state.phase).toBe('idle')
    expect(state.skipsLeft).toBe(0)
    expect(state.vpnConnected).toBe(false)
    expect(state.boardEvents[2]).toBe('blancvpn_locations')
  })

  it('connects VPN when landing on BlancVPN story cell', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      position: 1,
      phase: 'rolling',
    }
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 1 })
    state = reduce(state, { type: 'STEP' })
    expect(state.position).toBe(2)
    expect(state.activeEventId).toBe('blancvpn_locations')
    expect(state.vpnConnected).toBe(true)
  })

  it('stops on the first surprise instead of jumping over the funnel', () => {
    let state = createInitialState(TEST_BOARD_EVENTS)
    state = reduce(state, { type: 'START_ROLL' })
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 6 })

    while (state.phase === 'moving') {
      state = reduce(state, { type: 'STEP' })
    }

    // Cell 1 is friction — stop there before the story funnel.
    expect(state.position).toBe(1)
    expect(state.phase).toBe('event')
    expect(state.activeEventId).toBe('whitelist')
  })

  it('reaches the first story cell after leaving start without friction', () => {
    const map: BoardEventMap = { ...STORY_BY_CELL }
    let state = createInitialState(map)
    state = reduce(state, { type: 'START_ROLL' })
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 6 })

    while (state.phase === 'moving') {
      state = reduce(state, { type: 'STEP' })
    }

    expect(state.position).toBe(2)
    expect(state.phase).toBe('event')
    expect(state.activeEventId).toBe('blancvpn_locations')
  })

  it('moves forward on roll and lands idle on normal cell', () => {
    const map: BoardEventMap = { ...STORY_BY_CELL }
    let state = createInitialState(map)
    state = reduce(state, { type: 'START_ROLL' })
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 1 })
    expect(state.phase).toBe('moving')
    expect(state.pendingSteps).toBe(1)

    state = reduce(state, { type: 'STEP' })
    expect(state.position).toBe(1)
    expect(state.phase).toBe('idle')
    expect(state.visited).toContain(1)
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
    expect(state.activeEventId).toBe('blancvpn_locations')
  })

  it('chains story move into the next story cell', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      position: 2,
      phase: 'event',
      activeEventId: 'blancvpn_locations',
      visited: [0, 2],
      vpnConnected: true,
    }
    state = reduce(state, { type: 'DISMISS_EVENT' })
    expect(state.phase).toBe('moving')

    while (state.phase === 'moving') {
      state = reduce(state, { type: 'STEP' })
    }

    expect(state.position).toBe(4)
    expect(state.phase).toBe('event')
    expect(state.activeEventId).toBe('blancvpn_split')
  })

  it('applies negative move without restarting the board', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      position: 1,
      phase: 'event',
      activeEventId: 'whitelist',
      visited: [0, 1],
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

  it('flavor events return to idle', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      position: 10,
      phase: 'event',
      activeEventId: 'blancvpn_discount',
    }
    state = reduce(state, { type: 'DISMISS_EVENT' })
    expect(state.phase).toBe('idle')
    expect(state.activeEventId).toBeNull()
    expect(state.position).toBe(10)
  })

  it('wins when roll reaches or passes finish', () => {
    let state: GameState = {
      ...createInitialState(TEST_BOARD_EVENTS),
      position: FINISH_INDEX - 2,
      phase: 'rolling',
    }
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 6 })
    expect(state.pendingSteps).toBe(2)

    while (state.phase === 'moving') {
      state = reduce(state, { type: 'STEP' })
    }

    // Cell 10 is a surprise — stop there instead of finishing in one roll from 9.
    // From FINISH_INDEX - 2 = 9, roll toward finish stops at 10 if surprise.
    if (state.phase === 'event') {
      expect(state.position).toBe(10)
      state = reduce(state, { type: 'DISMISS_EVENT' })
      while (state.phase === 'moving') {
        state = reduce(state, { type: 'STEP' })
      }
    }

    // From 10 after discount flavor, need another roll to finish
    if (state.phase === 'idle' && state.position === 10) {
      state = reduce(state, { type: 'START_ROLL' })
      state = reduce(state, { type: 'RESOLVE_ROLL', value: 6 })
      while (state.phase === 'moving') {
        state = reduce(state, { type: 'STEP' })
      }
    }

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
    const nextMap: BoardEventMap = { ...TEST_BOARD_EVENTS, 1: 'unstable_connection' }
    const state = reduce(createInitialState(TEST_BOARD_EVENTS), {
      type: 'RESET',
      boardEvents: nextMap,
    })
    expect(state.boardEvents[1]).toBe('unstable_connection')
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
