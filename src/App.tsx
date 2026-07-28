import { useEffect, useReducer, useState } from 'react'
import { BlancLogo } from './components/BlancLogo'
import { Board } from './components/Board'
import { Dice } from './components/Dice'
import { EventModal } from './components/EventModal'
import { Splash } from './components/Splash'
import { ThemeToggle } from './components/ThemeToggle'
import { VpnStatus } from './components/VpnStatus'
import { WinScreen } from './components/WinScreen'
import { getEvent } from './data/events'
import { createBoardEventMap } from './lib/eventPool'
import { track } from './lib/analytics'
import { issuePromoOnWin } from './lib/promo'
import { applyTheme, getStoredTheme, setStoredTheme, type Theme } from './lib/theme'
import { createInitialState, reduce, rollDie } from './game/engine'
import type { GameAction, GameState } from './game/types'
import './App.css'

type Screen = 'splash' | 'play' | 'win'

function gameReducer(state: GameState, action: GameAction): GameState {
  return reduce(state, action)
}

const STEP_MS = 360
const ROLL_MS = 900

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialState())
  const [promoCode, setPromoCode] = useState<string | null>(null)
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme())

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (state.phase !== 'moving') return

    const id = window.setInterval(() => {
      dispatch({ type: 'STEP' })
    }, STEP_MS)

    return () => window.clearInterval(id)
  }, [state.phase])

  useEffect(() => {
    if (state.phase !== 'won') return
    const code = issuePromoOnWin()
    setPromoCode(code)
    track('game_finish', { turns: state.turns, code })
    setScreen('win')
  }, [state.phase, state.turns])

  function handleThemeToggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setStoredTheme(next)
    track('theme_toggle', { theme: next })
  }

  function startNewGame(source: 'start' | 'replay') {
    const boardEvents = createBoardEventMap()
    track(source === 'start' ? 'game_start' : 'game_replay', {
      eventsAssigned: Object.keys(boardEvents).length,
    })
    dispatch({ type: 'RESET', boardEvents })
    setScreen('play')
  }

  function handleStart() {
    startNewGame('start')
  }

  function handleReplay() {
    startNewGame('replay')
  }

  async function handleRoll() {
    if (state.phase !== 'idle') return

    if (state.skipsLeft > 0) {
      dispatch({ type: 'CONSUME_SKIP' })
      return
    }

    dispatch({ type: 'START_ROLL' })
    const value = rollDie()
    await wait(ROLL_MS)
    dispatch({ type: 'RESOLVE_ROLL', value })
  }

  const busy = state.phase === 'rolling' || state.phase === 'moving' || state.phase === 'event'
  const activeEvent = state.activeEventId ? getEvent(state.activeEventId) : null

  return (
    <div className="app-shell">
      <div className="app-toolbar">
        <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
      </div>

      {screen === 'splash' && <Splash onStart={handleStart} />}

      {screen === 'play' && (
        <section className="play">
          <header className="play__header">
            <div className="play__brand">
              <BlancLogo size={22} />
              <span>BlancVPN</span>
            </div>
            <p className="play__title">В поисках свободного интернета</p>
          </header>

          <VpnStatus connected={state.vpnConnected} />

          <Board state={state} />

          <div className="play__controls">
            <Dice value={state.lastRoll} rolling={state.phase === 'rolling'} />
            <button
              type="button"
              className="btn btn-primary play__roll"
              disabled={busy}
              onClick={handleRoll}
            >
              {state.skipsLeft > 0
                ? `Пропустить ход (${state.skipsLeft})`
                : state.phase === 'rolling'
                  ? 'Кубик крутится…'
                  : state.phase === 'moving'
                    ? 'Идём…'
                    : 'Бросить кубик'}
            </button>
          </div>

          <EventModal
            event={state.phase === 'event' ? activeEvent : null}
            onDismiss={() => dispatch({ type: 'DISMISS_EVENT' })}
          />
        </section>
      )}

      {screen === 'win' && promoCode && (
        <WinScreen code={promoCode} turns={state.turns} onReplay={handleReplay} />
      )}
    </div>
  )
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
