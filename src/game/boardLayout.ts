import { BOARD_SIZE } from './types'

export type Point = { x: number; y: number }

export const BOARD_COLS = 6
export const BOARD_ROWS = Math.ceil(BOARD_SIZE / BOARD_COLS)

/**
 * Zigzag path in a 0–100 viewBox: start bottom-left, snake upward.
 * Even rows (from bottom) go left→right, odd rows right→left.
 */
export function getCellPositions(count = BOARD_SIZE): Point[] {
  const cols = BOARD_COLS
  const rows = Math.ceil(count / cols)
  const padX = 7
  const padY = 10
  const usableW = 100 - padX * 2
  const usableH = 100 - padY * 2
  const points: Point[] = []

  for (let i = 0; i < count; i++) {
    const rowFromBottom = Math.floor(i / cols)
    const colInRow = i % cols
    const goingRight = rowFromBottom % 2 === 0
    const col = goingRight ? colInRow : cols - 1 - colInRow

    const x = padX + (col + 0.5) * (usableW / cols)
    const y = 100 - padY - (rowFromBottom + 0.5) * (usableH / rows)
    points.push({ x, y })
  }

  return points
}

export const CELL_POSITIONS = getCellPositions()

/** Polyline points for the path connecting cells in order */
export function getPathD(positions = CELL_POSITIONS): string {
  if (positions.length === 0) return ''
  return positions.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')
}
