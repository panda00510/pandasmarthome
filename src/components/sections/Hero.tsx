import { ArrowRight, Box, Check } from 'lucide-react'
import { responsive } from '../../content/photos'
import { HomePanel } from '../graphics/HomePanel'
import { Button, PhotoTag } from '../ui'
import { useI18n } from '../../i18n/context'

const photo = responsive('hero-living')

/**
 * First screen: headline and calls to action on the left, one bright room on
 * the right with a small scene card on it. The trust points sit directly
 * below as a quiet strip. On a phone the copy comes first and the photo
 * follows, so the actions are visible without scrolling.
 */
export function Hero() {
  const { t, lang } = useI18n()

  return (
    <>
      <section id="top" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_30rem_at_85%_-10%,rgba(31,138,95,0.12),transparent_60%)]"
        />

        <div className="shell grid gap-6 pt-6 pb-10 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14 lg:pt-14 lg:pb-16">
          <div className="animate-rise">
            <p className="eyebrow">
              <span aria-hidden="true" className="h-px w-6 bg-bamboo-500/50" />
              {t.hero.eyebrow}
            </p>

            <h1 className="mt-4 text-[2.25rem] leading-[1.06] font-semibold tracking-[-0.035em] text-ink-950 sm:text-[3.25rem] lg:text-[4.5rem]">
              {t.hero.titleLead}
              {lang === 'zh' ? null : ' '}
              <br className={lang === 'zh' ? '' : 'hidden lg:block'} />
              <span className="text-bamboo-600">{t.hero.titleAccent}</span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg lg:mt-6">
              {t.hero.lead}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-8">
              <Button as="a" href="#contact" size="lg" className="w-full sm:w-auto">
                {t.hero.primaryCta}
                <ArrowRight size={17} aria-hidden="true" />
              </Button>
              <Button
                as="a"
                href="#solutions"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                {t.hero.secondaryCta}
              </Button>
            </div>
          </div>

          <div className="relative [animation-delay:160ms] animate-rise">
            <div className="relative overflow-hidden rounded-panel border border-ink-200/80 shadow-lift">
              <img
                src={photo.src}
                srcSet={photo.srcSet}
                sizes="(min-width: 1200px) 600px, (min-width: 1024px) 50vw, 100vw"
                alt={t.hero.imageAlt}
                width={1200}
                height={750}
                fetchPriority="high"
                decoding="async"
                className="aspect-[16/10] w-full object-cover"
              />
              <PhotoTag className="right-3 bottom-3 left-auto sm:right-4 sm:bottom-4">{t.footer.imageTag}</PhotoTag>
              <a
                href={`${import.meta.env.BASE_URL}showroom/?lang=${lang}`}
                className="group absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-paper px-3.5 py-2 text-[0.8125rem] font-semibold text-ink-950 shadow-lift transition-colors hover:bg-bamboo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper sm:top-4 sm:left-4"
              >
                <Box size={15} className="text-bamboo-600" aria-hidden="true" />
                {t.hero.showroomCta}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </a>
            </div>

            {/* Compact scene card: floats over the photo's corner on wide screens, hidden on phones. */}
            <div className="absolute -bottom-5 left-4 hidden sm:block lg:-bottom-6 lg:-left-8">
              <HomePanel compact />
            </div>
          </div>
        </div>
      </section>

      <div className="border-y border-ink-200/80 bg-paper-alt">
        <ul className="shell grid gap-x-6 gap-y-1 py-3 sm:grid-cols-2 lg:grid-cols-4 lg:py-4">
          {t.hero.trust.map((item) => (
            <li key={item} className="flex items-start gap-2.5 py-1.5 text-[0.875rem] text-ink-700">
              <Check size={15} strokeWidth={2.6} className="mt-0.5 shrink-0 text-bamboo-600" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
