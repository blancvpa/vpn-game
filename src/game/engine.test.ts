import { describe, expect, it } from 'vitest'
import { createInitialState, reduce, rollDie } from './engine'
import type { GameState } from './types'
import { FINISH_INDEX } from './types'

describe('game engine', () => {
  it('creates idle state at start', () => {
    const state = createInitialState()
    expect(state.position).toBe(0)
    expect(state.phase).toBe('idle')
    expect(state.skipsLeft).toBe(0)
    expect(state.vpnConnected).toBe(false)
  })

  it('connects VPN when landing on BlancVPN cell', () => {
    let state: GameState = {
      ...createInitialState(),
      position: 9,
      phase: 'rolling',
    }
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 1 })
    state = reduce(state, { type: 'STEP' })
    expect(state.position).toBe(10)
    expect(state.activeEventId).toBe('blancvpn')
    expect(state.vpnConnected).toBe(true)
  })

  it('disconnects VPN on unpaid event', () => {
    let state: GameState = {
      ...createInitialState(),
      position: 21,
      phase: 'rolling',
      vpnConnected: true,
    }
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 1 })
    state = reduce(state, { type: 'STEP' })
    expect(state.activeEventId).toBe('unpaid')
    expect(state.vpnConnected).toBe(false)
  })

  it('moves forward on roll and lands idle on normal cell', () => {
    let state = createInitialState()
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
    let state = createInitialState()
    state = reduce(state, { type: 'START_ROLL' })
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 3 })
    while (state.phase === 'moving') {
      state = reduce(state, { type: 'STEP' })
    }
    expect(state.visited).toEqual(expect.arrayContaining([0, 1, 2, 3]))
  })

  it('opens event modal on surprise cell without chaining yet', () => {
    let state: GameState = {
      ...createInitialState(),
      position: 1,
      phase: 'rolling',
    }
    // cell 2 is whitelist surprise
    state = reduce(state, { type: 'RESOLVE_ROLL', value: 1 })
    state = reduce(state, { type: 'STEP' })
    expect(state.position).toBe(2)
    expect(state.phase).toBe('event')
    expect(state.activeEventId).toBe('whitelist')
  })

  it('applies move effect and chains into another event on land', () => {
    // cell 4 email_support (+2) → cell 6 wildberries
    let state: GameState = {
      ...createInitialState(),
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
    expect(state.activeEventId).toBe('wildberries')
  })

  it('move effect landing on a normal cell stays idle', () => {
    let state: GameState = {
      ...createInitialState(),
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
      ...createInitialState(),
      position: 6,
      phase: 'event',
      activeEventId: 'wildberries',
    }
    state = reduce(state, { type: 'DISMISS_EVENT' })
    expect(state.skipsLeft).toBe(1)
    expect(state.phase).toBe('idle')

    state = reduce(state, { type: 'CONSUME_SKIP' })
    expect(state.skipsLeft).toBe(0)
    expect(state.turns).toBe(1)
  })

  it('restarts on MAX event', () => {
    let state: GameState = {
      ...createInitialState(),
      position: 12,
      phase: 'event',
      activeEventId: 'max',
      turns: 5,
      skipsLeft: 2,
    }
    state = reduce(state, { type: 'DISMISS_EVENT' })
    expect(state.position).toBe(0)
    expect(state.phase).toBe('idle')
    expect(state.skipsLeft).toBe(0)
    expect(state.turns).toBe(5)
  })

  it('wins when roll reaches or passes finish', () => {
    let state: GameState = {
      ...createInitialState(),
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
      ...createInitialState(),
      skipsLeft: 2,
    }
    const next = reduce(state, { type: 'START_ROLL' })
    expect(next.phase).toBe('idle')
  })

  it('rollDie returns 1..6', () => {
    for (let i = 0; i < 40; i++) {
      const v = rollDie()
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(6)
    }
  })
})
