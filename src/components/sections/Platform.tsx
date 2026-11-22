import { Check, ChevronDown } from 'lucide-react'
import { Chip, SectionHeading } from '../ui'
import { useI18n } from '../../i18n/context'

/** Architectural local-hub topology in botanical jade, warm parchment & brass. */
function HubDiagram({ home, nodes }: { home: string; nodes: string[] }) {
  const spots = [
    { x: 74, y: 46 },
    { x: 74, y: 174 },
    { x: 346, y: 110 },
  ]
  return (
    <svg
      viewBox="0 0 420 220"
      className="h-auto w-full"
      role="img"
      aria-label={`${home}: ${nodes.join(', ')}`}
    >
      <defs>
        <radialGradient id="hub-aura">
          <stop offset="0" stopColor="var(--color-ember-400)" stopOpacity="0.28" />
          <stop offset="0.65" stopColor="var(--color-bamboo-400)" stopOpacity="0.08" />
          <stop offset="1" stopColor="var(--color-bamboo-400)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hub-core" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4efe6" />
          <stop offset="1" stopColor="#e5c48c" />
        </linearGradient>
      </defs>

      {/* Architectural range rings */}
      <circle cx="210" cy="110" r="102" fill="url(#hub-aura)" />
      <circle cx="210" cy="110" r="94" fill="none" stroke="rgb(244 239 230 / 0.1)" strokeDasharray="3 6" />
      <circle cx="210" cy="110" r="64" fill="none" stroke="rgb(229 196 140 / 0.25)" />

      {/* Local links & device nodes */}
      {spots.map((spot, i) => (
        <g key={i}>
          <path
            d={`M210 110L${spot.x} ${spot.y}`}
            stroke="rgb(229 196 140 / 0.28)"
            strokeWidth="1.3"
          />
          <path
            d={`M210 110L${spot.x} ${spot.y}`}
            stroke="var(--color-ember-300)"
            strokeWidth="1.5"
            strokeDasharray="4 14"
            strokeLinecap="round"
            className="signal-flow"
          />
          <rect
            x={spot.x - 62}
            y={spot.y - 19}
            width="124"
            height="38"
            rx="3"
            fill="#101c17"
            stroke="rgb(244 239 230 / 0.22)"
          />
          <circle cx={spot.x - 44} cy={spot.y} r="3" fill="var(--color-ember-300)" />
          <text
            x={spot.x + 6}
            y={spot.y + 4.5}
            textAnchor="middle"
            fontSize="13"
            fontWeight="500"
            fill="#f4efe6"
            fontFamily="inherit"
          >
            {nodes[i]}
          </text>
        </g>
      ))}

      {/* Central local controller core */}
      <circle cx="210" cy="110" r="50" fill="rgb(229 196 140 / 0.12)" />
      <circle cx="210" cy="110" r="40" fill="url(#hub-core)" />
      <text
        x="210"
        y="115"
        textAnchor="middle"
        fontSize="13.5"
        fontWeight="650"
        fill="#14221c"
        fontFamily="inherit"
      >
        {home}
      </text>
    </svg>
  )
}

export function Platform() {
  const { t } = useI18n()
  const p = t.platform

  return (
    <section id="platform" className="band relative isolate overflow-hidden bg-ink-950 text-paper">
      <div aria-hidden="true" className="hairline-dark pointer-events-none absolute inset-x-0 top-0" />
      <div aria-hidden="true" className="stage-grid pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden="true" className="stage-glow pointer-events-none absolute -inset-[10%] -z-10 opacity-75" />

      <div className="shell">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <SectionHeading eyebrow={p.eyebrow} title={p.title} lead={p.lead} tone="dark" shortOnPhone />
            <ul className="mt-7 divide-y divide-paper/12 border-y border-paper/14">
              {p.outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="flex items-center gap-3.5 py-3.5 text-[0.9375rem] text-paper/90"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-[2px] border border-ember-300/35 bg-ember-300/12 text-ember-300">
                    <Check size={13} strokeWidth={2.4} aria-hidden="true" />
                  </span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bevel-dark relative overflow-hidden rounded-panel bg-[#192922] p-5 sm:p-7">
            <div aria-hidden="true" className="stage-grid pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative">
              <HubDiagram home={p.hubLabel} nodes={p.nodes} />
            </div>
          </div>
        </div>

        <details className="group mt-10 overflow-hidden rounded-card border border-paper/15 bg-paper/[0.03]">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3.5 text-[0.9375rem] font-semibold text-paper transition-colors hover:bg-paper/[0.05] [&::-webkit-details-marker]:hidden">
            {p.compatLabel}
            <span className="grid size-8 shrink-0 place-items-center rounded-[2px] border border-paper/20 text-paper/80 transition-colors group-open:border-ember-300 group-open:bg-ember-300 group-open:text-ink-950">
              <ChevronDown
                size={15}
                aria-hidden="true"
                className="transition-transform duration-300 group-open:rotate-180"
              />
            </span>
          </summary>

          <div className="border-t border-paper/12 px-5 pt-5 pb-6">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="font-mono text-[0.6875rem] font-semibold tracking-[0.16em] text-ember-300 uppercase">
                  {p.protocolsTitle}
                </h3>
                <ul className="mt-3.5 flex flex-wrap gap-2">
                  {p.protocols.map((protocol) => (
                    <li key={protocol.label}>
                      <Chip tone="dark">{protocol.label}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-mono text-[0.6875rem] font-semibold tracking-[0.16em] text-ember-300 uppercase">
                  {t.compatibility.title}
                </h3>
                <ul className="mt-3.5 space-y-3">
                  {t.compatibility.groups.map((group) => (
                    <li key={group.title} className="text-[0.875rem] leading-relaxed text-ink-300">
                      <span className="font-medium text-paper">{group.title}: </span>
                      {group.brands.join(' · ')}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-6 max-w-3xl border-t border-paper/10 pt-4 text-xs leading-relaxed text-ink-400">
              {t.compatibility.disclaimer}
            </p>
          </div>
        </details>
      </div>
    </section>
  )
}
