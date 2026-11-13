import {
  ArrowRight,
  Building2,
  ChevronDown,
  FileStack,
  HardDriveDownload,
  Info,
  Languages,
  LayoutTemplate,
  MessageCircle,
  Monitor,
  Megaphone,
  Server,
  DoorOpen,
  WifiOff,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SignageArt } from '../graphics/SignageFigures'
import { Button, PhotoTag, SectionHeading } from '../ui'
import { site } from '../../config/site'
import { pageHref, useI18n } from '../../i18n/context'

/**
 * Panda Signage: information screens and meeting room door panels. Same
 * shape as the custom-hardware page; no prices, no client list.
 */

const WHATSAPP = site.whatsappLink ?? 'https://wa.me/6580676515'

const ICONS: Record<string, LucideIcon> = {
  sites: Building2,
  media: FileStack,
  layout: LayoutTemplate,
  rooms: DoorOpen,
  frontdesk: Megaphone,
  offline: WifiOff,
  updates: HardDriveDownload,
  language: Languages,
  screens: Monitor,
  hosting: Server,
}

const RELATED: Record<string, string> = {
  hardware: 'custom-hardware/',
  software: 'software/',
  home: 'solutions/',
}

const numeral = (i: number) => String(i + 1).padStart(2, '0')

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="mt-auto flex flex-wrap gap-2 pt-5">
      {items.map((item) => (
        <li key={item} className="rounded-full bg-ink-50 px-3 py-1.5 text-[0.8125rem] font-medium text-ink-700 ring-1 ring-ink-200">
          {item}
        </li>
      ))}
    </ul>
  )
}

