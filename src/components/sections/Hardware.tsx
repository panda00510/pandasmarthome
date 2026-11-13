import {
  ArrowRight,
  ChevronDown,
  CloudSun,
  Info,
  ListOrdered,
  MessageCircle,
  Mic,
  MonitorSmartphone,
  Network,
  Radar,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ProductArt } from '../graphics/ProductFigures'
import { Button, PhotoTag, SectionHeading } from '../ui'
import { site } from '../../config/site'
import { pageHref, useI18n } from '../../i18n/context'

/**
 * Custom ESP32 AI / IoT hardware. Prototypes and one-off builds; no client
 * list, no lead times, no prices. The only action is a WhatsApp message.
 */

const WHATSAPP = site.whatsappLink ?? 'https://wa.me/6580676515'

const ICONS: Record<string, LucideIcon> = {
  voice: Mic,
  screen: MonitorSmartphone,
  sensor: Radar,
  integration: Network,
  local: CloudSun,
  shop: ListOrdered,
}

const numeral = (i: number) => String(i + 1).padStart(2, '0')

/** Three device drawings from the products page, layered on light tiles. */
function HeroDevices({ tag }: { tag: string }) {
  const { lang } = useI18n()
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-[5/4] w-full max-w-lg">
      <span className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgb(63_174_126/0.3),transparent)] blur-2xl" />
      <div className="absolute top-0 right-0 w-[70%] rotate-[1.5deg] rounded-panel bg-paper p-3 shadow-stage">
        <div className="aspect-[7/5]">
          <ProductArt id="panel" lang={lang} />
        </div>
      </div>
      <div className="absolute bottom-[8%] left-0 w-[44%] -rotate-2 rounded-panel bg-paper p-3 shadow-stage">
        <div className="aspect-[4/3]">
          <ProductArt id="voice" lang={lang} />
        </div>
      </div>
      <div className="absolute right-[2%] bottom-0 w-[50%] rounded-card bg-paper p-2 shadow-stage">
        <div className="aspect-[2/1]">
          <ProductArt id="pixel" lang={lang} />
        </div>
      </div>
      <PhotoTag className="top-0! right-0! bottom-auto! left-auto!">{tag}</PhotoTag>
    </div>
  )
}

