import { ArrowRight, Play } from 'lucide-react'
import { ShowroomPreview } from '../graphics/ShowroomPreview'
import { Button } from '../ui'
import { useI18n } from '../../i18n/context'

/**
 * The homepage's feature band for the 3D showroom (a separate build at
 * /showroom/). No iframe: a drawn preview and one large action keep WebGL off
 * the homepage until the visitor asks for it.
 */
export function Showroom() {
  const { t, lang } = useI18n()
  const s = t.showroom
  const href = `${import.meta.env.BASE_URL}showroom/?lang=${lang}`

  return (
    <section id="showroom" className="band relative isolate overflow-hidden border-t border-white/[0.06] bg-ink-950 text-paper">
      <div aria-hidden="true" className="stage-grid pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden="true" className="stage-glow pointer-events-none absolute -inset-[10%] -z-10" />

      <div className="shell grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div data-reveal>
          <p className="eyebrow text-bamboo-300!">
            <span aria-hidden="true" className="h-px w-6 bg-bamboo-300/60" />
            {s.eyebrow}
          </p>
          <h2 className="mt-5 text-[2.25rem] leading-[1.04] font-semibold tracking-[-0.04em] sm:text-[3.25rem] lg:text-[3.25rem]">
            {s.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">{s.lead}</p>

          <ol className="mt-7 divide-y divide-white/10 border-y border-white/10 lg:mt-8">
            {t.hero.panel.scenes.map((scene, i) => (
              <li key={scene.name} className="flex items-baseline gap-4 py-3">
                <span className="numeral text-sm font-semibold text-bamboo-300">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0 text-[0.9375rem] leading-snug">
                  <span className="font-medium text-paper">{scene.name}</span>
                  <span className="text-ink-400"> · {scene.detail}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
            <Button as="a" href={href} variant="glow" size="lg" className="w-full sm:w-auto">
              {t.hero.showroomCta}
              <ArrowRight size={17} aria-hidden="true" />
            </Button>
            <ul className="flex gap-2">
              {s.plans.map((plan) => (
                <li key={plan.id} className="flex-1 sm:flex-none">
                  <a
                    href={`${href}&plan=${plan.id}`}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full px-3.5 text-[0.8125rem] font-medium text-ink-200 ring-1 ring-white/15 transition-colors hover:bg-white/8 hover:text-paper hover:ring-white/30"
                  >
                    {plan.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Duplicate of the button above for pointer users; kept out of the tab order. */}
        <a
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          data-reveal
          className="group relative block overflow-hidden rounded-panel bg-linear-to-b from-ink-900 to-ink-950 p-4 shadow-stage sm:p-8"
        >
          <div aria-hidden="true" className="stage-grid pointer-events-none absolute inset-0" />
          <div className="relative transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <ShowroomPreview rooms={s.rooms} />
          </div>
          <span className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6">
            <span className="grid size-14 place-items-center rounded-full bg-bamboo-400 text-ink-950 shadow-glow transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none sm:size-16">
              <Play size={26} className="translate-x-0.5" fill="currentColor" />
            </span>
          </span>
          <span className="absolute bottom-6 left-4 flex max-w-[calc(100%-6rem)] items-center gap-2 rounded-full bg-ink-950/70 px-3.5 py-2 text-xs text-ink-300 ring-1 ring-white/10 backdrop-blur-md sm:bottom-9 sm:left-6">
            <span className="size-1.5 shrink-0 rounded-full bg-bamboo-400" />
            <span className="truncate">{s.status}</span>
          </span>
        </a>
      </div>
    </section>
  )
}
