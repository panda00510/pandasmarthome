import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SignageArt } from '../graphics/SignageFigures'
import { PhotoTag, SectionHeading } from '../ui'
import { pageHref, useI18n } from '../../i18n/context'

/** Architectural ESP32-S3 schematic in brass & botanical jade. Decoration only. */
function ModuleArt() {
  const pins = Array.from({ length: 9 }, (_, i) => 26 + i * 12)
  return (
    <svg viewBox="0 0 210 156" className="h-auto w-44 sm:w-52" aria-hidden="true">
      <defs>
        <radialGradient id="mod-glow">
          <stop offset="0" stopColor="var(--color-ember-400)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--color-ember-400)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="105" cy="78" r="76" fill="url(#mod-glow)" />
      <path
        d="M22 44h20M22 76h20M22 108h20M168 44h20M168 76h20M168 108h20"
        stroke="var(--color-ember-300)"
        strokeOpacity="0.34"
        strokeWidth="1.2"
      />
      {pins.map((y) => (
        <g key={y} fill="var(--color-ember-300)" opacity="0.65">
          <rect x="44" y={y} width="12" height="3.5" />
          <rect x="154" y={y} width="12" height="3.5" />
        </g>
      ))}
      <rect
        x="54"
        y="16"
        width="102"
        height="124"
        rx="3"
        fill="#101c17"
        stroke="rgb(244 239 230 / 0.24)"
      />
      <rect
        x="66"
        y="26"
        width="78"
        height="24"
        rx="2"
        fill="rgb(200 150 78 / 0.08)"
        stroke="var(--color-ember-300)"
        strokeOpacity="0.6"
        strokeDasharray="3 3"
      />
      <rect
        x="76"
        y="62"
        width="58"
        height="50"
        rx="2"
        fill="#1a2c24"
        stroke="rgb(244 239 230 / 0.18)"
      />
      <circle cx="105" cy="87" r="11" fill="var(--color-ember-400)" opacity="0.18" />
      <circle cx="105" cy="87" r="4" fill="var(--color-ember-300)" />
      <text
        x="105"
        y="128"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="600"
        fill="var(--color-ink-300)"
        fontFamily="monospace"
        letterSpacing="0.14em"
      >
        ESP32-S3
      </text>
    </svg>
  )
}

/**
 * Custom-build atelier band on warm travertine:
 * Custom AI hardware (deep botanical forest dossier) + Custom software (alabaster
 * dossier) side by side, Panda Signage full-width studio plate below, and a
 * crisp index rail to ready-made desktop devices.
 */
export function Custom() {
  const { t, lang } = useI18n()
  const c = t.custom
  const hw = t.hardware
  const sw = t.software
  const sg = t.signage

  return (
    <section id="custom" className="band border-t border-ink-950/12 bg-paper">
      <div className="shell">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} lead={c.lead} shortOnPhone split />

        <div className="reveal-group mt-10 grid gap-5 lg:mt-14 lg:grid-cols-2">
          {/* Custom AI hardware — deep botanical forest dossier */}
          <a
            href={pageHref(lang, 'custom-hardware/')}
            data-reveal
            className="card bevel-dark group relative flex flex-col overflow-hidden border-paper/14! bg-ink-950! p-6 text-paper sm:p-8 lg:p-9"
          >
            <span aria-hidden="true" className="hairline-dark pointer-events-none absolute inset-x-0 top-0" />
            <span aria-hidden="true" className="stage-grid pointer-events-none absolute inset-0 opacity-75" />
            <span className="pointer-events-none absolute top-4 right-4 hidden sm:block">
              <ModuleArt />
            </span>
            <span className="eyebrow relative text-ember-300!">{hw.eyebrow}</span>
            <span className="title-section relative mt-4 block text-paper sm:max-w-[60%]">
              {hw.homeTitle}
            </span>
            <span className="relative mt-4 block max-w-lg text-[0.9375rem] leading-relaxed text-ink-300 sm:text-base">
              {hw.homeLead}
            </span>
            <ul className="relative mt-6 flex flex-wrap gap-2">
              {hw.groups.slice(0, 4).map((g) => (
                <li
                  key={g.id}
                  className="rounded-[2px] border border-paper/16 bg-paper/[0.06] px-2.5 py-1.5 text-[0.8125rem] font-medium text-paper/90"
                >
                  {g.title}
                </li>
              ))}
            </ul>
            <span className="relative mt-auto pt-8">
              <span className="btn h-12 border border-paper bg-paper px-5 text-[0.9375rem] text-ink-950 group-hover:border-ember-300 group-hover:bg-ember-300">
                {hw.homeCta}
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform motion-safe:group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </span>
            </span>
          </a>

          {/* Custom software — alabaster architectural dossier */}
          <a
            href={pageHref(lang, 'software/')}
            data-reveal
            className="card group relative flex flex-col overflow-hidden p-6 sm:p-8 lg:p-9"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-6 right-6 grid size-9 place-items-center rounded-[2px] border border-ink-950/15 bg-paper text-ink-700 transition-colors group-hover:border-ink-950 group-hover:bg-ink-950 group-hover:text-paper"
            >
              <ArrowUpRight size={15} />
            </span>
            <span className="eyebrow">{sw.eyebrow}</span>
            <span className="title-section mt-4 block pr-12 text-ink-950">
              {sw.homeTitle}
            </span>
            <span className="mt-4 block max-w-lg text-[0.9375rem] leading-relaxed text-ink-600 sm:text-base">
              {sw.homeLead}
            </span>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {sw.packages.slice(0, 4).map((pkg, i) => (
                <li
                  key={pkg.id}
                  className="flex items-start gap-2.5 rounded-[2px] border border-ink-950/12 bg-paper px-3.5 py-3 text-sm leading-snug font-medium text-ink-900 transition-colors group-hover:border-brand/35"
                >
                  <span className="numeral mt-px text-xs font-semibold text-ember-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{pkg.title}</span>
                </li>
              ))}
            </ul>
            <span className="mt-auto pt-8">
              <span className="btn h-12 border border-ink-950 bg-ink-950 px-5 text-[0.9375rem] text-paper group-hover:border-brand group-hover:bg-brand">
                {sw.homeCta}
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform motion-safe:group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </span>
            </span>
          </a>

          {/* Panda Signage — full-width studio showcase plate */}
          <a
            href={pageHref(lang, 'signage/')}
            data-reveal
            className="card group grid items-center gap-8 p-6 sm:p-8 lg:col-span-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.88fr)] lg:gap-12 lg:p-9"
          >
            <span className="flex flex-col">
              <span className="eyebrow">{sg.eyebrow}</span>
              <span className="title-section mt-4 block text-ink-950">
                {sg.homeTitle}
              </span>
              <span className="mt-4 block max-w-xl text-[0.9375rem] leading-relaxed text-ink-600 sm:text-base">
                {sg.homeLead}
              </span>
              <ul className="mt-6 flex flex-wrap gap-2">
                {sg.groups.slice(0, 6).map((g) => (
                  <li
                    key={g.id}
                    className="rounded-[2px] border border-ink-950/12 bg-paper px-2.5 py-1.5 text-[0.8125rem] font-medium text-ink-800"
                  >
                    {g.title}
                  </li>
                ))}
              </ul>
              <span className="mt-8">
                <span className="btn h-12 border border-ink-950 bg-ink-950 px-5 text-[0.9375rem] text-paper group-hover:border-brand group-hover:bg-brand">
                  {sg.homeCta}
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform motion-safe:group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </span>
              </span>
            </span>
            <span
              aria-hidden="true"
              className="bevel-dark relative hidden overflow-hidden rounded-[3px] bg-ink-950 p-5 sm:block lg:p-6"
            >
              <span className="stage-grid pointer-events-none absolute inset-0" />
              <span className="relative block aspect-[13/10]">
                <SignageArt labels={sg.art} />
              </span>
              <PhotoTag>{t.products.illustration}</PhotoTag>
            </span>
          </a>
        </div>

        {/* Ready-made desktop devices rail */}
        <div className="mt-6 flex items-center justify-between border-y border-ink-950/14 py-2">
          <a
            href={pageHref(lang, 'products/')}
            className="link-more w-full justify-between hover:text-ink-950 sm:w-auto sm:justify-start"
          >
            {c.devicesCta}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
