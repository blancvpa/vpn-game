import type { BoardCell } from '../game/types'
import { BOARD_SIZE, FINISH_INDEX } from '../game/types'
import { STORY_BY_CELL } from './events'

const FLAVORS = [
  'Ищете стабильный доступ к сети',
  'Проверяете, открываются ли нужные сайты',
  'Сравниваете варианты защиты соединения',
  'Думаете, как пользоваться сервисами спокойнее',
  'Пробуете другой способ подключения',
  'Ждете, пока страница наконец загрузится',
]

export const STORY_CELL_INDICES = Object.keys(STORY_BY_CELL).map(Number).sort((a, b) => a - b)

/** Non-story surprises — filled from the rotating game pool */
export const GAME_CELL_INDICES = [2, 4, 7, 9, 12, 15, 18, 21] as const

export const SURPRISE_CELL_INDICES = [...STORY_CELL_INDICES, ...GAME_CELL_INDICES].sort(
  (a, b) => a - b,
)

function buildCells(): BoardCell[] {
  const cells: BoardCell[] = []
  const surpriseSet = new Set<number>(SURPRISE_CELL_INDICES)

  for (let i = 0; i < BOARD_SIZE; i++) {
    if (i === 0) {
      cells.push({
        index: i,
        kind: 'start',
        label: 'Старт',
        flavor: 'Поиск свободного интернета начинается здесь.',
      })
      continue
    }

    if (i === FINISH_INDEX) {
      cells.push({
        index: i,
        kind: 'finish',
        label: 'Финиш',
        flavor: 'Свободный интернет найден.',
      })
      continue
    }

    if (surpriseSet.has(i)) {
      cells.push({
        index: i,
        kind: 'surprise',
        label: String(i),
      })
      continue
    }

    cells.push({
      index: i,
      kind: 'normal',
      label: String(i),
      flavor: FLAVORS[(i - 1) % FLAVORS.length],
    })
  }

  return cells
}

export const CELLS: BoardCell[] = buildCells()

export function getCell(index: number): BoardCell {
  const cell = CELLS[index]
  if (!cell) {
    throw new Error(`Unknown cell: ${index}`)
  }
  return cell
}

export function isStoryCell(index: number): boolean {
  return STORY_CELL_INDICES.includes(index)
}
