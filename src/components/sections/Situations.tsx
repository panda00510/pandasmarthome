import { ArrowRight, ArrowUpRight, Box } from 'lucide-react'
import { responsive } from '../../content/photos'
import { pageHref, useI18n } from '../../i18n/context'
import { showroomHref } from '../../lib/showroom'
import { Button, PhotoTag, SectionHeading } from '../ui'

/** Stills from our own 3D showroom, one per situation page. */
const RENDERS: Record<string, ReturnType<typeof responsive>> = {
  away: responsive('showroom-away'),
  nights: responsive('showroom-sleep'),
  family: responsive('showroom-home'),
}

/**
 * Editorial triptych on warm sandstone: three residential situations presented
 * as clean framed vertical gallery plates (unobstructed renders on top,
 * alabaster editorial folio captions underneath).
 */
export function Situations() {
  const { t, lang } = useI18n()
  const s = t.situations

  return (
    <section id="situations" className="band border-t border-ink-950/12 bg-paper-alt">
      <div className="shell">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} lead={s.lead} shortOnPhone split />

        <ul className="reveal-group mt-10 grid gap-5 sm:grid-cols-3 lg:mt-14">
          {s.items.map((item, i) => {
            const render = RENDERS[item.id]
            return (
              <li key={item.id} data-reveal className="flex">
                <a
                  href={pageHref(lang, item.path)}
                  className="card group flex w-full flex-col overflow-hidden"
                >
                  <span className="relative block aspect-[4/3] w-full overflow-hidden border-b border-ink-950/12 bg-ink-950">
                    <img
                      src={render.src}
                      srcSet={render.srcSet}
                      sizes="(min-width: 1200px) 390px, (min-width: 640px) 33vw, 100vw"
                      alt={item.imageAlt}
                      width={1600}
                      height={1000}
                      loading="lazy"
                      decoding="async"
                      className="block size-full object-cover transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.04] motion-reduce:transition-none"
                    />
                    <PhotoTag className="top-2.5! bottom-auto! left-2.5!">{t.footer.renderTag}</PhotoTag>
                  </span>

                  <span className="flex flex-1 flex-col p-5 sm:p-6">
                    <span className="flex items-center justify-between border-b border-ink-950/10 pb-3">
                      <span className="numeral text-xs font-semibold text-ember-500">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <ArrowUpRight
                        size={15}
                        aria-hidden="true"
                        className="text-ink-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink-950"
                      />
                    </span>

                    <span className="title-card mt-4 block text-ink-950 lg:text-[1.375rem]">
                      {item.title}
                    </span>
                    <span className="mt-2.5 block text-sm leading-relaxed text-ink-600 sm:text-[0.9375rem]">
                      {item.body}
                    </span>
                    <span className="link-more mt-auto min-h-0 pt-5 text-sm">
                      {t.guides.learnMore}
                      <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        {/* Hairline-framed architectural action bar */}
        <div className="card mt-8 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 lg:mt-10">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <Button as="a" href="#contact" size="lg" className="w-full sm:w-auto">
              {s.cta}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
            <Button as="a" href={showroomHref(lang)} variant="secondary" size="lg" className="w-full sm:w-auto">
              <Box size={16} aria-hidden="true" className="text-ember-500" />
              {t.hero.showroomCta}
            </Button>
          </div>
          <a href={pageHref(lang, 'solutions/')} className="link-more px-2 hover:text-ink-950">
            {t.hubs.solutions.all}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
