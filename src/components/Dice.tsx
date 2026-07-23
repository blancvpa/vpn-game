import './Dice.css'

const PIP_MAP: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
}

type DiceProps = {
  value: number | null
  rolling: boolean
}

function Face({ pips }: { pips: number[] }) {
  return (
    <div className="dice3d__pips">
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={`dice3d__pip ${pips.includes(i) ? 'dice3d__pip--on' : ''}`} />
      ))}
    </div>
  )
}

export function Dice({ value, rolling }: DiceProps) {
  const face = value && value >= 1 && value <= 6 ? value : 1

  return (
    <div
      className={`dice3d ${rolling ? 'dice3d--rolling' : ''}`}
      aria-label={`Кубик: ${value ?? '—'}`}
    >
      <div className={`dice3d__cube dice3d__cube--${face}`}>
        <div className="dice3d__face dice3d__face--1">
          <Face pips={PIP_MAP[1]!} />
        </div>
        <div className="dice3d__face dice3d__face--2">
          <Face pips={PIP_MAP[2]!} />
        </div>
        <div className="dice3d__face dice3d__face--3">
          <Face pips={PIP_MAP[3]!} />
        </div>
        <div className="dice3d__face dice3d__face--4">
          <Face pips={PIP_MAP[4]!} />
        </div>
        <div className="dice3d__face dice3d__face--5">
          <Face pips={PIP_MAP[5]!} />
        </div>
        <div className="dice3d__face dice3d__face--6">
          <Face pips={PIP_MAP[6]!} />
        </div>
      </div>
    </div>
  )
}
