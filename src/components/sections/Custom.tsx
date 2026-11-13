import { ArrowRight } from 'lucide-react'
import { SignageArt } from '../graphics/SignageFigures'
import { PhotoTag, SectionHeading } from '../ui'
import { pageHref, useI18n } from '../../i18n/context'

/** A plain ESP32-style module drawing for the hardware card. Decoration only. */
function ModuleArt() {
  const pins = Array.from({ length: 9 }, (_, i) => 26 + i * 12)
  return (
    <svg viewBox="0 0 200 150" className="h-auto w-40 sm:w-48" aria-hidden="true">
      <defs>
        <radialGradient id="mod-glow">
          <stop offset="0" stopColor="var(--color-bamboo-400)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--color-bamboo-400)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="75" r="75" fill="url(#mod-glow)" />
      {pins.map((y) => (
        <g key={y} fill="var(--color-ink-400)">
          <rect x="40" y={y} width="12" height="4" rx="1" />
          <rect x="148" y={y} width="12" height="4" rx="1" />
        </g>
      ))}
      <rect x="50" y="16" width="100" height="118" rx="8" fill="var(--color-ink-900)" stroke="rgb(255 255 255 / 0.2)" />
      <rect x="62" y="26" width="76" height="22" rx="3" fill="none" stroke="var(--color-bamboo-300)" strokeOpacity="0.6" strokeDasharray="3 3" />
      <rect x="72" y="62" width="56" height="48" rx="4" fill="var(--color-ink-800)" stroke="rgb(255 255 255 / 0.15)" />
      <circle cx="100" cy="86" r="5" fill="var(--color-bamboo-400)" />
      <text x="100" y="125" textAnchor="middle" fontSize="9" fill="var(--color-ink-300)" fontFamily="inherit" letterSpacing="0.08em">
        ESP32-S3
      </text>
    </svg>
  )
}

/**
 * Homepage band for the custom-build lines: AI hardware (dark card) and
 * software for small businesses (light card) side by side, Panda Signage as a
 * full-width card under them, and a quiet link to the ready-made devices.
 */
export function Custom() {
  const { t, lang } = useI18n()
  const c = t.custom
  const hw = t.hardware
  const sw = t.software
  const sg = t.signage

  return (
    <section id="custom" className="band border-t border-ink-200/70 bg-paper-alt">
      <div className="shell">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} lead={c.lead} shortOnPhone split />

        <div className="reveal-group mt-8 grid gap-4 lg:mt-10 lg:grid-cols-2 lg:gap-6">
          <a
            href={pageHref(lang, 'custom-hardware/')}
            data-reveal
            className="card group relative flex flex-col overflow-hidden border-white/10 bg-ink-950 p-6 text-paper sm:p-8"
          >
            <div aria-hidden="true" className="stage-grid pointer-events-none absolute inset-0" />
            <span className="absolute top-2 right-2 hidden sm:block">
              <ModuleArt />
            </span>
            <span className="eyebrow relative text-bamboo-300!">{hw.eyebrow}</span>
            <span className="relative mt-4 block text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.03em] sm:max-w-[62%] sm:text-[2.25rem]">
              {hw.homeTitle}
            </span>
            <span className="relative mt-4 block max-w-lg text-[0.9375rem] leading-relaxed text-ink-300 sm:text-base">
              {hw.homeLead}
            </span>
            <ul className="relative mt-6 flex flex-wrap gap-2">
              {hw.groups.slice(0, 4).map((g) => (
                <li key={g.id} className="rounded-full bg-white/8 px-3 py-1.5 text-[0.8125rem] font-medium text-ink-200 ring-1 ring-white/10">
                  {g.title}
                </li>
              ))}
            </ul>
            <span className="relative mt-auto pt-8">
              <span className="btn h-12 bg-bamboo-400 px-6 text-[0.9375rem] text-ink-950 shadow-glow group-hover:bg-bamboo-300">
                {hw.homeCta}
                <ArrowRight size={17} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </span>
            </span>
          </a>

          <a href={pageHref(lang, 'software/')} data-reveal className="card group flex flex-col p-6 sm:p-8">
            <span className="eyebrow">{sw.eyebrow}</span>
            <span className="mt-4 block text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.03em] text-ink-950 sm:text-[2.25rem]">
              {sw.homeTitle}
            </span>
            <span className="mt-4 block max-w-lg text-[0.9375rem] leading-relaxed text-ink-600 sm:text-base">
              {sw.homeLead}
            </span>
            <ul className="mt-6 grid gap-px overflow-hidden rounded-xl bg-ink-200/70 ring-1 ring-ink-200/70 sm:grid-cols-2">
              {sw.packages.slice(0, 4).map((pkg) => (
                <li key={pkg.id} className="bg-white px-4 py-3 text-sm leading-snug font-medium text-ink-800">
                  {pkg.title}
                </li>
              ))}
            </ul>
            <span className="mt-auto pt-8">
              <span className="btn h-12 bg-brand px-6 text-[0.9375rem] text-white group-hover:bg-bamboo-800">
                {sw.homeCta}
                <ArrowRight size={17} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </span>
            </span>
          </a>

          <a
            href={pageHref(lang, 'signage/')}
            data-reveal
            className="card group grid items-center gap-8 p-6 sm:p-8 lg:col-span-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-12"
          >
            <span className="flex flex-col">
              <span className="eyebrow">{sg.eyebrow}</span>
              <span className="mt-4 block text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.03em] text-ink-950 sm:text-[2.25rem]">
                {sg.homeTitle}
              </span>
              <span className="mt-4 block max-w-xl text-[0.9375rem] leading-relaxed text-ink-600 sm:text-base">
                {sg.homeLead}
              </span>
              <ul className="mt-6 flex flex-wrap gap-2">
                {sg.groups.slice(0, 6).map((g) => (
                  <li key={g.id} className="rounded-full bg-ink-50 px-3 py-1.5 text-[0.8125rem] font-medium text-ink-700 ring-1 ring-ink-200">
                    {g.title}
                  </li>
                ))}
              </ul>
              <span className="mt-8">
                <span className="btn h-12 bg-brand px-6 text-[0.9375rem] text-white group-hover:bg-bamboo-800">
                  {sg.homeCta}
                  <ArrowRight size={17} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </span>
              </span>
            </span>
            <span aria-hidden="true" className="relative hidden overflow-hidden rounded-2xl bg-ink-950 p-5 sm:block">
              <span className="stage-grid pointer-events-none absolute inset-0" />
              <span className="relative block aspect-[13/10]">
                <SignageArt labels={sg.art} />
              </span>
              <PhotoTag>{t.products.illustration}</PhotoTag>
            </span>
          </a>
        </div>

        <a
          href={pageHref(lang, 'products/')}
          className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-bamboo-700 hover:text-bamboo-600"
        >
          {c.devicesCta}
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
