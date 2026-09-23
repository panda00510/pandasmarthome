import { Fragment, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react'
import { site } from '../../config/site'
import { guidePath, guidesIn, type Guide } from '../../content/guides'
import { pageHref, useI18n, type Lang } from '../../i18n/context'
import { Button, SectionHeading } from '../ui'

function formatDate(date: string, lang: Lang) {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-Hans-SG' : 'en-SG', { dateStyle: 'long' }).format(
    new Date(`${date}T00:00:00`),
  )
}

function GuideCard({ guide, lang }: { guide: Guide; lang: Lang }) {
  return (
    <a
      href={pageHref(lang, guidePath(guide.slug))}
      data-reveal
      className="card spotlight group flex flex-col p-6"
    >
      <time dateTime={guide.updated} className="text-xs font-medium text-ink-500">
        {formatDate(guide.updated, lang)}
      </time>
      <h3 className="mt-3 text-lg leading-snug font-semibold text-ink-950 transition-colors group-hover:text-bamboo-700">
        {guide.title}
      </h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{guide.description}</p>
      <span aria-hidden="true" className="mt-auto pt-4 text-bamboo-600">
        <ArrowRight
          size={17}
          className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
        />
      </span>
    </a>
  )
}

/** Homepage strip: the three newest guides. */
export function LatestGuides() {
  const { t, lang } = useI18n()
  const latest = guidesIn(lang).slice(0, 3)
  if (!latest.length) return null

  return (
    <section id="guides" className="band border-t border-ink-200/70">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t.guides.eyebrow} title={t.guides.title} lead={t.guides.lead} />
          <a
            href={pageHref(lang, 'guides/')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-bamboo-700 hover:text-bamboo-600"
          >
            {t.guides.all}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {latest.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  )
}

/** /guides/ */
export function GuidesIndex() {
  const { t, lang } = useI18n()

  return (
    <section className="shell pt-12 pb-20 lg:pt-16 lg:pb-28">
      <p className="eyebrow">
        <span aria-hidden="true" className="h-px w-6 bg-bamboo-500/50" />
        {t.guides.eyebrow}
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl leading-[1.08] font-semibold tracking-[-0.03em] text-ink-950 sm:text-5xl">
        {t.guides.title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-600">{t.guides.lead}</p>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {guidesIn(lang).map((guide) => (
          <GuideCard key={guide.slug} guide={guide} lang={lang} />
        ))}
      </div>
    </section>
  )
}

/** /guides/<slug>/ */
export function GuidePage({ guide }: { guide: Guide }) {
  const { t, lang } = useI18n()
  const others = guidesIn(lang).filter((other) => other.slug !== guide.slug).slice(0, 3)

  return (
    <>
      <article className="shell pt-10 pb-16 lg:pt-14">
        <div className="mx-auto max-w-[44rem]">
          <a
            href={pageHref(lang, 'guides/')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-bamboo-700"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            {t.guides.all}
          </a>
          <h1 className="mt-6 text-[2rem] leading-[1.12] font-semibold tracking-[-0.03em] text-balance text-ink-950 sm:text-[2.75rem]">
            {guide.title}
          </h1>
          <p className="mt-4 text-sm text-ink-500">
            {t.guides.updated} <time dateTime={guide.updated}>{formatDate(guide.updated, lang)}</time>
          </p>
          <p className="mt-6 border-l-2 border-bamboo-500 pl-4 text-lg leading-relaxed text-ink-700">
            {guide.description}
          </p>
          <div className="mt-10">
            <Markdown source={guide.body} />
          </div>

          <aside className="mt-14 rounded-panel bg-ink-950 p-7 text-paper sm:p-9">
            <h2 className="text-xl font-semibold">{t.guides.ctaTitle}</h2>
            <p className="mt-2 leading-relaxed text-ink-300">{t.guides.ctaBody}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button as="a" href={`${pageHref(lang)}#contact`} variant="accent">
                {t.guides.ctaButton}
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
              {site.whatsappLink ? (
                <Button
                  as="a"
                  href={`${site.whatsappLink}?text=${encodeURIComponent(t.contact.whatsappGreeting)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  WhatsApp
                </Button>
              ) : null}
            </div>
          </aside>
        </div>
      </article>

      {others.length ? (
        <section className="border-t border-ink-200/70 bg-paper-alt">
          <div className="shell py-16">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink-950">{t.guides.more}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
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
 * Just enough Markdown for articles: ## / ### headings, paragraphs, - and 1.
 * lists, **bold** and [links](url). Rendered as React elements, so nothing in
 * a file can inject HTML. Root-relative links ("/#contact") get the base path.
 */
function Markdown({ source }: { source: string }) {
  return source.split(/\n{2,}/).map((block, i) => {
    const lines = block.split('\n')
    if (block.startsWith('### ')) {
      return <h3 key={i} className="mt-8 text-lg font-semibold text-ink-950">{inline(block.slice(4))}</h3>
    }
    if (block.startsWith('## ')) {
      return (
        <h2 key={i} className="mt-12 text-2xl leading-snug font-semibold tracking-[-0.02em] text-ink-950">
          {inline(block.slice(3))}
        </h2>
      )
    }
    const list = lines.every((line) => /^- /.test(line)) ? 'ul' : lines.every((line) => /^\d+\. /.test(line)) ? 'ol' : null
    if (list) {
      const List = list
      return (
        <List
          key={i}
          className={`mt-5 space-y-2 pl-5 text-[1.0625rem] leading-relaxed text-ink-700 marker:text-bamboo-600 ${
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
      <p key={i} className="mt-5 text-[1.0625rem] leading-[1.75] text-ink-700">
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
