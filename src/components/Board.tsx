import { CELLS } from '../data/cells'
import { CELL_POSITIONS, getPathD } from '../game/boardLayout'
import type { GameState } from '../game/types'
import { Token } from './Token'
import './Board.css'

type BoardProps = {
  state: GameState
}

export function Board({ state }: BoardProps) {
  const tokenPos = CELL_POSITIONS[state.position] ?? CELL_POSITIONS[0]!
  const pathD = getPathD()
  const visitedSet = new Set(state.visited)

  return (
    <div className="board" aria-label="Игровое поле">
      <svg className="board__svg" viewBox="0 0 100 100" role="presentation">
        <path className="board__track" d={pathD} fill="none" />

        {CELLS.map((cell, i) => {
          const p = CELL_POSITIONS[i]!
          const isHere = state.position === i
          const isVisited = visitedSet.has(i)
          const kindClass =
            cell.kind === 'surprise'
              ? 'board__cell--surprise'
              : cell.kind === 'start'
                ? 'board__cell--start'
                : cell.kind === 'finish'
                  ? 'board__cell--finish'
                  : 'board__cell--normal'

          const isSpecial = cell.kind === 'start' || cell.kind === 'finish'
          const r = isSpecial ? 5.2 : cell.kind === 'surprise' ? 4.6 : 4.2

          return (
            <g key={cell.index} transform={`translate(${p.x} ${p.y})`}>
              <circle
                className={[
                  'board__cell',
                  kindClass,
                  isVisited ? 'board__cell--visited' : '',
                  isHere ? 'board__cell--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                r={r}
              />
              {cell.kind === 'start' || cell.kind === 'finish' ? (
                <>
                  <text
                    className="board__cell-num board__cell-num--special"
                    textAnchor="middle"
                    dy="0.35em"
                  >
                    {cell.index}
                  </text>
                  <text
                    className={`board__cell-caption ${cell.kind === 'finish' ? 'board__cell-caption--finish' : ''}`}
                    textAnchor="middle"
                    dy={cell.kind === 'start' ? '8.2' : '-6.4'}
                  >
                    {cell.label}
                  </text>
                </>
              ) : (
                <>
                  <text
                    className={`board__cell-num ${isVisited ? 'board__cell-num--visited' : ''}`}
                    textAnchor="middle"
                    dy="0.35em"
                  >
                    {cell.index}
                  </text>
                  {cell.kind === 'surprise' && (
                    <text className="board__cell-bang" textAnchor="middle" dy="-5.6">
                      !
                    </text>
                  )}
                </>
              )}
            </g>
          )
        })}

        <Token x={tokenPos.x} y={tokenPos.y} />
      </svg>

      <div className="board__legend">
        <span>
          <i className="board__dot board__dot--normal" /> обычное
        </span>
        <span>
          <i className="board__dot board__dot--surprise" /> событие
        </span>
        <span>
          <i className="board__dot board__dot--visited" /> пройдено
        </span>
        <span>
          <i className="board__dot board__dot--finish" /> финиш
        </span>
      </div>
    </div>
  )
}
