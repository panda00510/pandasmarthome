import { ArrowRight, Box } from 'lucide-react'
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

/** Homepage band: the three pages by situation, as tall picture cards, then the two main actions. */
export function Situations() {
  const { t, lang } = useI18n()
  const s = t.situations

  return (
    <section id="situations" className="band border-t border-ink-200/70 bg-paper-alt">
      <div className="shell">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} lead={s.lead} shortOnPhone split />

        <ul className="reveal-group mt-8 grid gap-3 sm:grid-cols-3 lg:mt-12 lg:gap-4">
          {s.items.map((item, i) => {
            const render = RENDERS[item.id]
            return (
              <li key={item.id} data-reveal className="flex">
                <a
                  href={pageHref(lang, item.path)}
                  className="media-card group min-h-[19rem] w-full p-5 sm:min-h-[26rem] lg:min-h-[30rem] lg:p-7"
                >
                  <img
                    src={render.src}
                    srcSet={render.srcSet}
                    sizes="(min-width: 1200px) 380px, (min-width: 640px) 33vw, 100vw"
                    alt={item.imageAlt}
                    width={1600}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                    className="media-img"
                  />
                  <PhotoTag className="top-3! bottom-auto! left-3!">{t.footer.renderTag}</PhotoTag>
                  <span className="numeral text-sm font-semibold text-bamboo-300">{String(i + 1).padStart(2, '0')}</span>
                  <span className="mt-2 block text-xl font-semibold tracking-[-0.015em] text-paper lg:text-2xl">{item.title}</span>
                  <span className="mt-2 block text-[0.9375rem] leading-relaxed text-ink-200">{item.body}</span>
                  <span className="link-more min-h-0 pt-4">
                    {t.guides.learnMore}
                    <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        {/* The two main actions, together and plain: talk to us, or see it first. */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-10">
          <Button as="a" href="#contact" size="lg" className="w-full sm:w-auto">
            {s.cta}
            <ArrowRight size={17} aria-hidden="true" />
          </Button>
          <Button as="a" href={showroomHref(lang)} variant="secondary" size="lg" className="w-full sm:w-auto">
            <Box size={17} aria-hidden="true" />
            {t.hero.showroomCta}
          </Button>
        </div>
      </div>
    </section>
  )
}