export function SignagePage() {
  const { t, lang } = useI18n()
  const s = t.signage
  const enquireHref = `${WHATSAPP}?text=${encodeURIComponent(s.enquireAll)}`

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink-950 text-paper">
        <div aria-hidden="true" className="stage-grid pointer-events-none absolute inset-0 -z-10" />
        <div aria-hidden="true" className="stage-glow pointer-events-none absolute -inset-[10%] -z-10" />
        <div className="shell pt-10 pb-14 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
            <div>
              <p className="eyebrow text-bamboo-300!">
                <span aria-hidden="true" className="h-px w-6 bg-bamboo-300/60" />
                {s.eyebrow}
              </p>
              <h1 className="mt-5 max-w-4xl text-[2.25rem] leading-[1.04] font-semibold tracking-[-0.04em] sm:text-[3.5rem] lg:text-[3.5rem] lg:leading-[1.03]">
                {s.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg lg:text-xl lg:leading-relaxed">
                {s.lead}
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
                  {s.enquire}
                </Button>
                <Button as="a" href="#capabilities" variant="outlineDark" size="lg" className="w-full sm:w-auto">
                  {s.groupsTitle}
                </Button>
              </div>
            </div>
            <div aria-hidden="true" className="relative mx-auto hidden aspect-[13/10] w-full max-w-xl sm:block">
              <span className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgb(63_174_126/0.3),transparent)] blur-2xl" />
              <div className="relative h-full w-full">
                <SignageArt labels={s.art} />
              </div>
              <PhotoTag className="top-0! right-0! bottom-auto! left-auto!">{t.products.illustration}</PhotoTag>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 lg:mt-16">
            <h2 className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">{s.whoTitle}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {s.audiences.map((name) => (
                <li key={name} className="rounded-full bg-white/8 px-3 py-1.5 text-[0.8125rem] font-medium text-ink-200 ring-1 ring-white/10">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="capabilities" className="band scroll-mt-20">
        <div className="shell">
          <SectionHeading eyebrow={s.sectionEyebrows.capabilities} title={s.groupsTitle} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
            {s.groups.map((group) => {
              const Icon = ICONS[group.id] ?? Monitor
              return (
                <li key={group.id} className="card flex flex-col p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-bamboo-50 text-bamboo-700 ring-1 ring-bamboo-100">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-[1.0625rem] leading-snug font-semibold tracking-[-0.015em] text-ink-950">
                    {group.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{group.body}</p>
                  <Chips items={group.items} />
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="band border-t border-ink-200/70 bg-paper-alt">
        <div className="shell">
          <SectionHeading eyebrow={s.sectionEyebrows.setup} title={s.setupTitle} />
          <ul className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-2 lg:gap-6">
            {s.setup.map((card) => {
              const Icon = ICONS[card.id] ?? Server
              return (
                <li key={card.id} className="card flex flex-col p-6 lg:p-8">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-bamboo-50 text-bamboo-700 ring-1 ring-bamboo-100">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-[1.25rem] leading-snug font-semibold tracking-[-0.02em] text-ink-950">{card.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{card.body}</p>
                  <Chips items={card.items} />
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="band border-t border-ink-200/70">
        <div className="shell">
          <SectionHeading eyebrow={s.sectionEyebrows.process} title={s.processTitle} />
          <ol className="mt-10 grid gap-x-6 gap-y-6 lg:mt-14 lg:grid-cols-5">
            {s.steps.map((step, i) => (
              <li key={step.title} className="border-t border-ink-200 pt-5">
                <span className="numeral text-sm font-semibold text-bamboo-700">{numeral(i)}</span>
                <h3 className="mt-2 text-[1.0625rem] leading-snug font-semibold text-ink-950">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-ink-200/70 bg-paper-alt">
        <div className="shell py-12 lg:py-20">
          <h2 className="text-[1.75rem] leading-[1.15] font-semibold tracking-[-0.025em] text-ink-950 sm:text-4xl">
            {s.priceTitle}
          </h2>
          <ul className="mt-8 grid gap-4 lg:grid-cols-3">
            {s.prices.map((item) => (
              <li key={item.title} className="card flex flex-col p-6">
                <h3 className="text-[1.125rem] leading-snug font-semibold tracking-[-0.015em] text-ink-950">{item.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{item.body}</p>
                <p className="mt-auto pt-5">
                  <span className="block text-xs font-semibold tracking-wide text-ink-500 uppercase">{s.priceLabel}</span>
                  <span className="numeral mt-1 block text-[1.375rem] font-semibold tracking-[-0.02em] text-ink-950">
                    {s.priceFrom.replaceAll('{amount}', `S$${item.priceSgd.toLocaleString('en-SG')}`)}
                  </span>
                </p>
              </li>
            ))}
          </ul>
          <div className="card mt-4 flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-ink-600">
                <Info size={16} className="mt-1 shrink-0 text-ink-500" aria-hidden="true" />
                {s.priceBody}
              </p>
            </div>
            <Button
              as="a"
              href={enquireHref}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              className="w-full shrink-0 sm:w-auto"
            >
              <MessageCircle size={18} aria-hidden="true" />
              {s.enquire}
            </Button>
          </div>

          <h2 className="mt-14 text-[1.5rem] leading-snug font-semibold tracking-[-0.025em] text-ink-950 lg:mt-16">
            {s.relatedTitle}
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {s.related.map((card) => (
              <li key={card.id} className="flex">
                <a href={pageHref(lang, RELATED[card.id] ?? '')} className="card group flex w-full flex-col p-6">
                  <span className="text-[1.125rem] leading-snug font-semibold tracking-[-0.015em] text-ink-950">{card.title}</span>
                  <span className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{card.body}</span>
                  <span className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-sm font-semibold text-bamboo-700 group-hover:text-bamboo-600">
                    {card.cta}
                    <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-ink-200/70">
        <div className="shell py-8 lg:py-10">
          <ul className="max-w-3xl space-y-2 text-sm leading-relaxed text-ink-600">
            {s.finePrint.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band border-t border-ink-200/70">
        <div className="shell grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
          <h2 className="text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] text-ink-950 sm:text-[2.75rem]">
            {s.faqTitle}
          </h2>
          <div className="divide-y divide-ink-200 border-y border-ink-200">
            {s.faq.map((item) => (
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
