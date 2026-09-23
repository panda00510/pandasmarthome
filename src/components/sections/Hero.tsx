import { ArrowRight, Box, Check, MapPin } from 'lucide-react'
import livingRoom from '../../assets/photos/living-room.jpg'
import { HomePanel } from '../graphics/HomePanel'
import { Button } from '../ui'
import { useI18n } from '../../i18n/context'

/**
 * Editorial fold: the headline runs the full width, the lead and CTAs sit
 * beside its tail, and a wide photograph carries the live control panel.
 * The trust points close the fold as one ruled strip.
 */
export function Hero() {
  const { t, lang } = useI18n()

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Soft brand wash, drifting slowly. Stopped by prefers-reduced-motion. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [animation:drift_26s_ease-in-out_infinite] bg-[radial-gradient(70rem_36rem_at_85%_-15%,rgba(31,138,95,0.16),transparent_60%),radial-gradient(50rem_28rem_at_0%_0%,rgba(12,15,19,0.06),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] [background-image:linear-gradient(to_right,#0c0f13_1px,transparent_1px),linear-gradient(to_bottom,#0c0f13_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_60%)]"
      />

      <div className="shell pt-10 pb-16 sm:pt-14 lg:pt-20 lg:pb-24">
        <div className="animate-rise">
          <p className="eyebrow">
            <span aria-hidden="true" className="h-px w-6 bg-bamboo-500/50" />
            {t.hero.eyebrow}
          </p>

          <h1 className="mt-5 max-w-[15ch] text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.04em] text-ink-950 sm:text-[3.5rem] lg:max-w-none lg:text-[4.5rem] xl:text-[5.25rem]">
            {t.hero.titleLead}
            {/* CJK sets without inter-word spaces; the Chinese lead already ends in a comma. */}
            {lang === 'zh' ? null : ' '}
            {/* Chinese breaks between any two characters, so the accent always gets its own line. */}
            <br className={lang === 'zh' ? '' : 'hidden lg:block'} />
            <span className="text-bamboo-600">{t.hero.titleAccent}</span>
          </h1>
        </div>

        <div className="mt-8 grid gap-8 [animation-delay:120ms] animate-rise lg:mt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <p className="max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
            {t.hero.lead}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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

        {/* Wide photograph with the control panel riding on it. */}
        <div className="relative mt-10 [animation-delay:240ms] animate-rise lg:mt-14">
          <div className="relative overflow-hidden rounded-panel border border-ink-200/80 shadow-lift">
            <img
              src={livingRoom}
              alt={t.hero.imageAlt}
              width={1600}
              height={1068}
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/9] lg:aspect-[21/9]"
            />
            {/* Scrim so the overlay chips stay legible on any part of the photo. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/45 via-transparent to-transparent"
            />
            <div className="absolute top-4 right-4 left-4 flex flex-wrap items-center gap-2 sm:top-auto sm:right-auto sm:bottom-6 sm:left-6">
              <a
                href={`${import.meta.env.BASE_URL}showroom/?lang=${lang}`}
                className="group inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink-950 shadow-lift transition-colors hover:bg-bamboo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
              >
                <Box size={16} className="text-bamboo-600" aria-hidden="true" />
                {t.hero.showroomCta}
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </a>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-ink-950/55 px-3 py-1.5 text-xs font-medium text-paper backdrop-blur-md">
                <MapPin size={13} aria-hidden="true" />
                {t.homes.areas.title}
              </span>
            </div>
          </div>

          {/* Overlaps the photo's foot on small screens; floats over its right side on lg. */}
          <div className="mt-[-3rem] ml-3 sm:mt-[-4rem] lg:absolute lg:top-1/2 lg:right-8 lg:mt-0 lg:ml-0 lg:-translate-y-1/2 xl:right-12">
            <HomePanel />
          </div>
        </div>

        <ul className="mt-10 grid border-y border-ink-200/80 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {t.hero.trust.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 border-ink-200/80 py-4 text-[0.9375rem] text-ink-700 not-last:border-b sm:border-b-0 sm:px-5 sm:odd:border-r sm:odd:pl-0 sm:nth-[-n+2]:border-b lg:border-b-0! lg:odd:pl-5 lg:first:pl-0! lg:not-last:border-r lg:py-5"
            >
              <Check
                size={16}
                strokeWidth={2.6}
                className="mt-0.5 shrink-0 text-bamboo-500"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
