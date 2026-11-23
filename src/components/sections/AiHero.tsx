import { useState } from 'react'
import { ArrowRight, Check, Cpu } from 'lucide-react'
import { ProductArt } from '../graphics/ProductFigures'
import { Button, PhotoTag } from '../ui'
import { pageHref, useI18n } from '../../i18n/context'

function formatPrice(template: string, amount: number) {
  return template.replaceAll('{amount}', `S$${amount}`)
}

/**
 * Smart AI Hardware Hero — Precision Hardware Atelier.
 * Shares one exact 1.34fr / 1fr architectural column axis across both rows
 * (headline split + interactive hardware exhibition stage & selector console)
 * so every edge and vertical divider aligns to 0.00px across desktop viewports.
 */
export function AiHero() {
  const { t, lang } = useI18n()
  const h = t.aiHome
  const p = t.products
  const [selected, setSelected] = useState(0)
  const active = p.items[selected] ?? p.items[0]
  const activePrice = formatPrice(p.priceFrom, active.priceSgd)

  return (
    <section id="top" className="relative bg-paper text-ink-950">
      {/* Top engineering specification bar */}
      <div className="border-b border-ink-950/12">
        <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
          <p className="eyebrow">{h.eyebrow}</p>
          <p className="inline-flex items-center gap-2 font-mono text-[0.71875rem] font-medium tracking-[0.08em] text-ink-600 uppercase">
            <Cpu size={13} aria-hidden="true" className="text-brand" />
            <span>{h.specBar}</span>
          </p>
        </div>
      </div>

      {/* Editorial headline split */}
      <div className="shell pt-8 pb-10 sm:pt-11 sm:pb-12 lg:pt-13 lg:pb-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.34fr)_minmax(0,1fr)] lg:items-start lg:gap-6">
          <div className="lg:pr-6">
            <h1
              className={`font-display text-ink-950 ${
                lang === 'zh'
                  ? 'text-[2.375rem] leading-[1.12] font-medium tracking-[-0.015em] sm:text-[3.375rem] lg:text-[3.75rem] xl:text-[4.25rem]'
                  : 'text-[2.625rem] leading-[1.03] font-normal tracking-[-0.025em] sm:text-[3.75rem] lg:text-[4rem] xl:text-[4.625rem]'
              }`}
            >
              {h.titleLead}
              {lang === 'zh' ? <br /> : ' '}
              <span className={lang === 'zh' ? 'text-brand' : 'italic text-brand'}>
                {h.titleAccent}
              </span>
            </h1>
          </div>

          <div className="min-w-0 lg:border-l lg:border-ink-950/14 lg:pl-6">
            <p className="text-[0.98rem] leading-[1.68] text-ink-700 sm:text-[1.03125rem]">
              {h.lead}
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
              <Button as="a" href="#contact" variant="primary" size="md" className="w-full sm:w-auto">
                {h.primaryCta}
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
              <Button as="a" href={pageHref(lang, 'products/')} variant="secondary" size="md" className="w-full sm:w-auto">
                {h.secondaryCta}
                <ArrowRight size={15} aria-hidden="true" className="text-ember-500" />
              </Button>
            </div>

            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink-600 sm:text-[0.8125rem]">
              <Check size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
              <span>{h.ctaNote}</span>
            </p>
          </div>
        </div>

        {/* Interactive AI Hardware Exhibition Plate + Selector Console (exact 1.34fr / 1fr axis) */}
        <div className="mt-8 grid gap-4 sm:mt-10 lg:grid-cols-[minmax(0,1.34fr)_minmax(0,1fr)] lg:items-stretch lg:gap-6">
          <figure className="plate-frame flex flex-col">
            <div className="art-stage relative aspect-[16/10] w-full flex-1 overflow-hidden rounded-[2px] border border-ink-950/10">
              <span
                aria-hidden="true"
                className="numeral absolute top-3 right-3.5 z-10 rounded-[2px] border border-ink-950/14 bg-surface/90 px-2 py-0.5 text-[0.65rem] font-semibold text-ink-700"
              >
                SPEC {String(selected + 1).padStart(2, '0')} · {activePrice}
              </span>
              <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-8 lg:p-10">
                <div className="h-full max-h-[20rem] w-full max-w-[26rem]">
                  <ProductArt id={active.id} lang={lang} />
                </div>
              </div>
              <PhotoTag className="top-3! bottom-auto! left-3!">{p.illustration}</PhotoTag>
            </div>

            <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-1.5 pt-2.5 pb-1 text-xs text-ink-600">
              <span className="inline-flex items-center gap-2 font-medium text-ink-950">
                <span className="numeral text-[0.6875rem] font-semibold text-ember-500">
                  {String(selected + 1).padStart(2, '0')}
                </span>
                <span>{active.title}</span>
              </span>
              <span className="text-ink-600">{h.showcaseCaption}</span>
            </figcaption>
          </figure>

          {/* Matte-stone & brass interactive hardware selector console */}
          <div className="flex h-full flex-col rounded-panel border border-ink-950/18 bg-surface p-4 text-ink-950 shadow-soft sm:p-5">
            <div className="flex items-start justify-between gap-3 border-b border-ink-950/12 pb-3.5">
              <div className="min-w-0">
                <p className="font-mono text-[0.6875rem] font-semibold tracking-[0.14em] text-ember-500 uppercase">
                  {h.showcaseEyebrow}
                </p>
                <p className="mt-1 font-display text-lg leading-snug font-medium text-ink-950">
                  {active.title}
                </p>
              </div>
              <span className="shrink-0 rounded-[2px] border border-brand/25 bg-bamboo-50 px-2 py-1 font-mono text-[0.65rem] font-semibold text-brand uppercase">
                {p.status}
              </span>
            </div>

            <ul className="mt-3.5 space-y-2" role="group" aria-label={h.showcaseEyebrow}>
              {p.items.map((item, i) => {
                const on = i === selected
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(i)}
                      aria-pressed={on}
                      className={`flex min-h-[3.125rem] w-full cursor-pointer items-center justify-between gap-3 rounded-[3px] border px-3 py-2 text-left transition-all duration-200 ${
                        on
                          ? 'border-ink-950 bg-ink-950 text-paper'
                          : 'border-ink-950/14 bg-paper text-ink-900 hover:border-ink-950/38 hover:bg-surface'
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={`numeral text-[0.6875rem] font-semibold ${
                            on ? 'text-ember-300' : 'text-ember-500'
                          }`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="truncate text-sm font-semibold">{item.short}</span>
                      </span>
                      <span
                        className={`shrink-0 font-mono text-xs font-semibold tabular-nums ${
                          on ? 'text-ember-300' : 'text-brand'
                        }`}
                      >
                        {formatPrice(p.priceFrom, item.priceSgd)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <p className="mt-3.5 text-sm leading-relaxed text-ink-600">
              {active.summary}
            </p>

            <ul className="mt-3 flex flex-wrap gap-1.5">
              {active.specs.slice(0, 3).map((spec) => (
                <li
                  key={spec}
                  className="rounded-[2px] border border-ink-950/12 bg-paper px-2.5 py-1 text-xs font-medium text-ink-800"
                >
                  {spec}
                </li>
              ))}
            </ul>

            <div className="mt-auto border-t border-ink-950/12 pt-3.5">
              <a
                href={`${pageHref(lang, 'products/')}#${active.id}`}
                className="link-more min-h-0 text-sm hover:text-ink-950"
              >
                {h.viewDeviceCta}
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Four-column architectural hardware trust ledger */}
        <ul className="mt-9 grid grid-cols-2 border-y border-ink-950/14 sm:mt-11 lg:grid-cols-4">
          {h.trust.map((item, i) => (
            <li
              key={item}
              className={`py-4 pr-4 lg:py-5 lg:pr-7 ${i > 0 ? 'lg:border-l lg:border-ink-950/12 lg:pl-7' : ''} ${
                i % 2 === 1 ? 'border-l border-ink-950/12 pl-4 lg:pl-7' : ''
              } ${i >= 2 ? 'border-t border-ink-950/12 lg:border-t-0' : ''}`}
            >
              <span className="numeral block text-[0.6875rem] font-semibold text-ember-500">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="mt-1.5 block text-[0.9375rem] leading-snug font-medium text-ink-950">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
