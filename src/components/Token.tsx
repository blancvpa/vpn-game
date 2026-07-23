type TokenProps = {
  x: number
  y: number
}

/** Player marker on the board (SVG coords). */
export function Token({ x, y }: TokenProps) {
  return (
    <g
      className="board__token"
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <circle className="board__token-ring" r="5.2" />
      <circle className="board__token-core" r="3.2" />
    </g>
  )
}
