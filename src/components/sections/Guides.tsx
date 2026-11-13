import { Fragment, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, ChevronDown, Clock, MessageCircle } from 'lucide-react'
import { formattedAddress, site } from '../../config/site'
import {
  FEATURED,
  guidesIn,
  HUBS,
  readMinutes,
  TOPIC_IDS,
  type Guide,
} from '../../content/guides'
import '../../content/guideDescriptions'
import { pageHref, useI18n, type Lang } from '../../i18n/context'
import { GuideFigure } from '../graphics/GuideFigures'
import { Button } from '../ui'

function formatDate(date: string, lang: Lang) {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-Hans-SG' : 'en-SG', { dateStyle: 'long' }).format(
    new Date(`${date}T00:00:00`),
  )
}

const minutesLabel = (template: string, guide: Guide) => template.replace('{n}', String(readMinutes(guide)))

function GuideCard({
  guide,
  lang,
  brief = false,
  feature = false,
}: {
  guide: Guide
  lang: Lang
  /** Title and reading time only on a phone. */
  brief?: boolean
  feature?: boolean
}) {
  const { t } = useI18n()
  return (
    <a
      href={pageHref(lang, guide.path)}
      data-reveal
      className={`card group flex h-full flex-col transition-colors hover:border-bamboo-200 ${
        feature ? 'p-5 sm:p-7' : 'p-5'
      }`}
    >
      <span className="flex items-center gap-2 text-xs font-medium text-ink-500">
        <span className="rounded-full bg-bamboo-50 px-2.5 py-1 text-bamboo-700 ring-1 ring-bamboo-100">
          {t.guides.topics[guide.topic]}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock size={12} aria-hidden="true" />
          {minutesLabel(t.guides.readMin, guide)}
        </span>
      </span>
      <h3
        className={`mt-3 line-clamp-3 leading-snug font-semibold text-ink-950 transition-colors group-hover:text-bamboo-700 ${
          feature ? 'text-xl sm:text-2xl' : 'text-[1.0625rem]'
        }`}
      >
        {guide.heading}
      </h3>
      <p
        className={`mt-2 line-clamp-2 text-[0.9375rem] leading-relaxed text-ink-600 ${
          brief ? 'hidden sm:block' : ''
        } ${feature ? 'sm:line-clamp-3' : ''}`}
      >
        {guide.description}
      </p>
    </a>
  )
}

const PAGE_SIZE = 6

/** /guides/: one main pick and two more up top, then every guide with a topic filter. */
export function GuidesIndex() {
  const { t, lang } = useI18n()
  const all = guidesIn(lang)
  const featured = FEATURED.flatMap((slug) => all.filter((guide) => guide.slug === slug))
  const [topic, setTopic] = useState<string>('all')
  const [expanded, setExpanded] = useState(false)

  const shown = all.filter((guide) => topic === 'all' || guide.topic === topic)
  const topics = TOPIC_IDS.filter((id) => all.some((guide) => guide.topic === id))

  return (
    <section className="shell pt-10 pb-16 lg:pt-14 lg:pb-24">
      <p className="eyebrow">
        <span aria-hidden="true" className="h-px w-6 bg-bamboo-500/50" />
        {t.guides.eyebrow}
      </p>
      <h1 className="mt-5 max-w-4xl text-[2.25rem] leading-[1.06] font-semibold tracking-[-0.035em] text-balance text-ink-950 sm:text-[3rem] lg:text-[3.5rem]">
        {t.guides.title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">{t.guides.lead}</p>

      {featured.length ? (
        <div className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <h2 className="mb-2 text-xs font-semibold tracking-wider text-bamboo-700 uppercase">
              {t.guides.featured}
            </h2>
            <GuideCard guide={featured[0]} lang={lang} feature />
          </div>
          <div className="grid gap-4 lg:pt-6">
            {featured.slice(1).map((guide) => (
              <GuideCard key={guide.slug} guide={guide} lang={lang} />
            ))}
          </div>
        </div>
      ) : null}

      <h2 className="sr-only">{t.guides.allTopics}</h2>
      <div role="group" aria-label={t.guides.allTopics} className="mt-10 flex flex-wrap gap-2">
        {['all', ...topics].map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={topic === id}
            onClick={() => {
              setTopic(id)
              setExpanded(false)
            }}
            className={`inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 text-sm font-medium transition-colors ${
              topic === id
                ? 'bg-brand text-white'
                : 'border border-ink-300 text-ink-700 hover:border-ink-500 hover:bg-white'
            }`}
          >
            {id === 'all' ? t.guides.allTopics : t.guides.topics[id]}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((guide, i) => (
          <div key={guide.slug} className={i >= PAGE_SIZE && !expanded ? 'hidden' : undefined}>
            <GuideCard guide={guide} lang={lang} />
          </div>
        ))}
      </div>

      {shown.length > PAGE_SIZE && !expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="btn mt-6 h-12 cursor-pointer border border-ink-300 px-6 text-ink-900 hover:border-ink-500 hover:bg-white"
        >
          {t.guides.showMore}
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      ) : null}
    </section>
  )
}

