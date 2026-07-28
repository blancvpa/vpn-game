import { getCell } from '../data/cells'
import { getEvent } from '../data/events'
import {
  FINISH_INDEX,
  type BoardEventMap,
  type GameAction,
  type GameState,
} from './types'

export function createInitialState(boardEvents: BoardEventMap = {}): GameState {
  return {
    position: 0,
    skipsLeft: 0,
    phase: 'idle',
    lastRoll: null,
    activeEventId: null,
    turns: 0,
    pendingSteps: 0,
    suppressEvents: false,
    lastMessage: null,
    vpnConnected: false,
    visited: [0],
    boardEvents,
  }
}

function markVisited(visited: number[], index: number): number[] {
  return visited.includes(index) ? visited : [...visited, index]
}

function vpnStatusForEvent(eventId: string, current: boolean): boolean {
  if (eventId.startsWith('blancvpn_')) return true
  return current
}

function clampPosition(position: number): number {
  return Math.max(0, Math.min(FINISH_INDEX, position))
}

function stepsToward(from: number, to: number): number {
  return to - from
}

function resolveLanding(state: GameState): GameState {
  const visited = markVisited(state.visited, state.position)

  if (state.position >= FINISH_INDEX) {
    return {
      ...state,
      position: FINISH_INDEX,
      phase: 'won',
      pendingSteps: 0,
      activeEventId: null,
      suppressEvents: false,
      lastMessage: null,
      visited: markVisited(visited, FINISH_INDEX),
    }
  }

  if (state.suppressEvents) {
    return {
      ...state,
      phase: 'idle',
      pendingSteps: 0,
      suppressEvents: false,
      activeEventId: null,
      visited,
      lastMessage: null,
    }
  }

  const cell = getCell(state.position)
  const eventId = state.boardEvents[state.position]

  if (cell.kind === 'surprise' && eventId) {
    return {
      ...state,
      phase: 'event',
      activeEventId: eventId,
      pendingSteps: 0,
      lastMessage: null,
      visited,
      vpnConnected: vpnStatusForEvent(eventId, state.vpnConnected),
    }
  }

  return {
    ...state,
    phase: 'idle',
    pendingSteps: 0,
    activeEventId: null,
    visited,
    lastMessage: null,
  }
}

function beginMove(state: GameState, target: number, suppressEvents: boolean): GameState {
  const next = clampPosition(target)
  const pending = stepsToward(state.position, next)

  if (pending === 0) {
    return resolveLanding({
      ...state,
      position: next,
      pendingSteps: 0,
      suppressEvents,
    })
  }

  return {
    ...state,
    phase: 'moving',
    pendingSteps: pending,
    suppressEvents,
    activeEventId: null,
  }
}

function applyEventEffect(state: GameState): GameState {
  if (!state.activeEventId) {
    return { ...state, phase: 'idle', activeEventId: null }
  }

  const event = getEvent(state.activeEventId)
  const effect = event.effect

  switch (effect.kind) {
    case 'flavor':
      return {
        ...state,
        phase: 'idle',
        activeEventId: null,
        lastMessage: null,
      }
    case 'skip':
      return {
        ...state,
        phase: 'idle',
        activeEventId: null,
        skipsLeft: state.skipsLeft + effect.turns,
        lastMessage: null,
      }
    case 'move': {
      const target = clampPosition(state.position + effect.steps)
      return beginMove(
        {
          ...state,
          activeEventId: null,
          lastMessage: null,
        },
        target,
        false,
      )
    }
  }
}

export function reduce(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'RESET':
      return createInitialState(action.boardEvents)

    case 'CONSUME_SKIP': {
      if (state.phase !== 'idle' || state.skipsLeft <= 0) return state
      return {
        ...state,
        skipsLeft: state.skipsLeft - 1,
        turns: state.turns + 1,
        lastMessage: null,
      }
    }

    case 'START_ROLL': {
      if (state.phase !== 'idle' || state.skipsLeft > 0) return state
      return {
        ...state,
        phase: 'rolling',
        lastMessage: null,
      }
    }

    case 'RESOLVE_ROLL': {
      if (state.phase !== 'rolling') return state
      const value = action.value
      const remaining = FINISH_INDEX - state.position
      const steps = Math.min(value, remaining)
      const target = state.position + steps

      return beginMove(
        {
          ...state,
          lastRoll: value,
          turns: state.turns + 1,
          suppressEvents: false,
        },
        target,
        false,
      )
    }

    case 'STEP': {
      if (state.phase !== 'moving' || state.pendingSteps === 0) return state

      const direction = state.pendingSteps > 0 ? 1 : -1
      const nextPosition = clampPosition(state.position + direction)
      const nextPending = state.pendingSteps - direction
      const visited = markVisited(state.visited, nextPosition)

      // Moving forward: stop on the first surprise so the product funnel is not skipped.
      if (direction > 0 && !state.suppressEvents && nextPosition < FINISH_INDEX) {
        const cell = getCell(nextPosition)
        const eventId = state.boardEvents[nextPosition]
        if (cell.kind === 'surprise' && eventId) {
          return resolveLanding({
            ...state,
            position: nextPosition,
            pendingSteps: 0,
            visited,
          })
        }
      }

      if (nextPending === 0) {
        return resolveLanding({
          ...state,
          position: nextPosition,
          pendingSteps: 0,
          visited,
        })
      }

      return {
        ...state,
        position: nextPosition,
        pendingSteps: nextPending,
        visited,
      }
    }

    case 'DISMISS_EVENT': {
      if (state.phase !== 'event') return state
      return applyEventEffect(state)
    }

    default:
      return state
  }
}

export function rollDie(): number {
  return Math.floor(Math.random() * 6) + 1
}
