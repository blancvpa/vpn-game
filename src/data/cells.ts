import type { BoardCell } from '../game/types'
import { BOARD_SIZE, FINISH_INDEX } from '../game/types'

const FLAVORS = [
  'Ищете стабильный доступ к сети',
  'Проверяете, открываются ли нужные сайты',
  'Сравниваете варианты защиты соединения',
  'Думаете, как пользоваться сервисами спокойнее',
]

/** Story funnel cells — events assigned in eventPool */
export const STORY_CELL_INDICES = [2, 4, 6, 8, 9, 10] as const

/** Optional light friction before the funnel starts */
export const FRICTION_CELL_INDICES = [1] as const

export const SURPRISE_CELL_INDICES = [
  ...STORY_CELL_INDICES,
  ...FRICTION_CELL_INDICES,
] as const

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
