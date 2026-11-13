import { ArrowRight, CalendarClock, ChevronDown, LayoutDashboard, MessageCircle, Package, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '../ui'
import { site } from '../../config/site'
import { pageHref, useI18n } from '../../i18n/context'

/**
 * Custom software for small businesses. Prices are indicative starting prices.
 * The only action is a WhatsApp message. No client list and no reviews.
 */

const PREORDER_WHATSAPP = site.whatsappLink ?? 'https://wa.me/6580676515'

const ICONS: Record<string, LucideIcon> = {
  booking: CalendarClock,
  inventory: Package,
  bot: MessageCircle,
  tool: LayoutDashboard,
  roster: Users,
}

function formatPrice(template: string, amount: number) {
  return template.replaceAll('{amount}', `S$${amount.toLocaleString('en-SG')}`)
}

function whatsappHref(message: string) {
  return `${PREORDER_WHATSAPP}?text=${encodeURIComponent(message)}`
}

export function SoftwarePage() {
  const { t, lang } = useI18n()
  const s = t.software

  return (
    <>
      <section className="border-b border-ink-200/70">
        <div className="shell pt-10 pb-10 lg:pt-14 lg:pb-14">
          <p className="eyebrow">
            <span aria-hidden="true" className="h-px w-6 bg-bamboo-500/50" />
            {s.eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl text-[2.25rem] leading-[1.06] font-semibold tracking-[-0.035em] text-balance text-ink-950 sm:text-[3rem] lg:text-[3.5rem]">
            {s.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">{s.lead}</p>

          <div className="mt-6">
            <Button
              as="a"
              href={whatsappHref(s.enquireAll)}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              className="w-full sm:w-auto"
            >
              <MessageCircle size={18} aria-hidden="true" />
              {s.enquire}
            </Button>
          </div>

          <h2 className="mt-10 text-sm font-semibold tracking-wide text-ink-500 uppercase">{s.whoTitle}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {s.audiences.map((name) => (
              <li
                key={name}
                className="rounded-full bg-ink-50 px-3 py-1.5 text-[0.8125rem] font-medium text-ink-800 ring-1 ring-ink-200"
              >
                {name}
              </li>
            ))}
          </ul>

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {s.points.map((point) => (
              <li key={point.title} className="card p-4">
                <p className="text-[0.9375rem] font-semibold text-ink-950">{point.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{point.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band" aria-label={s.eyebrow}>
        <div className="shell">
          <ul className="grid gap-4 lg:grid-cols-2">
            {s.packages.map((item) => {
              const Icon = ICONS[item.id] ?? LayoutDashboard
              const price = formatPrice(s.priceFrom, item.priceSgd)
              const message = s.enquireTemplate.replaceAll('{package}', item.title)
              return (
                <li key={item.id}>
                  <article id={item.id} className="card flex h-full scroll-mt-28 flex-col p-5 sm:p-6">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-bamboo-50 text-bamboo-700 ring-1 ring-bamboo-100">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <h2 className="mt-4 text-[1.2rem] leading-snug font-semibold tracking-[-0.02em] text-ink-950">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{item.body}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {item.includes.map((line) => (
                        <li
                          key={line}
                          className="rounded-full bg-ink-50 px-3 py-1.5 text-[0.8125rem] font-medium text-ink-700 ring-1 ring-ink-200"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-6">
                      <p className="text-xs font-semibold tracking-wide text-ink-500 uppercase">{s.priceLabel}</p>
                      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink-950">{price}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-600">{s.support}</p>
                      <Button
                        as="a"
                        href={whatsappHref(message)}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="lg"
                        className="mt-4 w-full sm:w-auto"
                        aria-label={`${s.enquire}: ${item.title}`}
                      >
                        <MessageCircle size={18} aria-hidden="true" />
                        {s.enquire}
                      </Button>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="border-t border-ink-200/70">
        <div className="shell py-8 lg:py-12">
          <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="max-w-2xl">
              <h2 className="text-[1.25rem] leading-snug font-semibold tracking-[-0.02em] text-ink-950 sm:text-[1.4rem]">
                {s.hardwareTitle}
              </h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{s.hardwareBody}</p>
            </div>
            <a
              href={pageHref(lang, 'products/')}
              className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold text-bamboo-700 hover:text-bamboo-600"
            >
              {s.hardwareCta}
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
          <a
            href={pageHref(lang, 'custom-hardware/')}
            className="card group mt-4 flex flex-col gap-4 border-white/10 bg-ink-950 p-5 text-paper sm:flex-row sm:items-center sm:justify-between sm:p-7"
          >
            <span className="max-w-2xl">
              <span className="block text-[1.25rem] leading-snug font-semibold tracking-[-0.02em] sm:text-[1.4rem]">
                {t.hardware.pairTitle}
              </span>
              <span className="mt-2 block text-[0.9375rem] leading-relaxed text-ink-300">{t.hardware.pairBody}</span>
            </span>
            <span className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold text-bamboo-300 group-hover:text-bamboo-200">
              {t.hardware.homeCta}
              <ArrowRight size={15} aria-hidden="true" />
            </span>
          </a>
        </div>
      </section>

      <section className="band border-t border-ink-200/70">
        <div className="shell">
          <h2 className="max-w-3xl text-[1.75rem] leading-[1.15] font-semibold tracking-[-0.025em] text-ink-950 sm:text-4xl">
            {s.processTitle}
          </h2>
          <ol className="mt-8 grid gap-x-5 gap-y-5 lg:grid-cols-5">
            {s.steps.map((step, i) => (
              <li key={step.title} className="flex gap-4 lg:block">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-[0.8125rem] font-semibold text-white tabular-nums">
                  {i + 1}
                </span>
                <div className="lg:mt-4">
                  <h3 className="text-[1.0625rem] leading-snug font-semibold text-ink-950">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
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
          <h2 className="text-[1.75rem] leading-[1.15] font-semibold tracking-[-0.025em] text-ink-950 sm:text-4xl">
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
