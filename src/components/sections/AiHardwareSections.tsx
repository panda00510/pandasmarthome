import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Bot,
  Box,
  Camera,
  Check,
  ChevronDown,
  CodeXml,
  Mic,
  Monitor,
  MonitorSmartphone,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ProductArt } from '../graphics/ProductFigures'
import { responsive } from '../../content/photos'
import { findGuide } from '../../content/guides'
import { Button, PhotoTag, SectionHeading } from '../ui'
import { pageHref, useI18n } from '../../i18n/context'
import { showroomHref } from '../../lib/showroom'

function formatPrice(template: string, amount: number) {
  return template.replaceAll('{amount}', `S$${amount}`)
}

const CAPABILITY_ICONS: Record<string, LucideIcon> = {
  voice: Mic,
  agent: Zap,
  offline: AudioLines,
  vision: Camera,
  companion: Bot,
  screen: MonitorSmartphone,
}

const FEATURED_CAPABILITIES = ['voice', 'agent', 'offline', 'vision', 'companion', 'screen'] as const

const HARDWARE_GUIDE_SLUGS = [
  'esp32-ai-voice-assistant-what-it-can-do',
  'esp32-camera-vision-what-it-can-do',
  'home-assistant-touch-panel-buy-or-build',
  'custom-esp32-device-or-off-the-shelf',
] as const

const SMART_HOME_VISUAL = responsive('hero-morning')

/**
 * Band 2: Ready-to-customize Desk AI & Screen Hardware (4 enclosed ESP32 devices).
 */
