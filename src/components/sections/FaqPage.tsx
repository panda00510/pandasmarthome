import { ArrowRight } from 'lucide-react'
import { faqGroups } from '../../content/faqGroups'
import { pageHref, useI18n } from '../../i18n/context'

/**
 * /faq/: every question already answered on the site, grouped by business
 * line (content/faqGroups.ts), answers open so they can be read and found
 * without a click. The FAQPage JSON-LD comes from <Seo>.
 */
export function FaqPage() {
  const { t, lang } = useI18n()
  const p = t.faq.page
  const groups = faqGroups(t)

  return (
    <article className="shell pt-10 pb-16 lg:pt-14 lg:pb-24">
      <p className="eyebrow">
        <span aria-hidden="true" className="h-px w-6 bg-bamboo-500/50" />
        {t.faq.eyebrow}
      </p>
      <h1 className="mt-5 max-w-4xl text-[2.25rem] leading-[1.06] font-semibold tracking-[-0.035em] text-balance text-ink-950 sm:text-[3rem]">
        {p.title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">{p.lead}</p>

      <nav aria-label={p.jumpTo} className="mt-8">
        <ul className="flex flex-wrap gap-2">
          {groups.map((group) => (
            <li key={group.id}>
              <a
                href={`#${group.id}`}
                className="inline-flex min-h-11 items-center rounded-full border border-ink-300 px-4 text-sm font-medium text-ink-700 hover:border-ink-500 hover:bg-white"
              >
                {group.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10 max-w-3xl space-y-14">
        {groups.map((group) => (
          <section key={group.id} aria-labelledby={group.id}>
            <h2
              id={group.id}
              className="scroll-mt-24 border-b border-ink-200 pb-3 text-[1.5rem] font-semibold tracking-[-0.02em] text-ink-950"
            >
              {group.title}
            </h2>
            <div className="divide-y divide-ink-200/70">
              {group.items.map((item) => (
                <div key={item.q} className="py-6">
                  <h3 className="text-lg font-semibold text-ink-950">{item.q}</h3>
                  <p className="mt-2 text-[1.0625rem] leading-[1.65] text-ink-700">{item.a}</p>
                </div>
              ))}
            </div>
            <a
              href={pageHref(lang, group.path)}
              className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-bamboo-700 hover:text-bamboo-600"
            >
              {p.groupLink.replace('{page}', group.title)}
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </section>
        ))}
      </div>
    </article>
  )
}
