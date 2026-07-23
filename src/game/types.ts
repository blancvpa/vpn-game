export const BOARD_SIZE = 24
export const FINISH_INDEX = BOARD_SIZE - 1

export type EventEffect =
  | { kind: 'move'; steps: number }
  | { kind: 'skip'; turns: number }
  | { kind: 'restart' }
  | { kind: 'flavor' }

export type BoardEvent = {
  id: string
  title: string
  text: string
  effect: EventEffect
  tone: 'good' | 'bad' | 'neutral' | 'brand'
}

export type CellKind = 'start' | 'finish' | 'normal' | 'surprise'

export type BoardCell = {
  index: number
  kind: CellKind
  label: string
  /** Short flavor shown when landing on a normal cell */
  flavor?: string
  eventId?: string
}

export type Phase = 'idle' | 'rolling' | 'moving' | 'event' | 'won'

export type GameState = {
  position: number
  skipsLeft: number
  phase: Phase
  lastRoll: number | null
  activeEventId: string | null
  turns: number
  /** Remaining steps to animate (positive = forward, negative = back) */
  pendingSteps: number
  /** True while resolving a surprise move — no event chaining */
  suppressEvents: boolean
  lastMessage: string | null
  /** BlancVPN connection status — turns on at the brand cell */
  vpnConnected: boolean
  /** Cell indices the player has already stepped on */
  visited: number[]
}

export type GameAction =
  | { type: 'START_ROLL' }
  | { type: 'RESOLVE_ROLL'; value: number }
  | { type: 'STEP' }
  | { type: 'DISMISS_EVENT' }
  | { type: 'CONSUME_SKIP' }
  | { type: 'RESET' }