export function HardwarePage() {
  const { t, lang } = useI18n()
  const h = t.hardware
  const enquireHref = `${WHATSAPP}?text=${encodeURIComponent(h.enquireAll)}`

  return (
    <>
      {/* Hero on ink, matching the homepage. */}
      <section className="relative isolate overflow-hidden bg-ink-950 text-paper">
        <div aria-hidden="true" className="stage-grid pointer-events-none absolute inset-0 -z-10" />
        <div aria-hidden="true" className="stage-glow pointer-events-none absolute -inset-[10%] -z-10" />
        <div className="shell pt-10 pb-14 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
          <div>
          <p className="eyebrow text-bamboo-300!">
            <span aria-hidden="true" className="h-px w-6 bg-bamboo-300/60" />
            {h.eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl text-[2.25rem] leading-[1.04] font-semibold tracking-[-0.04em] sm:text-[3.5rem] lg:text-[3.75rem] lg:leading-[1.02]">
            {h.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg lg:text-xl lg:leading-relaxed">
            {h.lead}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-10">
            <Button
              as="a"
              href={enquireHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="glow"
              size="lg"
              className="w-full sm:w-auto"
            >
              <MessageCircle size={18} aria-hidden="true" />
              {h.enquire}
            </Button>
            <Button as="a" href="#capabilities" variant="outlineDark" size="lg" className="w-full sm:w-auto">
              {h.groupsTitle}
            </Button>
          </div>
          </div>
          <div className="hidden sm:block">
            <HeroDevices tag={t.products.illustration} />
          </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 lg:mt-16">
            <h2 className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">{h.whoTitle}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {h.audiences.map((name) => (
                <li key={name} className="rounded-full bg-white/8 px-3 py-1.5 text-[0.8125rem] font-medium text-ink-200 ring-1 ring-white/10">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What we can build */}
      <section id="capabilities" className="band scroll-mt-20">
        <div className="shell">
          <SectionHeading eyebrow={h.sectionEyebrows.capabilities} title={h.groupsTitle} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {h.groups.map((group) => {
              const Icon = ICONS[group.id] ?? Network
              return (
                <li key={group.id} className="card flex flex-col p-6 lg:p-7">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-bamboo-50 text-bamboo-700 ring-1 ring-bamboo-100">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-[1.125rem] leading-snug font-semibold tracking-[-0.015em] text-ink-950">
                    {group.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{group.body}</p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full bg-ink-50 px-3 py-1.5 text-[0.8125rem] font-medium text-ink-700 ring-1 ring-ink-200"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Levels of custom */}
      <section className="band border-t border-ink-200/70 bg-paper-alt">
        <div className="shell">
          <SectionHeading eyebrow={h.sectionEyebrows.levels} title={h.tiersTitle} />
          <ol className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-3">
            {h.tiers.map((tier, i) => (
              <li key={tier.title} className="card p-6 lg:p-8">
                <span className="numeral text-sm font-semibold text-bamboo-700">{numeral(i)}</span>
                <h3 className="mt-3 text-[1.125rem] leading-snug font-semibold tracking-[-0.015em] text-ink-950">
                  {tier.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{tier.body}</p>
                <p className="mt-5 border-t border-ink-200/70 pt-4">
                  <span className="block text-xs font-semibold tracking-wide text-ink-500 uppercase">{h.tierPriceLabel}</span>
                  <span className="numeral mt-1 block text-[1.375rem] font-semibold tracking-[-0.02em] text-ink-950">
                    {h.tierPriceFrom.replaceAll('{amount}', `S$${tier.priceSgd.toLocaleString('en-SG')}`)}
                  </span>
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-6 flex max-w-3xl items-start gap-2.5 text-sm leading-relaxed text-ink-600">
            <Info size={16} className="mt-0.5 shrink-0 text-ink-500" aria-hidden="true" />
            {h.tiersNote}
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="band border-t border-ink-200/70">
        <div className="shell">
          <SectionHeading eyebrow={h.sectionEyebrows.process} title={h.processTitle} />
          <ol className="mt-10 grid gap-x-6 gap-y-6 lg:mt-14 lg:grid-cols-5">
            {h.steps.map((step, i) => (
              <li key={step.title} className="border-t border-ink-200 pt-5">
                <span className="numeral text-sm font-semibold text-bamboo-700">{numeral(i)}</span>
                <h3 className="mt-2 text-[1.0625rem] leading-snug font-semibold text-ink-950">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing, and the cross-link to custom software */}
      <section className="border-t border-ink-200/70">
        <div className="shell grid gap-4 py-12 lg:grid-cols-2 lg:gap-6 lg:py-20">
          <div className="card flex flex-col p-6 sm:p-8">
            <h2 className="text-[1.5rem] leading-snug font-semibold tracking-[-0.025em] text-ink-950">{h.priceTitle}</h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-600">{h.priceBody}</p>
            <div className="mt-auto pt-6">
              <Button
                as="a"
                href={enquireHref}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                className="w-full sm:w-auto"
              >
                <MessageCircle size={18} aria-hidden="true" />
                {h.enquire}
              </Button>
            </div>
          </div>
          <a
            href={pageHref(lang, 'software/')}
            className="card group flex flex-col border-white/10 bg-ink-950 p-6 text-paper sm:p-8"
          >
            <span className="text-[1.5rem] leading-snug font-semibold tracking-[-0.025em]">{h.pairTitle}</span>
            <span className="mt-3 text-[0.9375rem] leading-relaxed text-ink-300">{h.pairBody}</span>
            <span className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-6 text-sm font-semibold text-bamboo-300 group-hover:text-bamboo-200">
              {t.software.homeTitle}
              <ArrowRight size={15} aria-hidden="true" />
            </span>
          </a>
        </div>
      </section>

      <section className="border-t border-ink-200/70">
        <div className="shell py-8 lg:py-10">
          <ul className="max-w-3xl space-y-2 text-sm leading-relaxed text-ink-600">
            {h.finePrint.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band border-t border-ink-200/70">
        <div className="shell grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
          <h2 className="text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] text-ink-950 sm:text-[2.75rem]">
            {h.faqTitle}
          </h2>
          <div className="divide-y divide-ink-200 border-y border-ink-200">
            {h.faq.map((item) => (
              <details key={item.q} className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-start justify-between gap-6 py-4 text-left [&::-webkit-details-marker]:hidden">
                  <h3 className="text-[1.0625rem] leading-snug font-medium text-ink-900 transition-colors group-hover:text-bamboo-700">
                    {item.q}
                  </h3>
                  <ChevronDown
                    size={19}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-ink-400 transition-transform duration-300 group-open:rotate-180"
                  />
                </summary>
                <p className="pr-10 pb-5 text-[0.9375rem] leading-relaxed text-ink-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
