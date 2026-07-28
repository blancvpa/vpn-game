import type { BoardCell } from '../game/types'
import { BOARD_SIZE, FINISH_INDEX } from '../game/types'

const FLAVORS = [
  'DNS не резолвится…',
  'Пинг 900 ms…',
  'Капча грузится вечность…',
  'SSL-сертификат просрочен…',
  'Пакеты теряются по пути…',
  'CDN отдаёт 403…',
  'Обход через соседний AS…',
  'Включаете режим инкогнито. Не помогает.',
  'Проверяете IP — всё ещё «домашний».',
  'Ищете рабочий DNS…',
]

export const SURPRISE_CELL_INDICES = [2, 4, 6, 8, 10, 12, 14, 16, 18, 19, 20, 21, 22] as const

function buildCells(): BoardCell[] {
  const cells: BoardCell[] = []

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
        flavor: 'Свободный интернет найден!',
      })
      continue
    }

    if (SURPRISE_CELL_INDICES.includes(i as (typeof SURPRISE_CELL_INDICES)[number])) {
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
