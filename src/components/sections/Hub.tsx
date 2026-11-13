import { ArrowRight, Blinds, Gauge, History, LayoutDashboard, Lightbulb, Lock, Thermometer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { responsive } from '../../content/photos'
import { pagesIn, type Guide, type Hub } from '../../content/guides'
import { pageHref, useI18n, type Lang } from '../../i18n/context'
import { PhotoTag, SectionHeading } from '../ui'

const ICONS: Record<string, LucideIcon> = {
  'solutions/smart-lighting/': Lightbulb,
  'solutions/home-control/': LayoutDashboard,
  'solutions/energy-monitoring/': Gauge,
  'solutions/smart-aircon-control/': Thermometer,
  'solutions/motorised-curtains/': Blinds,
  'solutions/smart-door-locks/': Lock,
}

const PHOTOS: Record<string, ReturnType<typeof responsive>> = {
  'homes/bto-smart-home/': responsive('home-bto'),
  'homes/hdb-resale-smart-home/': responsive('home-hdb'),
  'homes/condo-smart-home/': responsive('home-condo'),
  'homes/landed-smart-home/': responsive('home-landed'),
}

const UPCOMING = 'solutions/upcoming-products/'
const OLDER = 'homes/older-home-upgrade/'

/** /solutions/ and /homes/: the topic pages beneath each, as a short visual menu. */
export function HubPage({ hub }: { hub: Hub }) {
  const { t, lang } = useI18n()
  const copy = t.hubs[hub]
  const items = pagesIn(lang).filter((page) => page.path.startsWith(`${hub}/`))

  return (
    <section className="band">
      <div className="shell">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} level={1} />
        {hub === 'solutions' ? (
          <SolutionsMenu items={items} lang={lang} more={t.guides.learnMore} />
        ) : (
          <HomesMenu items={items} lang={lang} more={t.guides.learnMore} tag={t.footer.imageTag} />
        )}
      </div>
    </section>
  )
}

function SolutionsMenu({ items, lang, more }: { items: Guide[]; lang: Lang; more: string }) {
  const main = items.filter((page) => ICONS[page.path])
  const upcoming = items.find((page) => page.path === UPCOMING)
  return (
    <>
      <ul className="reveal-group mt-8 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-4">
        {main.map((page) => {
          const Icon = ICONS[page.path]
          return (
            <li key={page.path} data-reveal>
              <a
                href={pageHref(lang, page.path)}
                className="card group flex h-full flex-col p-5 transition-colors hover:border-bamboo-200 lg:p-6"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-bamboo-50 text-bamboo-700 ring-1 ring-bamboo-100 transition-colors group-hover:bg-brand group-hover:text-white">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-[1.0625rem] leading-snug font-semibold text-ink-950">{page.title}</h2>
                <p className="mt-2 line-clamp-3 text-[0.9375rem] leading-relaxed text-ink-600">{page.description}</p>
                <span className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-3 text-sm font-semibold text-bamboo-700">
                  {more}
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </a>
            </li>
          )
        })}
      </ul>
      {upcoming ? (
        <a
          href={pageHref(lang, upcoming.path)}
          className="mt-4 flex flex-col gap-1 rounded-card border border-dashed border-ink-300 p-5 transition-colors hover:border-bamboo-300 hover:bg-white sm:flex-row sm:items-center sm:justify-between sm:gap-6"
        >
          <span>
            <span className="block text-[1rem] font-semibold text-ink-950">{upcoming.title}</span>
            <span className="mt-1 block line-clamp-2 text-sm leading-relaxed text-ink-600">{upcoming.description}</span>
          </span>
          <span className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-sm font-semibold text-bamboo-700">
            {more}
            <ArrowRight size={15} aria-hidden="true" />
          </span>
        </a>
      ) : null}
    </>
  )
}

function HomesMenu({ items, lang, more, tag }: { items: Guide[]; lang: Lang; more: string; tag: string }) {
  const main = items.filter((page) => PHOTOS[page.path])
  const older = items.find((page) => page.path === OLDER)
  return (
    <>
      <ul className="reveal-group mt-8 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:gap-4">
        {main.map((page) => {
          const photo = PHOTOS[page.path]
          return (
            <li key={page.path} data-reveal>
              <a
                href={pageHref(lang, page.path)}
                className="card group flex h-full flex-col overflow-hidden transition-colors hover:border-bamboo-200"
              >
                <span className="relative block">
                <img
                  src={photo.src}
                  srcSet={photo.srcSet}
                  sizes="(min-width: 1200px) 560px, (min-width: 640px) 45vw, 100vw"
                  alt=""
                  width={1200}
                  height={675}
                  loading="lazy"
                  decoding="async"
                  className="block aspect-[16/9] w-full object-cover"
                />
                <PhotoTag>{tag}</PhotoTag>
                </span>
                <span className="flex flex-1 flex-col p-5 lg:p-6">
                  <h2 className="text-[1.125rem] leading-snug font-semibold text-ink-950">{page.title}</h2>
                  <span className="mt-2 line-clamp-3 text-[0.9375rem] leading-relaxed text-ink-600">{page.description}</span>
                  <span className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-3 text-sm font-semibold text-bamboo-700">
                    {more}
                    <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>
      {older ? (
        <a
          href={pageHref(lang, older.path)}
          className="card mt-4 flex items-start gap-4 p-5 transition-colors hover:border-bamboo-200 sm:items-center lg:p-6"
        >
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bamboo-50 text-bamboo-700 ring-1 ring-bamboo-100">
            <History size={24} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[1.0625rem] font-semibold text-ink-950">{older.title}</span>
            <span className="mt-1 block line-clamp-2 text-sm leading-relaxed text-ink-600">{older.description}</span>
          </span>
          <ArrowRight size={18} aria-hidden="true" className="hidden shrink-0 text-bamboo-700 sm:block" />
        </a>
      ) : null}
    </>
  )
}
