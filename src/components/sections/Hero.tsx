import { useState } from 'react'
import { ArrowRight, Box, Check, CodeXml, Cpu, Monitor, Network } from 'lucide-react'
import { HomePanel } from '../graphics/HomePanel'
import { responsive } from '../../content/photos'
import { Button, PhotoTag } from '../ui'
import { pageHref, useI18n } from '../../i18n/context'
import { showroomHref } from '../../lib/showroom'

const SCENE_RENDERS = [
  {
    id: 'living',
    image: responsive('showroom-living'),
    position: 'object-[22%_50%]',
  },
  {
    id: 'movie',
    image: responsive('showroom-movie'),
    position: 'object-[22%_50%]',
  },
  {
    id: 'away',
    image: responsive('showroom-away'),
    position: 'object-center',
  },
] as const

/**
 * Tropical Monograph Hero — Sunlit travertine editorial spread.
 * Top architectural metadata rail, monumental serif headline + asymmetric action
 * column, framed 3D showroom exhibition plate paired cleanly beside a tactile
 * matte-limestone & brass wall keypad, closed by a 4-column specification ledger.
 */
export function Hero() {
  const { t, lang } = useI18n()
  const [sceneIndex, setSceneIndex] = useState(0)
  const activeScene = t.hero.panel.scenes[sceneIndex] ?? t.hero.panel.scenes[0]

  return (
    <section id="top" className="relative bg-paper text-ink-950">
      {/* Top architectural folio specification bar */}
      <div className="border-b border-ink-950/12">
        <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <p className="inline-flex items-center gap-2 font-mono text-[0.71875rem] font-medium tracking-[0.08em] text-ink-600 uppercase">
            <Network size={13} aria-hidden="true" className="text-brand" />
            <span>{t.hero.protocols}</span>
          </p>
        </div>
      </div>

      {/* Editorial headline split: monumental serif left, lead & actions right */}
      <div className="shell pt-9 pb-10 sm:pt-12 sm:pb-12 lg:pt-14 lg:pb-14">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.22fr)_minmax(0,0.78fr)] lg:items-end lg:gap-14">
          <div>
            <h1
              className={`font-display text-ink-950 ${
                lang === 'zh'
                  ? 'text-[2.375rem] leading-[1.12] font-medium tracking-[-0.015em] sm:text-[3.375rem] lg:text-[3.75rem] xl:text-[4.25rem]'
                  : 'text-[2.625rem] leading-[1.03] font-normal tracking-[-0.025em] sm:text-[3.75rem] lg:text-[4.25rem] xl:text-[4.875rem]'
              }`}
            >
              {t.hero.titleLead}
              {lang === 'zh' ? <br /> : ' '}
              <span className={`${lang === 'zh' ? 'text-brand' : 'italic text-brand'}`}>
                {t.hero.titleAccent}
              </span>
            </h1>
          </div>

          <div className="lg:border-l lg:border-ink-950/14 lg:pl-8">
            <p className="text-[0.98rem] leading-[1.68] text-ink-700 sm:text-[1.0625rem]">
              {t.hero.lead}
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <Button as="a" href="#contact" variant="primary" size="lg" className="w-full sm:w-auto">
                {t.hero.primaryCta}
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
              <Button as="a" href={showroomHref(lang)} variant="secondary" size="lg" className="w-full sm:w-auto">
                <Box size={16} aria-hidden="true" className="text-ember-500" />
                {t.hero.showroomCta}
              </Button>
            </div>

            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink-600 sm:text-[0.8125rem]">
              <Check size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
              <span>{t.hero.ctaNote}</span>
            </p>
          </div>
        </div>

        {/* Exhibition plate + tactile matte-stone wall keypad side by side */}
        <div className="mt-9 grid gap-4 sm:mt-11 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.78fr)] lg:items-stretch lg:gap-5">
          <figure className="plate-frame flex flex-col">
            <div className="relative aspect-[16/10] w-full flex-1 overflow-hidden rounded-[2px] bg-ink-950">
              {SCENE_RENDERS.map((render, i) => {
                const isActive = i === sceneIndex
                const alt =
                  i === 2
                    ? (t.situations.items[0]?.imageAlt ?? t.hero.renderAlt)
                    : t.hero.renderAlt
                return (
                  <img
                    key={render.id}
                    src={render.image.src}
                    srcSet={render.image.srcSet}
                    sizes="(min-width: 1200px) 760px, (min-width: 1024px) 62vw, 100vw"
                    alt={isActive ? alt : ''}
                    aria-hidden={isActive ? undefined : true}
                    width={1600}
                    height={1000}
                    fetchPriority={i === 0 ? 'high' : undefined}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className={`absolute inset-0 block size-full object-cover transition-opacity duration-600 ease-(--ease-out-soft) motion-reduce:transition-none ${render.position} ${
                      isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                  />
                )
              })}
              <PhotoTag className="top-3! bottom-auto! left-3!">{t.footer.renderTag}</PhotoTag>
            </div>

            {/* Clean editorial plate caption strip below the render */}
            <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-1.5 pt-2.5 pb-1 text-xs text-ink-600">
              <span className="inline-flex items-center gap-2 font-medium text-ink-950">
                <span className="numeral text-[0.6875rem] font-semibold text-ember-500">
                  {String(sceneIndex + 1).padStart(2, '0')}
                </span>
                <span>{activeScene.name}</span>
              </span>
              <span className="text-ink-600">{activeScene.detail}</span>
            </figcaption>
          </figure>

          <HomePanel sceneIndex={sceneIndex} onSceneChange={setSceneIndex} />
        </div>

        {/* Four-column architectural trust ledger */}
        <ul className="mt-10 grid grid-cols-2 border-y border-ink-950/14 sm:mt-12 lg:grid-cols-4">
          {t.hero.trust.map((item, i) => (
            <li
              key={item}
              className={`py-5 pr-4 lg:py-6 lg:pr-7 ${i > 0 ? 'lg:border-l lg:border-ink-950/12 lg:pl-7' : ''} ${
                i % 2 === 1 ? 'border-l border-ink-950/12 pl-4 lg:pl-7' : ''
              } ${i >= 2 ? 'border-t border-ink-950/12 lg:border-t-0' : ''}`}
            >
              <span className="numeral block text-[0.6875rem] font-semibold text-ember-500">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="mt-2 block text-[0.9375rem] leading-snug font-medium text-ink-950">
                {item}
              </span>
            </li>
          ))}
        </ul>

        {/* Quiet horizontal index to Panda's other lines of business */}
        <nav
          aria-label={t.hero.also.label}
          className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-2"
        >
          <span className="mr-2 w-full font-mono text-[0.6875rem] font-semibold tracking-[0.14em] text-ink-500 uppercase sm:w-auto">
            {t.hero.also.label}
          </span>
          {[
            { href: pageHref(lang, 'signage/'), label: t.hero.also.signage, Icon: Monitor },
            { href: pageHref(lang, 'custom-hardware/'), label: t.hero.also.hardware, Icon: Cpu },
            { href: pageHref(lang, 'software/'), label: t.hero.also.software, Icon: CodeXml },
          ].map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              className="group inline-flex min-h-11 items-center gap-2 rounded-[3px] border border-ink-950/14 bg-surface px-3.5 text-sm font-medium text-ink-800 transition-colors hover:border-ink-950 hover:text-ink-950"
            >
              <Icon size={14} aria-hidden="true" className="text-brand" />
              {label}
              <ArrowRight
                size={13}
                aria-hidden="true"
                className="text-ink-500 transition-transform group-hover:translate-x-0.5 group-hover:text-ink-950"
              />
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}
