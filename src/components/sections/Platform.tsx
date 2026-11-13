import { Check, ChevronDown } from 'lucide-react'
import { Chip, SectionHeading } from '../ui'
import { useI18n } from '../../i18n/context'

/** The one thing to understand: a controller in the home, with devices around it. */
function HubDiagram({ home, nodes }: { home: string; nodes: string[] }) {
  // Nodes sit evenly on a ring around the hub, first one at the top, so any
  // number of `platform.nodes` strings gets a place.
  const cx = 180
  const cy = 140
  const ring = 112
  const spots = nodes.map((_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / nodes.length
    return { x: cx + ring * Math.cos(angle), y: cy + ring * Math.sin(angle) }
  })
  return (
    <svg
      viewBox="0 0 360 262"
      className="mx-auto h-auto w-full max-w-[34rem]"
      role="img"
      aria-label={`${home}: ${nodes.join(', ')}`}
    >
      <circle cx={cx} cy={cy} r={ring} fill="none" stroke="rgb(255 255 255 / 0.1)" />
      {spots.map((spot, i) => (
        <g key={i}>
          <path
            d={`M${cx} ${cy}L${spot.x} ${spot.y}`}
            stroke="var(--color-bamboo-400)"
            strokeWidth="1.5"
            strokeDasharray="4 5"
            opacity="0.7"
          />
          <rect
            x={spot.x - 60}
            y={spot.y - 20}
            width="120"
            height="40"
            rx="20"
            fill="#1d2329"
            stroke="rgb(255 255 255 / 0.22)"
          />
          <text x={spot.x} y={spot.y + 5.5} textAnchor="middle" fontSize="16" fontWeight="500" fill="#e3e7ea" fontFamily="inherit">
            {nodes[i]}
          </text>
        </g>
      ))}
      <circle cx={cx} cy={cy} r="62" fill="var(--color-bamboo-500)" opacity="0.18" />
      <circle cx={cx} cy={cy} r="46" fill="var(--color-bamboo-500)" />
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize="17" fontWeight="600" fill="#fff" fontFamily="inherit">
        {home}
      </text>
    </svg>
  )
}

export function Platform() {
  const { t } = useI18n()
  const p = t.platform

  return (
    <section id="platform" className="band bg-ink-950 text-paper">
      <div className="shell">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-14">
          <div>
            <SectionHeading eyebrow={p.eyebrow} title={p.title} lead={p.lead} tone="dark" shortOnPhone />
            <ul className="mt-6 space-y-2.5">
              {p.outcomes.map((outcome) => (
                <li key={outcome} className="flex items-center gap-2.5 text-[0.9375rem] text-[#e3e7ea]">
                  <Check size={16} strokeWidth={2.6} className="shrink-0 text-bamboo-300" aria-hidden="true" />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
          <HubDiagram home={p.hubLabel} nodes={p.nodes} />
        </div>

        <details className="group mt-8 border-t border-white/10 pt-5">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-[0.9375rem] font-semibold text-paper [&::-webkit-details-marker]:hidden">
            {p.compatLabel}
            <ChevronDown
              size={18}
              aria-hidden="true"
              className="text-[#c7cdd2] transition-transform duration-300 group-open:rotate-180"
            />
          </summary>

          <div className="mt-4 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-[#c7cdd2]">{p.protocolsTitle}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {p.protocols.map((protocol) => (
                  <li key={protocol.label}>
                    <Chip tone="dark">{protocol.label}</Chip>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#c7cdd2]">{t.compatibility.title}</h3>
              <ul className="mt-3 space-y-3">
                {t.compatibility.groups.map((group) => (
                  <li key={group.title} className="text-[0.875rem] leading-relaxed text-[#c7cdd2]">
                    <span className="font-medium text-paper">{group.title}: </span>
                    {group.brands.join(' · ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-[#aab2ba]">
            {t.compatibility.disclaimer}
          </p>
        </details>
      </div>
    </section>
  )
}
