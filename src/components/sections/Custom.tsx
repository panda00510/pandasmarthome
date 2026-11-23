import { ArrowRight, ArrowUpRight, CodeXml, Cpu, Monitor } from 'lucide-react'
import { SectionHeading } from '../ui'
import { pageHref, useI18n } from '../../i18n/context'

/**
 * Compact 3-column architectural folio for Panda's other lines of work
 * (Custom AI hardware, Custom software, Panda Signage), closed by a slim
 * link bar to ready-made desktop devices and upcoming products.
 */
export function Custom() {
  const { t, lang } = useI18n()
  const c = t.custom
  const hw = t.hardware
  const sw = t.software
  const sg = t.signage

  const cards = [
    {
      id: 'hardware',
      href: pageHref(lang, 'custom-hardware/'),
      Icon: Cpu,
      eyebrow: hw.eyebrow,
      title: hw.homeTitle,
      lead: hw.homeLead,
      tags: hw.groups.slice(0, 3).map((g) => g.title),
      cta: hw.homeCta,
    },
    {
      id: 'software',
      href: pageHref(lang, 'software/'),
      Icon: CodeXml,
      eyebrow: sw.eyebrow,
      title: sw.homeTitle,
      lead: sw.homeLead,
      tags: sw.packages.slice(0, 3).map((p) => p.title),
      cta: sw.homeCta,
    },
    {
      id: 'signage',
      href: pageHref(lang, 'signage/'),
      Icon: Monitor,
      eyebrow: sg.eyebrow,
      title: sg.homeTitle,
      lead: sg.homeLead,
      tags: sg.groups.slice(0, 3).map((g) => g.title),
      cta: sg.homeCta,
    },
  ]

  return (
    <section id="custom" className="band border-t border-ink-950/12 bg-paper">
      <div className="shell">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} lead={c.lead} shortOnPhone split />

        <ul className="reveal-group mt-9 grid gap-4 lg:mt-12 lg:grid-cols-3 lg:gap-5">
          {cards.map(({ id, href, Icon, eyebrow, title, lead, tags, cta }, i) => (
            <li key={id} data-reveal className="flex">
              <a
                href={href}
                className="card group flex w-full flex-col p-6 transition-colors hover:border-brand/50"
              >
                <span className="flex items-center justify-between border-b border-ink-950/10 pb-4">
                  <span className="inline-flex items-center gap-2.5">
                    <span className="icon-tile h-9! w-9!">
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    <span className="numeral text-xs font-semibold text-ember-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={15}
                    aria-hidden="true"
                    className="text-ink-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink-950"
                  />
                </span>

                <span className="eyebrow mt-5">{eyebrow}</span>
                <span className="title-group mt-2.5 block text-ink-950 transition-colors group-hover:text-brand">
                  {title}
                </span>
                <span className="mt-2.5 block text-sm leading-relaxed text-ink-600">
                  {lead}
                </span>

                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-[2px] border border-ink-950/12 bg-paper px-2.5 py-1 text-xs font-medium text-ink-700"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <span className="link-more mt-auto min-h-0 pt-6 text-sm">
                  {cta}
                  <ArrowRight size={14} aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Ready-made desktop devices + upcoming status rail */}
        <div className="mt-6 flex flex-col gap-2 border-y border-ink-950/14 py-2 sm:flex-row sm:items-center sm:justify-between">
          <a href={pageHref(lang, 'products/')} className="link-more hover:text-ink-950">
            {c.devicesCta}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
          <a
            href={pageHref(lang, 'solutions/upcoming-products/')}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-600 transition-colors hover:text-ink-950"
          >
            <span className="rounded-[2px] border border-ember-500/35 bg-surface px-2 py-0.5 font-mono text-[0.65rem] font-semibold tracking-[0.08em] text-ember-600 uppercase">
              {t.upcoming.eyebrow}
            </span>
            <span className="underline decoration-ink-300 underline-offset-3">{t.upcoming.title}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
