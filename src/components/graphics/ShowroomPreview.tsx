/**
 * Isometric floor plan standing in for the 3D showroom. Drawn, not
 * screenshotted: it stays sharp, costs a few hundred bytes and never loads
 * WebGL on the homepage. Room names come from `showroom.rooms`.
 */

// Plan coordinates (300 × 200) → screen, 30° isometric.
const iso = (x: number, y: number) => [0.866 * (x - y) + 200, 0.5 * (x + y) + 34] as const
const pt = (x: number, y: number, lift = 0) => {
  const [X, Y] = iso(x, y)
  return `${X.toFixed(1)},${(Y - lift).toFixed(1)}`
}

const WALL = 36
const SLAB = 12

/** Index-matched to `showroom.rooms`: living, master, kitchen, bedroom. */
const ROOMS = [
  { x: 0, y: 0, w: 170, h: 120 },
  { x: 170, y: 0, w: 130, h: 95 },
  { x: 0, y: 120, w: 110, h: 80 },
  { x: 170, y: 95, w: 130, h: 105 },
]
const HALL = { x: 110, y: 120, w: 60, h: 80 }

const FURNITURE = [
  { x: 18, y: 78, w: 92, h: 24 },
  { x: 120, y: 20, w: 30, h: 30 },
  { x: 200, y: 18, w: 72, h: 52 },
  { x: 8, y: 132, w: 16, h: 58 },
  { x: 196, y: 165, w: 78, h: 22 },
]

/** Device lights; `warm` marks a lamp (ember is reserved for lighting). */
const DEVICES = [
  { x: 64, y: 46, warm: true },
  { x: 140, y: 92 },
  { x: 238, y: 82 },
  { x: 58, y: 166 },
  { x: 140, y: 160 },
  { x: 250, y: 130, warm: true },
]

export function ShowroomPreview({ rooms }: { rooms: string[] }) {
  return (
    <svg viewBox="0 0 490 320" className="h-auto w-full" aria-hidden="true">
      <defs>
        <radialGradient id="sr-green">
          <stop offset="0" stopColor="var(--color-bamboo-300)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--color-bamboo-300)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sr-warm">
          <stop offset="0" stopColor="var(--color-ember-300)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--color-ember-300)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sr-floor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.09" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.03" />
        </linearGradient>
      </defs>

      {/* Slab edges (front faces) */}
      <polygon points={`${pt(300, 0)} ${pt(300, 200)} ${pt(300, 200, -SLAB)} ${pt(300, 0, -SLAB)}`} fill="rgb(255 255 255 / 0.05)" />
      <polygon points={`${pt(0, 200)} ${pt(300, 200)} ${pt(300, 200, -SLAB)} ${pt(0, 200, -SLAB)}`} fill="rgb(255 255 255 / 0.08)" />

      {/* Back walls */}
      <polygon points={`${pt(0, 0)} ${pt(300, 0)} ${pt(300, 0, WALL)} ${pt(0, 0, WALL)}`} fill="rgb(255 255 255 / 0.05)" stroke="rgb(255 255 255 / 0.14)" />
      <polygon points={`${pt(0, 0)} ${pt(0, 200)} ${pt(0, 200, WALL)} ${pt(0, 0, WALL)}`} fill="rgb(255 255 255 / 0.03)" stroke="rgb(255 255 255 / 0.14)" />

      {/* Floor plan in plan space */}
      <g transform="matrix(0.866 0.5 -0.866 0.5 200 34)">
        {[...ROOMS, HALL].map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="url(#sr-floor)" stroke="rgb(255 255 255 / 0.22)" vectorEffect="non-scaling-stroke" />
        ))}
        {FURNITURE.map((f, i) => (
          <rect key={i} x={f.x} y={f.y} width={f.w} height={f.h} rx="4" fill="rgb(255 255 255 / 0.08)" stroke="rgb(255 255 255 / 0.12)" vectorEffect="non-scaling-stroke" />
        ))}
      </g>

      {/* Device lights */}
      {DEVICES.map((d, i) => {
        const [X, Y] = iso(d.x, d.y)
        return (
          <g key={i}>
            <ellipse
              cx={X}
              cy={Y}
              rx="30"
              ry="16"
              fill={`url(#${d.warm ? 'sr-warm' : 'sr-green'})`}
              className="iso-pulse"
              style={{ animationDelay: `${i * 0.45}s` }}
            />
            <circle cx={X} cy={Y} r="3.2" fill={d.warm ? 'var(--color-ember-300)' : 'var(--color-bamboo-300)'} />
          </g>
        )
      })}

      {/* Room labels */}
      {ROOMS.map((r, i) => {
        const [X, Y] = iso(r.x + r.w / 2, r.y + r.h / 2)
        return rooms[i] ? (
          <text key={i} x={X} y={Y + 22} textAnchor="middle" fontSize="11" fontWeight="500" fill="var(--color-ink-300)" fontFamily="inherit" letterSpacing="0.04em">
            {rooms[i]}
          </text>
        ) : null
      })}
    </svg>
  )
}
