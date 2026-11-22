import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { Button } from '../ui'
import { useI18n } from '../../i18n/context'
import type { Content } from '../../content/types'
import { showroomHref } from '../../lib/showroom'

const clip = `${import.meta.env.BASE_URL}media/showroom-demo`
const noop = () => () => {}

/**
 * The homepage's deep botanical-forest showcase band for the 3D showroom
 * (/showroom/). Provides deliberate mid-page contrast against the sunlit
 * travertine monograph sections, framing the 12 s auto-demo clip inside an
 * architectural screening plate.
 */
export function Showroom() {
  const { t, lang } = useI18n()
  const s = t.showroom
  const href = showroomHref(lang)

  return (
    <section id="showroom" className="band relative isolate overflow-hidden bg-ink-950 text-paper">
      <div aria-hidden="true" className="hairline-dark pointer-events-none absolute inset-x-0 top-0" />
      <div aria-hidden="true" className="stage-grid pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden="true" className="stage-glow pointer-events-none absolute -inset-[10%] -z-10" />

      <div className="shell grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
        <div data-reveal>
          <p className="eyebrow text-ember-300!">{s.eyebrow}</p>
          <h2 className="title-display mt-4 text-paper">{s.title}</h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">{s.lead}</p>

          <ol className="mt-7 divide-y divide-paper/12 border-y border-paper/14 lg:mt-8">
            {t.hero.panel.scenes.map((scene, i) => (
              <li key={scene.name} className="flex items-baseline gap-4 py-3.5 transition-colors hover:bg-paper/[0.03]">
                <span className="numeral text-xs font-semibold text-ember-300">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0 text-[0.9375rem] leading-snug">
                  <span className="font-medium text-paper">{scene.name}</span>
                  <span className="text-ink-400"> · {scene.detail}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button as="a" href={href} variant="glow" size="lg" className="w-full sm:w-auto">
              {t.hero.showroomCta}
              <ArrowRight size={17} aria-hidden="true" />
            </Button>
            <ul className="inline-flex overflow-hidden rounded-[3px] border border-paper/18 bg-paper/[0.04]">
              {s.plans.map((plan, idx) => (
                <li key={plan.id} className={`flex-1 sm:flex-none ${idx > 0 ? 'border-l border-paper/14' : ''}`}>
                  <a
                    href={showroomHref(lang, plan.id)}
                    className="inline-flex min-h-12 w-full items-center justify-center px-3.5 text-[0.8125rem] font-medium text-paper/85 transition-colors hover:bg-paper/10 hover:text-ember-300"
                  >
                    {plan.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ShowroomClip href={href} s={s} />
      </div>
    </section>
  )
}

function ShowroomClip({ href, s }: { href: string; s: Content['showroom'] }) {
  const box = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const held = useRef(false)
  const hydrated = useSyncExternalStore(noop, () => true, () => false)
  const [armed, setArmed] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    held.current = matchMedia('(prefers-reduced-motion: reduce)').matches || Boolean(conn?.saveData)
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return video.current?.pause()
        if (held.current) return
        if (video.current) void video.current.play().catch(() => {})
        else setArmed(true)
      },
      { threshold: 0.3 },
    )
    if (box.current) io.observe(box.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (armed) void video.current?.play().catch(() => {})
  }, [armed])

  const toggle = () => {
    const v = video.current
    if (v && !v.paused) {
      held.current = true
      v.pause()
      return
    }
    held.current = false
    if (v) void v.play().catch(() => {})
    else setArmed(true)
  }

  return (
    <figure data-reveal className="m-0">
      <div className="rounded-panel border border-paper/16 bg-[#1b2c25] p-2 shadow-stage sm:p-2.5">
        <div ref={box} className="group relative overflow-hidden rounded-[2px] bg-ink-950">
          <div className="relative aspect-video transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <img
              src={`${clip}-poster.webp`}
              alt=""
              width={1280}
              height={720}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
            {armed && (
              <video
                ref={video}
                muted
                loop
                playsInline
                preload="none"
                poster={`${clip}-poster.webp`}
                aria-hidden="true"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                className="absolute inset-0 size-full object-cover"
              >
                <source src={`${clip}.webm`} type="video/webm" />
                <source src={`${clip}.mp4`} type="video/mp4" />
              </video>
            )}
          </div>

          <a href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0" />

          {hydrated && (
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? s.pause : s.play}
              className="absolute top-3 right-3 grid size-11 cursor-pointer place-items-center rounded-[3px] border border-paper/24 bg-ink-950/80 text-paper backdrop-blur-sm transition-colors hover:border-ember-300 hover:bg-ink-950 sm:top-4 sm:right-4"
            >
              {playing ? (
                <Pause size={16} aria-hidden="true" fill="currentColor" />
              ) : (
                <Play size={16} aria-hidden="true" className="translate-x-px" fill="currentColor" />
              )}
            </button>
          )}

          <span aria-hidden="true" className="pointer-events-none absolute right-3.5 bottom-3.5 sm:right-4 sm:bottom-4">
            <span className="grid size-12 place-items-center rounded-[3px] bg-paper text-ink-950 shadow-glow transition-transform duration-300 group-hover:scale-105 group-hover:bg-ember-300 motion-reduce:transition-none sm:size-13">
              <ArrowRight size={20} />
            </span>
          </span>
        </div>
      </div>
      <figcaption className="mt-3 flex items-center gap-2.5 px-1 font-mono text-[0.71875rem] tracking-[0.04em] text-ink-300">
        <span aria-hidden="true" className="size-1.5 shrink-0 bg-ember-300" />
        {s.status}
      </figcaption>
    </figure>
  )
}