/** Headings of a Markdown body, for the contents list. */
function headings(source: string) {
  return source
    .split(/\n{2,}/)
    .filter((block) => block.startsWith('## '))
    .map((block, i) => ({ id: `s${i + 1}`, text: block.slice(3).replace(/\*\*|\[|\]\([^)]*\)/g, '') }))
}

/** /guides/<slug>/ and the topic pages. */
export function GuidePage({ guide }: { guide: Guide }) {
  const { t, lang } = useI18n()
  const isPage = guide.kind === 'page'
  const hub = HUBS.find((name) => guide.path.startsWith(`${name}/`)) ?? null
  const others = isPage
    ? guide.related.flatMap((slug) => guidesIn(lang).filter((other) => other.slug === slug)).slice(0, 3)
    : guidesIn(lang).filter((other) => other.slug !== guide.slug).slice(0, 3)
  const toc = isPage ? [] : headings(guide.body).filter((h) => h.text !== t.guides.related)
  const legal = guide.path === 'about/' || guide.path === 'privacy/'

  return (
    <>
      <article className="shell pt-8 pb-14 lg:pt-12">
        <div className="lg:grid lg:grid-cols-[minmax(0,41rem)_14rem] lg:justify-center lg:gap-14">
          <div className="min-w-0">
            <a
              href={pageHref(lang, hub ? `${hub}/` : isPage ? '' : 'guides/')}
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-bamboo-700"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              {hub ? t.hubs[hub].all : isPage ? t.guides.backHome : t.guides.all}
            </a>
            <h1 className="mt-4 text-[1.875rem] leading-[1.15] font-semibold tracking-[-0.03em] text-balance text-ink-950 sm:text-[2.75rem]">
              {guide.heading}
            </h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-600">
              <span className="font-medium text-ink-800">{t.guides.byline}</span>
              <span>
                {t.guides.updated}{' '}
                <time dateTime={guide.updated}>{formatDate(guide.updated, lang)}</time>
              </span>
              {isPage ? null : (
                <span className="inline-flex items-center gap-1">
                  <Clock size={13} aria-hidden="true" />
                  {minutesLabel(t.guides.readMin, guide)}
                </span>
              )}
            </p>
            <p className="mt-5 border-l-2 border-bamboo-500 pl-4 text-[1.0625rem] leading-relaxed text-ink-700 sm:text-lg">
              {guide.description}
            </p>

            {guide.points.length ? (
              <aside className="mt-6 rounded-card bg-bamboo-50 p-5 ring-1 ring-bamboo-100">
                <h2 className="text-sm font-semibold tracking-wide text-bamboo-800">
                  {t.guides.keyPoints}
                </h2>
                <ol className="mt-3 space-y-2.5 text-base leading-relaxed text-ink-800">
                  {guide.points.map((point, i) => (
                    <li key={point} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                        {i + 1}
                      </span>
                      {point}
                    </li>
                  ))}
                </ol>
              </aside>
            ) : null}

            {toc.length > 2 ? (
              <details className="card mt-6 lg:hidden">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold text-ink-900 [&::-webkit-details-marker]:hidden">
                  {t.guides.contents}
                  <ChevronDown size={16} aria-hidden="true" />
                </summary>
                <ol className="space-y-1 px-4 pb-4">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="block py-1.5 text-sm text-ink-700 hover:text-bamboo-700">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            ) : null}

            <div className="mt-8">
              <Markdown source={guide.body} slug={isPage ? '' : guide.slug} lang={lang} />
            </div>

            {legal ? <CompanyDetails /> : null}

            {/* The privacy policy carries no sales pitch. */}
            {guide.path === 'privacy/' ? null : (
            <aside className="mt-12 rounded-panel bg-ink-950 p-6 text-paper sm:p-9">
              <h2 className="text-xl font-semibold">{t.guides.ctaTitle}</h2>
              <p className="mt-2 leading-relaxed text-[#c7cdd2]">{t.guides.ctaBody}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button as="a" href={`${pageHref(lang)}#contact`} variant="inverse">
                  {t.guides.ctaButton}
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
                {site.whatsappLink ? (
                  <Button
                    as="a"
                    href={`${site.whatsappLink}?text=${encodeURIComponent(t.contact.whatsappGreeting)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-white/25 bg-transparent text-paper hover:bg-white/10"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    WhatsApp
                  </Button>
                ) : null}
              </div>
            </aside>
            )}
          </div>

          {toc.length > 2 ? (
            <nav aria-label={t.guides.contents} className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-xs font-semibold tracking-wider text-ink-500 uppercase">
                  {t.guides.contents}
                </p>
                <ol className="mt-3 space-y-1 border-l border-ink-200">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm leading-snug text-ink-600 hover:border-bamboo-500 hover:text-bamboo-700"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>
          ) : null}
        </div>
      </article>

      {others.length ? (
        <section className="border-t border-ink-200/70 bg-paper-alt">
          <div className="shell py-12 lg:py-16">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink-950">
              {isPage ? t.guides.related : t.guides.more}
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {others.map((other) => (
                <GuideCard key={other.slug} guide={other} lang={lang} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

/**
 * Who runs the site, on /about/ and /privacy/. The name falls back to the
 * brand; every other row appears only when its VITE_* value is configured.
 */
function CompanyDetails() {
  const { t, lang } = useI18n()
  const rows = [
    [t.guides.companyName, lang === 'zh' ? site.companyNameZh : site.companyName],
    [t.guides.registration, site.registrationNumber],
    [t.contact.labels.address, formattedAddress],
    [t.contact.labels.email, site.email],
    [t.contact.labels.serviceArea, lang === 'zh' ? site.serviceAreaZh : site.serviceArea],
  ].filter((row): row is [string, string] => Boolean(row[1]))
  return (
    <section className="card mt-10 p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-ink-950">{t.guides.companyTitle}</h2>
      <dl className="mt-3 grid gap-x-6 gap-y-2 text-[0.9375rem] leading-relaxed sm:grid-cols-[auto_minmax(0,1fr)]">
        {rows.map(([label, value]) => (
          <Fragment key={label}>
            <dt className="font-medium text-ink-500">{label}</dt>
            <dd className="-mt-2 break-words text-ink-800 sm:mt-0">
              {value === site.email ? (
                <a href={`mailto:${value}`} className="text-bamboo-700 underline underline-offset-2">
                  {value}
                </a>
              ) : (
                value
              )}
            </dd>
          </Fragment>
        ))}
      </dl>
    </section>
  )
}

/**
 * Just enough Markdown for articles: ## / ### headings, paragraphs, - and 1.
 * lists, **bold** and [links](url). Rendered as React elements, so nothing in
 * a file can inject HTML. Root-relative links ("/#contact") get the base path.
 * An explanatory figure, when the article has one, follows its first section.
 */
function Markdown({ source, slug, lang }: { source: string; slug: string; lang: Lang }) {
  let section = 0
  return source.split(/\n{2,}/).map((block, i) => {
    const lines = block.split('\n')
    if (block.startsWith('### ')) {
      return <h3 key={i} className="mt-7 text-lg font-semibold text-ink-950">{inline(block.slice(4))}</h3>
    }
    // "## 1. Title": a numbered step, drawn on a vertical timeline
    const step = /^## (\d+)\.\s+(.*)$/.exec(block)
    if (step) {
      return (
        <h2
          key={i}
          className="mt-8 flex items-center gap-3 text-[1.375rem] leading-snug font-semibold tracking-[-0.02em] text-ink-950"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-[0.9375rem] font-semibold text-white tabular-nums">
            {step[1]}
          </span>
          {inline(step[2])}
        </h2>
      )
    }
    if (block.startsWith('## ')) {
      section += 1
      return (
        <Fragment key={i}>
          {section === 2 && slug ? <GuideFigure slug={slug} lang={lang} /> : null}
          <h2
            id={`s${section}`}
            className="mt-10 scroll-mt-24 text-[1.5rem] leading-snug font-semibold tracking-[-0.02em] text-ink-950"
          >
            {inline(block.slice(3))}
          </h2>
        </Fragment>
      )
    }
    // "- **Label:** text" lines: a small labelled table (you bring / we deliver / you can check)
    const labelled = lines.every((line) => /^- \*\*[^*]+:\*\* /.test(line))
    if (labelled) {
      return (
        <dl key={i} className="mt-3 ml-[1.125rem] space-y-3 border-l-2 border-bamboo-200 pl-6">
          {lines.map((line, j) => {
            const [, label, text] = /^- \*\*([^*]+):\*\* (.*)$/.exec(line)!
            return (
              <div key={j}>
                <dt className="text-xs font-semibold tracking-wider text-bamboo-700 uppercase">{label}</dt>
                <dd className="mt-0.5 text-[1.0625rem] leading-[1.6] text-ink-700">{inline(text)}</dd>
              </div>
            )
          })}
        </dl>
      )
    }
    const list = lines.every((line) => /^- /.test(line)) ? 'ul' : lines.every((line) => /^\d+\. /.test(line)) ? 'ol' : null
    if (list) {
      const List = list
      return (
        <List
          key={i}
          className={`mt-4 space-y-2 pl-5 text-[1.125rem] leading-[1.65] text-ink-700 marker:text-bamboo-600 ${
            list === 'ul' ? 'list-disc' : 'list-decimal'
          }`}
        >
          {lines.map((line, j) => (
            <li key={j}>{inline(line.replace(/^(- |\d+\. )/, ''))}</li>
          ))}
        </List>
      )
    }
    return (
      <p key={i} className="mt-4 text-[1.125rem] leading-[1.65] text-ink-700">
        {inline(lines.join(' '))}
      </p>
    )
  })
}

function inline(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/).map((part, i) => {
    const bold = /^\*\*([^*]+)\*\*$/.exec(part)
    if (bold) return <strong key={i} className="font-semibold text-ink-950">{bold[1]}</strong>
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part)
    if (link) {
      const href = link[2].startsWith('/') ? import.meta.env.BASE_URL + link[2].slice(1) : link[2]
      const external = /^https?:/.test(href)
      return (
        <a
          key={i}
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="font-medium text-bamboo-700 underline decoration-bamboo-300 underline-offset-2 hover:decoration-bamboo-600"
        >
          {link[1]}
        </a>
      )
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}
