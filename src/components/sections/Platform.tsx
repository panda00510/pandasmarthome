import { Check, ChevronDown } from 'lucide-react'
import { Chip, SectionHeading } from '../ui'
import { useI18n } from '../../i18n/context'

/** The one thing to understand: a controller in the home, with devices around it. */
function HubDiagram({ home, nodes }: { home: string; nodes: string[] }) {
  const spots = [
    { x: 64, y: 40 },
    { x: 64, y: 140 },
    { x: 336, y: 90 },
  ]
  return (
    <svg
      viewBox="0 0 400 180"
      className="h-auto w-full"
      role="img"
      aria-label={`${home}: ${nodes.join(', ')}`}
    >
      {spots.map((spot, i) => (
        <g key={i}>
          <path
            d={`M200 90L${spot.x} ${spot.y}`}
            stroke="var(--color-bamboo-400)"
            strokeWidth="1.5"
            strokeDasharray="4 5"
            opacity="0.7"
          />
          <rect
            x={spot.x - 52}
            y={spot.y - 17}
            width="104"
            height="34"
            rx="17"
            fill="rgb(255 255 255 / 0.08)"
            stroke="rgb(255 255 255 / 0.18)"
          />
          <text x={spot.x} y={spot.y + 5} textAnchor="middle" fontSize="14" fill="#e3e7ea" fontFamily="inherit">
            {nodes[i]}
          </text>
        </g>
      ))}
      <circle cx="200" cy="90" r="46" fill="var(--color-bamboo-500)" opacity="0.18" />
      <circle cx="200" cy="90" r="34" fill="var(--color-bamboo-500)" />
      <text x="200" y="95" textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff" fontFamily="inherit">
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
          <div className="rounded-panel border border-white/10 bg-white/[0.03] p-4 sm:p-6">
            <HubDiagram home={p.hubLabel} nodes={p.nodes} />
          </div>
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
