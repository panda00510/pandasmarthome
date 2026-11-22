import { ArrowRight } from 'lucide-react'
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
      <div className="shell page-head pb-12">
        <p className="eyebrow">
          {c.eyebrow}
        </p>
        <h1 className="mt-5 max-w-4xl title-display text-ink-950">
          {c.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lead text-ink-600">{c.lead}</p>

        <h2 className="mt-10 text-[1.375rem] font-semibold tracking-[-0.02em] text-ink-950">{c.nextTitle}</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          {c.next.map((step, i) => (
            <li key={step.title} className="card">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white tabular-nums">
                {i + 1}
              </span>
              <h3 className="mt-3 text-base font-semibold text-ink-950">{step.title}</h3>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-700">{step.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-600">{c.note}</p>

        <h2 className="mt-10 text-base font-semibold text-ink-950">{c.otherTitle}</h2>
        <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {c.other.map((item) => (
            <li key={item.path}>
              <a href={pageHref(lang, item.path)} className="group inline-flex min-h-11 items-start gap-1.5 py-1">
                <span>
                  <span className="font-semibold text-bamboo-700 group-hover:text-bamboo-600">{item.label}</span>
                  <span className="block text-sm text-ink-600">{item.body}</span>
                </span>
                <ArrowRight size={15} aria-hidden="true" className="mt-1 shrink-0 text-bamboo-700" />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <Contact />
    </>
  )
}
