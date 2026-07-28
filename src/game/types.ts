export const BOARD_SIZE = 24
export const FINISH_INDEX = BOARD_SIZE - 1

export type EventEffect =
  | { kind: 'move'; steps: number }
  | { kind: 'skip'; turns: number }
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
  flavor?: string
}

export type BoardEventMap = Record<number, string>

export type Phase = 'idle' | 'rolling' | 'moving' | 'event' | 'won'

export type GameState = {
  position: number
  skipsLeft: number
  phase: Phase
  lastRoll: number | null
  activeEventId: string | null
  turns: number
  pendingSteps: number
  suppressEvents: boolean
  lastMessage: string | null
  vpnConnected: boolean
  visited: number[]
  boardEvents: BoardEventMap
}

export type GameAction =
  | { type: 'START_ROLL' }
  | { type: 'RESOLVE_ROLL'; value: number }
  | { type: 'STEP' }
  | { type: 'DISMISS_EVENT' }
  | { type: 'CONSUME_SKIP' }
  | { type: 'RESET'; boardEvents: BoardEventMap }
