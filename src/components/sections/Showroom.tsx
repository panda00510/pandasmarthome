import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { Button } from '../ui'
import { useI18n } from '../../i18n/context'
import type { Content } from '../../content/types'

const clip = `${import.meta.env.BASE_URL}media/showroom-demo`
const noop = () => () => {}

/**
 * The homepage's feature band for the 3D showroom (a separate build at
 * /showroom/). No iframe: a 12 s screen recording of the showroom's own auto
 * demo (scripts/record-showroom.mjs) keeps WebGL off the homepage until the
 * visitor asks for it.
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

        <ShowroomClip href={href} s={s} />
      </div>
    </section>
  )
}

/**
 * The clip. Nothing is downloaded until the band scrolls into view: the server
 * HTML has only the lazy poster <img>, and the <video> is mounted (sources and
 * all) the first time the card is on screen. Off screen it pauses. Reduced
 * motion or Save-Data: poster plus the play button, never autoplay. No storage.
 */
function ShowroomClip({ href, s }: { href: string; s: Content['showroom'] }) {
  const box = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const held = useRef(false) // the visitor paused, or autoplay is not wanted: stay paused
  // false in the prerendered HTML, true once hydrated: the button only works with JS
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

  // First mount of the <video>: start it (the observer only fires on changes).
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
      <div ref={box} className="group relative overflow-hidden rounded-panel bg-ink-900 shadow-stage ring-1 ring-white/10">
        <div className="relative aspect-video transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
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

        {/* The whole card opens the showroom. Duplicate of the button beside it, so out of the tab order. */}
        <a href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0" />

        {hydrated && (
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? s.pause : s.play}
            className="absolute top-3 right-3 grid size-11 place-items-center rounded-full bg-ink-950/70 text-paper ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-ink-950/90 sm:top-4 sm:right-4"
          >
            {playing ? <Pause size={18} aria-hidden="true" fill="currentColor" /> : <Play size={18} aria-hidden="true" className="translate-x-px" fill="currentColor" />}
          </button>
        )}

        <span aria-hidden="true" className="pointer-events-none absolute right-4 bottom-4 sm:right-6 sm:bottom-6">
          <span className="grid size-11 place-items-center rounded-full bg-bamboo-400 text-ink-950 shadow-glow transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none sm:size-14">
            <ArrowRight size={22} />
          </span>
        </span>
      </div>
      <figcaption className="mt-3 flex items-center gap-2 px-1 text-xs text-ink-300">
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-bamboo-400" />
        {s.status}
      </figcaption>
    </figure>
  )
}
