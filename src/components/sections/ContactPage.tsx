import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { pageHref, useI18n } from '../../i18n/context'
import { Contact } from './Contact'

/**
 * /contact/: the enquiry form from the homepage (Contact.tsx, same delivery
 * and CSP), with a page heading, what happens after sending, and links to the
 * service pages that have their own briefs. Copy is in content `contactPage`.
 * It promises no date: timing comes with the written scope.
 */
export function ContactPage() {
  const { t, lang } = useI18n()
  const c = t.contactPage

  return (
    <>
      <Contact />
      <div className="shell py-14 lg:py-16">
        <h2 className="title-group text-ink-950">{c.nextTitle}</h2>
        <ol className="mt-5 grid overflow-hidden rounded-card border border-ink-950/15 bg-surface divide-y divide-ink-950/12 md:grid-cols-3 md:divide-x md:divide-y-0">
          {c.next.map((step, i) => (
            <li key={step.title} className="p-5 sm:p-6">
              <span className="font-display text-2xl leading-none font-normal text-ember-500 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="title-card mt-4 text-ink-950">{step.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{step.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-ink-600">{c.note}</p>

        <div className="mt-12 border-t border-ink-950/12 pt-8">
          <h2 className="font-mono text-xs font-semibold tracking-[0.14em] text-ember-500 uppercase">{c.otherTitle}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {c.other.map((item) => (
              <li key={item.path}>
                <a
                  href={pageHref(lang, item.path)}
                  className="card group flex h-full items-start justify-between gap-4 p-4 sm:p-5"
                >
                  <span className="min-w-0">
                    <span className="block font-semibold text-ink-950 transition-colors group-hover:text-brand">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink-600">{item.body}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center rounded-[2px] border border-ink-950/15 bg-paper text-ink-600 transition-colors group-hover:border-ink-950 group-hover:bg-ink-950 group-hover:text-paper"
                  >
                    <ArrowUpRight size={15} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a href={pageHref(lang, 'solutions/')} className="link-more mt-4 hover:text-ink-950">
            {t.hubs.solutions.all}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </>
  )
}
