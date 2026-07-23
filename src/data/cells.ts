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

/** Surprise event placement on the 24-cell board (index → eventId) */
const SURPRISES: Record<number, string> = {
  2: 'whitelist',
  4: 'email_support',
  6: 'wildberries',
  8: 'dpi',
  10: 'blancvpn',
  12: 'max',
  14: 'support_silent',
  16: 'mirror',
  18: 'router',
  19: 'captcha',
  20: 'telegram_block',
  21: 'neighbor',
  22: 'unpaid',
}

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

    const eventId = SURPRISES[i]
    if (eventId) {
      cells.push({
        index: i,
        kind: 'surprise',
        label: String(i),
        eventId,
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
