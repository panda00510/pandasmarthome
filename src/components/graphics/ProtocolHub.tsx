import { useI18n } from '../../i18n/context'

/* Layout constants for the 1000x380 viewBox. */
const ROW_Y = [50, 136, 222, 308]
const NODE_W = 236
const LEFT_X = 0
const RIGHT_X = 764
const HUB = { x: 500, y: 179, r: 58 }

/**
 * Hub-and-spoke diagram for the protocols section.
 *
 * It draws the actual argument the page is making: many protocols, one local
 * system. Packets travel inward only — nothing leaves for the cloud.
 *
 * Desktop only. A radial diagram cannot survive a 375px viewport, so the
 * Platform section keeps the plain list at smaller sizes rather than
 * shrinking this into illegibility.
 */
export function ProtocolHub() {
  const { t } = useI18n()
  const protocols = t.platform.protocols.slice(0, 8)

  const nodes = protocols.map((protocol, i) => {
    const side = i < 4 ? 'left' : 'right'
    const y = ROW_Y[i % 4]
    const x = side === 'left' ? LEFT_X : RIGHT_X
    // Spokes start at the inner edge of each node box.
    const edgeX = side === 'left' ? x + NODE_W : x
    return { ...protocol, x, y, edgeX, side }
  })

  return (
    <svg
      viewBox="0 0 1000 380"
      className="mt-8 w-full"
      role="img"
      aria-label={t.platform.protocolsTitle}
    >
      {/* Spokes, drawn first so the hub covers where they converge. */}
      <g stroke="currentColor" className="text-white/15" strokeWidth="1">
        {nodes.map((n) => (
          <line key={`l-${n.label}`} x1={n.edgeX} y1={n.y} x2={HUB.x} y2={HUB.y} />
        ))}
      </g>

      {/* Inbound traffic. Staggered so they never pulse in unison. */}
      <g className="protocol-packet fill-bamboo-400">
        {nodes.map((n, i) => (
          <circle key={`p-${n.label}`} r="2.8">
            <animateMotion
              dur={`${3 + (i % 4) * 0.45}s`}
              begin={`${i * 0.42}s`}
              repeatCount="indefinite"
              path={`M${n.edgeX},${n.y} L${HUB.x},${HUB.y}`}
            />
          </circle>
        ))}
      </g>

      {/* Protocol nodes */}
      {nodes.map((n) => (
        <g key={n.label}>
          <rect
            x={n.x}
            y={n.y - 28}
            width={NODE_W}
            height="56"
            rx="12"
            className="fill-white/6"
          />
          <text
            x={n.x + 16}
            y={n.y - 4}
            className="fill-paper text-[13px] font-semibold"
          >
            {n.label}
          </text>
          {/* 10px keeps the longest English note clear of the box edge; SVG
              text does not wrap, so it has to fit on one line. */}
          <text x={n.x + 16} y={n.y + 14} className="fill-ink-400 text-[10px]">
            {n.note}
          </text>
        </g>
      ))}

      {/* Hub */}
      <circle cx={HUB.x} cy={HUB.y} r={HUB.r} className="fill-ink-950 stroke-bamboo-500" strokeWidth="1.5" />
      <circle
        cx={HUB.x}
        cy={HUB.y}
        r={HUB.r}
        fill="none"
        className="protocol-packet stroke-bamboo-500"
        strokeWidth="1.5"
        opacity="0.5"
      >
        <animate attributeName="r" values={`${HUB.r};${HUB.r + 16}`} dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.45;0" dur="3s" repeatCount="indefinite" />
      </circle>
      <text
        x={HUB.x}
        y={HUB.y + 5}
        textAnchor="middle"
        className="fill-paper text-[14px] font-semibold"
      >
        {t.platform.hubLabel}
      </text>
    </svg>
  )
}
