import { site } from '../../config/site'
import { findGuide, pageMeta } from '../../content/guides'
import type { Glossary } from '../../content/types'
import { langPath, pageHref, useI18n, type Lang } from '../../i18n/context'

/**
 * /glossary/: the terms our guides keep using, grouped, each with a stable
 * #id for deep links and 1–2 links to where it is explained in full. The
 * terms are in content/glossary.<lang>.ts; src/views.ts loads only the
 * page's language. Adds its own DefinedTermSet JSON-LD; the WebPage and
 * breadcrumb nodes come from <Seo>.
 */

/** A linked page's visible name: the guide heading, else its <title> without the brand. */
const linkLabel = (lang: Lang, path: string) =>
  findGuide(lang, path)?.heading ?? pageMeta(lang, path).title.split(/ \| |｜/)[0]

export function GlossaryPage({ glossaries }: { glossaries: Partial<Record<Lang, Glossary>> }) {
  const { t, lang } = useI18n()
  const g = t.glossary
  const { groups } = glossaries[lang]!
  const url = site.url ? site.url + langPath(lang, 'glossary/') : undefined

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': url ? `${url}#terms` : undefined,
    name: g.title,
    description: g.metaDescription,
    inLanguage: lang === 'zh' ? 'zh-Hans-SG' : 'en-SG',
    url,
    isPartOf: url ? { '@id': `${url}#webpage` } : undefined,
    hasDefinedTerm: groups.flatMap((group) =>
      group.terms.map((term) => ({
        '@type': 'DefinedTerm',
        name: term.term,
        description: term.body,
        url: url ? `${url}#${term.id}` : undefined,
        inDefinedTermSet: url ? { '@id': `${url}#terms` } : undefined,
      })),
    ),
  }

  return (
    <article className="shell pt-10 pb-16 lg:pt-14 lg:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <p className="eyebrow">
        <span aria-hidden="true" className="h-px w-6 bg-bamboo-500/50" />
        {g.eyebrow}
      </p>
      <h1 className="mt-5 max-w-4xl text-[2.25rem] leading-[1.06] font-semibold tracking-[-0.035em] text-balance text-ink-950 sm:text-[3rem]">
        {g.title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">{g.lead}</p>

      <nav aria-label={g.jumpTo} className="mt-8">
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
              {group.terms.map((term) => (
                <div key={term.id} id={term.id} className="scroll-mt-24 py-6">
                  <h3 className="-my-2 text-lg font-semibold text-ink-950">
                    <a href={`#${term.id}`} className="inline-flex min-h-11 items-center hover:text-bamboo-700">
                      {term.term}
                    </a>
                  </h3>
                  <p className="mt-2 text-[1.0625rem] leading-[1.65] text-ink-700">{term.body}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {g.readMore}{' '}
                    {term.links.map((path, i) => (
                      <span key={path}>
                        {i ? ' · ' : null}
                        <a
                          href={pageHref(lang, path)}
                          className="font-medium text-bamboo-700 underline decoration-bamboo-300 underline-offset-2 hover:decoration-bamboo-600"
                        >
                          {linkLabel(lang, path)}
                        </a>
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}