export function DeskDevicesSection() {
  const { t, lang } = useI18n()
  const h = t.aiHome.devices
  const p = t.products

  return (
    <section id="devices" className="band border-t border-ink-950/12 bg-surface">
      <div className="shell">
        <SectionHeading eyebrow={h.eyebrow} title={h.title} lead={h.lead} shortOnPhone split />

        <ul className="reveal-group mt-9 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {p.items.map((item, i) => (
            <li key={item.id} data-reveal className="flex">
              <a
                href={`${pageHref(lang, 'products/')}#${item.id}`}
                className="card group flex w-full flex-col overflow-hidden bg-paper!"
              >
                <span className="art-stage relative block aspect-[4/3] w-full overflow-hidden border-b border-ink-950/12">
                  <span className="absolute inset-0 p-3 sm:p-4">
                    <ProductArt id={item.id} lang={lang} />
                  </span>
                  <PhotoTag>{p.illustration}</PhotoTag>
                </span>

                <span className="flex flex-1 flex-col p-5">
                  <span className="flex items-center justify-between">
                    <span className="numeral text-[0.6875rem] font-semibold text-ember-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                      className="text-ink-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink-950"
                    />
                  </span>

                  <span className="title-card mt-2.5 block text-ink-950 transition-colors group-hover:text-brand lg:min-h-[3rem]">
                    {item.title}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-ink-600 lg:min-h-[4.25rem]">
                    {item.summary}
                  </span>

                  <span className="mt-auto flex items-baseline justify-between border-t border-ink-950/10 pt-4">
                    <span className="font-mono text-sm font-semibold text-brand tabular-nums">
                      {formatPrice(p.priceFrom, item.priceSgd)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-700 group-hover:text-brand">
                      {t.guides.learnMore}
                      <ArrowRight size={13} aria-hidden="true" />
                    </span>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-col gap-3 border-y border-ink-950/12 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <a href={pageHref(lang, 'products/')} className="link-more hover:text-ink-950">
              {h.viewAll}
              <ArrowRight size={15} aria-hidden="true" />
            </a>
            <a href={pageHref(lang, 'compare/')} className="link-more text-ink-700! hover:text-ink-950!">
              {h.compareCta}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
          <a
            href={pageHref(lang, 'solutions/upcoming-products/')}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-600 transition-colors hover:text-ink-950"
          >
            <span className="rounded-[2px] border border-ember-500/35 bg-paper px-2 py-0.5 font-mono text-[0.65rem] font-semibold tracking-[0.08em] text-ember-600 uppercase">
              {t.upcoming.eyebrow}
            </span>
            <span className="underline decoration-ink-300 underline-offset-3">{t.upcoming.title}</span>
          </a>
        </div>
      </div>
    </section>
  )
}

/**
 * Band 3: Custom ESP32 AI Hardware — deep botanical forest engineering band.
 */
export function CustomHardwareSection() {
  const { t, lang } = useI18n()
  const c = t.aiHome.customBand
  const hw = t.hardware
  const featured = FEATURED_CAPABILITIES.map((id) => hw.groups.find((g) => g.id === id)!).filter(Boolean)

  return (
    <section id="custom-hardware" className="band relative isolate overflow-hidden bg-ink-950 text-paper">
      <div aria-hidden="true" className="hairline-dark pointer-events-none absolute inset-x-0 top-0" />
      <div aria-hidden="true" className="stage-grid pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden="true" className="stage-glow pointer-events-none absolute -inset-[10%] -z-10" />

      <div className="shell">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} lead={c.lead} tone="dark" shortOnPhone split />

        {/* 6 flagship AI hardware capabilities */}
        <ul className="reveal-group mt-10 grid overflow-hidden rounded-card border border-paper/14 bg-paper/[0.03] sm:grid-cols-2 sm:auto-rows-fr lg:mt-12 lg:grid-cols-3">
          {featured.map((group, i) => {
            const Icon = CAPABILITY_ICONS[group.id] ?? Mic
            return (
              <li
                key={group.id}
                data-reveal
                className="flex flex-col border-b border-paper/12 p-5 last:border-b-0 sm:p-6 sm:odd:border-r sm:nth-last-2:border-b-0 lg:border-r lg:nth-[3n]:border-r-0 lg:nth-last-[-n+3]:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-[2px] border border-ember-300/35 bg-ember-300/12 text-ember-300">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span className="numeral text-xs font-semibold text-ember-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="title-card mt-4 text-paper lg:min-h-[3rem]">{group.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">{group.body}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-[2px] border border-paper/14 bg-paper/[0.05] px-2 py-0.5 font-mono text-[0.6875rem] text-paper/85"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>

        {/* Three transparent custom levels + CTA */}
        <div className="mt-8 rounded-card border border-paper/16 bg-[#192922] p-5 sm:p-7">
          <div className="flex flex-col gap-4 border-b border-paper/12 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <p className="font-mono text-xs font-semibold tracking-[0.14em] text-ember-300 uppercase">
              {c.tiersLabel}
            </p>
            <Button as="a" href={pageHref(lang, 'custom-hardware/')} variant="glow" size="md" className="w-full sm:w-auto">
              {c.cta}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
          <ol className="mt-5 grid gap-5 lg:grid-cols-3 lg:divide-x lg:divide-paper/12">
            {hw.tiers.map((tier, i) => (
              <li key={tier.title} className={i > 0 ? 'lg:pl-6' : ''}>
                <span className="numeral text-xs font-semibold text-ember-300">
                  {formatPrice(hw.tierPriceFrom, tier.priceSgd)}
                </span>
                <h3 className="mt-1.5 font-display text-[1.0625rem] font-medium text-paper">
                  {tier.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{tier.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/**
 * Band 4: Systems built on our open hardware — Panda Smart Home as one flagship
 * product alongside Panda Signage and Companion Software.
 */
export function SystemsSection() {
  const { t, lang } = useI18n()
  const s = t.aiHome.systems
  const sg = t.signage
  const sw = t.software

  return (
    <section id="systems" className="band border-t border-ink-950/12 bg-paper-alt">
      <div className="shell">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} lead={s.lead} shortOnPhone split />

        {/* 01 · Featured Flagship System Product: Panda Smart Home */}
        <article
          data-reveal
          className="card mt-10 grid overflow-hidden lg:mt-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-ink-950/12 bg-ink-950 lg:aspect-auto lg:min-h-[24rem] lg:border-r lg:border-b-0">
            <img
              src={SMART_HOME_VISUAL.src}
              srcSet={SMART_HOME_VISUAL.srcSet}
              sizes="(min-width: 1200px) 620px, (min-width: 1024px) 50vw, 100vw"
              alt={t.hero.imageAlt}
              width={1376}
              height={768}
              loading="lazy"
              decoding="async"
              className="block size-full object-cover"
            />
            <PhotoTag className="top-3! bottom-auto! left-3!">{t.footer.imageTag}</PhotoTag>
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-9">
            <div>
              <p className="eyebrow">{s.smartHomeBadge}</p>
              <h3 className="title-section mt-3 text-ink-950">{s.smartHomeTitle}</h3>
              <p className="mt-3 text-[0.96rem] leading-relaxed text-ink-700">{s.smartHomeLead}</p>

              <ul className="mt-5 grid gap-2 border-t border-ink-950/10 pt-5 sm:grid-cols-2">
                {s.smartHomeHighlights.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm leading-snug text-ink-800">
                    <Check size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
              <Button as="a" href={pageHref(lang, 'smart-home/')} variant="primary" size="md" className="w-full sm:w-auto">
                {s.smartHomeCta}
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
              <Button as="a" href={showroomHref(lang)} variant="secondary" size="md" className="w-full sm:w-auto">
                <Box size={15} aria-hidden="true" className="text-ember-500" />
                {s.showroomCta}
              </Button>
            </div>
          </div>
        </article>

        {/* 02 · Panda Signage & 03 · Companion Software */}
        <ul className="reveal-group mt-5 grid gap-5 lg:grid-cols-2">
          <li data-reveal className="flex">
            <a href={pageHref(lang, 'signage/')} className="card group flex w-full flex-col p-6 sm:p-7">
              <span className="flex items-center justify-between border-b border-ink-950/10 pb-4">
                <span className="inline-flex items-center gap-2.5">
                  <span className="icon-tile h-9! w-9!">
                    <Monitor size={16} aria-hidden="true" />
                  </span>
                  <span className="eyebrow">{s.signageBadge}</span>
                </span>
                <ArrowUpRight
                  size={15}
                  aria-hidden="true"
                  className="text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink-950"
                />
              </span>
              <span className="title-group mt-5 block text-ink-950 transition-colors group-hover:text-brand">
                {sg.homeTitle}
              </span>
              <span className="mt-2.5 block text-sm leading-relaxed text-ink-600">
                {sg.homeLead}
              </span>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {sg.groups.slice(0, 4).map((g) => (
                  <li key={g.id} className="rounded-[2px] border border-ink-950/12 bg-paper px-2.5 py-1 text-xs font-medium text-ink-700">
                    {g.title}
                  </li>
                ))}
              </ul>
              <span className="link-more mt-auto min-h-0 pt-6 text-sm">
                {sg.homeCta}
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </a>
          </li>

          <li data-reveal className="flex">
            <a href={pageHref(lang, 'software/')} className="card group flex w-full flex-col p-6 sm:p-7">
              <span className="flex items-center justify-between border-b border-ink-950/10 pb-4">
                <span className="inline-flex items-center gap-2.5">
                  <span className="icon-tile h-9! w-9!">
                    <CodeXml size={16} aria-hidden="true" />
                  </span>
                  <span className="eyebrow">{s.softwareBadge}</span>
                </span>
                <ArrowUpRight
                  size={15}
                  aria-hidden="true"
                  className="text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink-950"
                />
              </span>
              <span className="title-group mt-5 block text-ink-950 transition-colors group-hover:text-brand">
                {sw.homeTitle}
              </span>
              <span className="mt-2.5 block text-sm leading-relaxed text-ink-600">
                {sw.homeLead}
              </span>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {sw.packages.slice(0, 4).map((pkg) => (
                  <li key={pkg.id} className="rounded-[2px] border border-ink-950/12 bg-paper px-2.5 py-1 text-xs font-medium text-ink-700">
                    {pkg.title}
                  </li>
                ))}
              </ul>
              <span className="link-more mt-auto min-h-0 pt-6 text-sm">
                {sw.homeCta}
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}

/**
 * Band 5: Five-step hardware build & handover progression ledger.
 */
export function HardwareProcessSection() {
  const { t, lang } = useI18n()
  const p = t.aiHome.process
  const steps = t.hardware.steps

  return (
    <section id="process" className="band border-t border-ink-950/12 bg-surface">
      <div className="shell">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} lead={p.lead} shortOnPhone split />

        <ol className="reveal-group mt-9 grid overflow-hidden rounded-card border border-ink-950/15 bg-paper divide-y divide-ink-950/12 lg:mt-12 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
          {steps.map((step, i) => (
            <li key={step.title} data-reveal className="flex gap-4 p-5 lg:flex-col lg:gap-0 lg:p-6">
              <div className="flex shrink-0 items-center lg:justify-between lg:border-b lg:border-ink-950/10 lg:pb-3.5">
                <span className="font-display text-2xl leading-none font-normal text-ember-500 tabular-nums lg:text-[1.875rem]">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="min-w-0 lg:mt-4">
                <h3 className="title-card text-ink-950 lg:min-h-[3rem]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <p className="max-w-3xl text-sm leading-relaxed text-ink-600">{t.hardware.tiersNote}</p>
          <a href={pageHref(lang, 'custom-hardware/')} className="link-more shrink-0 hover:text-ink-950">
            {p.cta}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}

/**
 * Band 6: Hardware-first FAQ accordion (matched to homepage FAQPage JSON-LD)
 * + curated hardware & local-AI guides reading list.
 */
export function AiFaqSection() {
  const { t, lang } = useI18n()
  const f = t.aiHome.faq
  const guides = HARDWARE_GUIDE_SLUGS.map((slug) => findGuide(lang, `guides/${slug}/`)).filter(
    (g): g is NonNullable<typeof g> => Boolean(g),
  )

  return (
    <section id="faq" className="band border-t border-ink-950/12 bg-paper">
      <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow={f.eyebrow} title={f.title} lead={f.lead} shortOnPhone />
          <a href={pageHref(lang, 'faq/')} className="link-more mt-4 hidden hover:text-ink-950 lg:inline-flex">
            {t.faq.all}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>

        <div>
          <div className="card divide-y divide-ink-950/12 overflow-hidden">
            {f.items.map((item) => (
              <details key={item.q} className="group transition-colors open:bg-paper/65">
                <summary className="flex min-h-15 cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 text-left [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-[1.0625rem] leading-snug font-medium text-ink-950 transition-colors group-hover:text-brand">
                    {item.q}
                  </h3>
                  <span className="grid size-8 shrink-0 place-items-center rounded-[2px] border border-ink-950/15 bg-paper text-ink-700 transition-colors group-hover:border-ink-950/35 group-open:border-ink-950 group-open:bg-ink-950 group-open:text-paper">
                    <ChevronDown
                      size={15}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-open:rotate-180"
                    />
                  </span>
                </summary>
                <p className="px-5 pr-10 pb-5 text-[0.9375rem] leading-relaxed text-ink-600 sm:pr-14">{item.a}</p>
              </details>
            ))}
          </div>

          <a href={pageHref(lang, 'faq/')} className="link-more mt-2 hover:text-ink-950 lg:hidden">
            {t.faq.all}
            <ArrowRight size={15} aria-hidden="true" />
          </a>

          {guides.length ? (
            <div id="guides" className="mt-6 scroll-mt-24 rounded-card border border-ink-950/15 bg-surface p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-mono text-[0.71875rem] font-semibold tracking-[0.16em] text-ember-500 uppercase">
                  {f.guidesTitle}
                </h3>
                <a href={pageHref(lang, 'guides/')} className="link-more min-h-0 text-xs hover:text-ink-950">
                  {t.guides.all}
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
              <ul className="mt-3.5 divide-y divide-ink-950/10 border-t border-ink-950/12">
                {guides.map((guide, i) => (
                  <li key={guide.slug}>
                    <a
                      href={pageHref(lang, guide.path)}
                      className="group flex min-h-11 items-start justify-between gap-4 py-3 text-[0.9375rem] leading-snug font-medium text-ink-900 transition-colors hover:text-brand"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="numeral text-xs font-semibold text-ember-500">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span>{guide.heading}</span>
                      </span>
                      <ArrowRight
                        size={15}
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-ink-400 transition-transform motion-safe:group-hover:translate-x-1 group-hover:text-brand motion-reduce:transition-none"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
