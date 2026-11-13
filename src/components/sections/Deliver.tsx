import { ArrowRight } from 'lucide-react'
import { useI18n } from '../../i18n/context'

/**
 * "What you receive": the three written records of a job, drawn as simple
 * illustrations. They are not photographs of a client file and are labelled
 * as illustrations, so nothing here can be mistaken for proof of a project.
 */
const INK = 'var(--color-ink-300)'
const GREEN = 'var(--color-bamboo-500)'

function ScopeArt() {
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full" aria-hidden="true">
      <rect x="62" y="12" width="116" height="128" rx="10" fill="#fff" stroke={INK} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(78 ${32 + i * 26})`}>
          <rect width="14" height="14" rx="4" fill={i < 3 ? GREEN : 'none'} stroke={i < 3 ? GREEN : INK} />
          {i < 3 ? <path d="M3.5 7.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          <rect x="24" y="3" width={[64, 52, 70, 40][i]} height="7" rx="3.5" fill="var(--color-ink-200)" />
        </g>
      ))}
    </svg>
  )
}

function PlanArt() {
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full" aria-hidden="true">
      <rect x="30" y="18" width="180" height="114" rx="8" fill="#fff" stroke={INK} />
      <path d="M30 70h84M114 18v52M114 100h96M150 100v32" stroke={INK} fill="none" />
      <path d="M60 94L114 70L168 44" stroke={GREEN} strokeWidth="1.6" strokeDasharray="4 4" fill="none" />
      <path d="M114 70L186 112" stroke={GREEN} strokeWidth="1.6" strokeDasharray="4 4" fill="none" />
      <circle cx="114" cy="70" r="9" fill={GREEN} />
      <circle cx="60" cy="94" r="5" fill="#fff" stroke={GREEN} strokeWidth="2" />
      <circle cx="168" cy="44" r="5" fill="#fff" stroke={GREEN} strokeWidth="2" />
      <circle cx="186" cy="112" r="5" fill="#fff" stroke={GREEN} strokeWidth="2" />
    </svg>
  )
}

function HandoverArt() {
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full" aria-hidden="true">
      <rect x="58" y="22" width="124" height="108" rx="10" fill="var(--color-ink-100)" stroke={INK} />
      <rect x="48" y="14" width="124" height="108" rx="10" fill="#fff" stroke={INK} />
      <rect x="64" y="30" width="60" height="9" rx="4.5" fill="var(--color-ink-800)" />
      <rect x="64" y="50" width="92" height="6" rx="3" fill="var(--color-ink-200)" />
      <rect x="64" y="64" width="76" height="6" rx="3" fill="var(--color-ink-200)" />
      <rect x="64" y="86" width="44" height="22" rx="11" fill={GREEN} />
      <circle cx="75" cy="97" r="4" fill="#fff" />
      <rect x="83" y="95" width="18" height="4" rx="2" fill="#fff" />
    </svg>
  )
}

const ART = { scope: ScopeArt, plan: PlanArt, handover: HandoverArt }

/**
 * Compact "what you receive" strip, rendered at the foot of the process
 * section: the three written records as one row of small cards.
 */
export function DeliverStrip() {
  const { t, lang } = useI18n()
  const d = t.deliver

  return (
    <div id="deliver" className="mt-10 border-t border-ink-200 pt-8 lg:mt-12 lg:pt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">{d.eyebrow}</p>
          <h3 className="mt-2 text-[1.375rem] leading-snug font-semibold tracking-[-0.02em] text-ink-950 sm:text-2xl">
            {d.title}
          </h3>
          <p className="mt-1 text-xs text-ink-500">{d.note}</p>
        </div>
        <a
          href={`${import.meta.env.BASE_URL}showroom/?lang=${lang}`}
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold text-bamboo-700 hover:text-bamboo-600"
        >
          {d.demoCta}
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>

      <ul className="reveal-group mt-6 grid gap-3 md:grid-cols-3">
        {d.items.map((item) => {
          const Art = ART[item.id as keyof typeof ART] ?? ScopeArt
          return (
            <li key={item.id} data-reveal className="card flex items-center gap-4 overflow-hidden p-3 pr-4">
              <div className="h-16 w-24 shrink-0 rounded-xl bg-bamboo-50/70 p-1">
                <Art />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wide text-bamboo-700">{item.tag}</p>
                <p className="mt-1 text-[0.9375rem] leading-snug font-semibold text-ink-950">{item.title}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
