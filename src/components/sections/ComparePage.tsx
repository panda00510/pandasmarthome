import { ArrowRight } from 'lucide-react'
import { PageCta } from '../PageCta'
import { pageHref, useI18n } from '../../i18n/context'

/**
 * /compare/: the four desk devices side by side, then which service fits.
 * Copy is in content `compare`; device names come from `products.items`
 * (same ids). No prices here: they stay on the product and service pages.
 */
export function ComparePage() {
  const { t, lang } = useI18n()
  const c = t.compare
  const names = Object.fromEntries(t.products.items.map((item) => [item.id, item.short]))
  const rows = Object.keys(c.rows) as (keyof typeof c.rows)[]

  return (
    <article className="shell page-head pb-16 lg:pb-24">
      <p className="eyebrow">
        {c.eyebrow}
      </p>
      <h1 className="mt-5 max-w-4xl title-display text-ink-950">
        {c.title}
      </h1>
      <p className="mt-4 max-w-2xl text-lead text-ink-600">{c.lead}</p>

      <section aria-labelledby="devices" className="mt-12">
        <h2 id="devices" className="scroll-mt-24 text-[1.5rem] font-semibold tracking-[-0.02em] text-ink-950">
          {c.devicesTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-[1.0625rem] leading-[1.65] text-ink-700">{c.devicesLead}</p>

        {/* The table scrolls sideways on its own on a phone; the page does not. */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-200 bg-white">
          <table className="w-full min-w-[44rem] border-collapse text-left text-[0.9375rem] leading-snug">
            <thead>
              <tr className="border-b border-ink-200 bg-paper">
                <td className="w-[16%] p-4" />
                {c.devices.map((device) => (
                  <th key={device.id} scope="col" className="p-4 font-semibold text-ink-950">
                    {names[device.id]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row} className="border-b border-ink-200/70 last:border-0">
                  <th scope="row" className="p-4 align-top text-sm font-medium text-ink-600">
                    {c.rows[row]}
                  </th>
                  {c.devices.map((device) => (
                    <td key={device.id} className="p-4 align-top text-ink-800">
                      {device[row]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-4 space-y-1 text-sm leading-relaxed text-ink-600">
          {c.devicesNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <a
          href={pageHref(lang, 'products/')}
          className="link-more mt-3 hover:text-bamboo-600"
        >
          {c.devicesLink}
          <ArrowRight size={15} aria-hidden="true" />
        </a>
      </section>

      <section aria-labelledby="services" className="mt-16">
        <h2 id="services" className="scroll-mt-24 text-[1.5rem] font-semibold tracking-[-0.02em] text-ink-950">
          {c.servicesTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-[1.0625rem] leading-[1.65] text-ink-700">{c.servicesLead}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {c.services.map((service) => (
            <div key={service.id} className="card flex flex-col">
              <h3 className="text-lg font-semibold text-ink-950">{service.title}</h3>
              <dl className="mt-3 flex-1 space-y-3 text-[0.9375rem] leading-relaxed">
                {(['fits', 'get', 'quote'] as const).map((key) => (
                  <div key={key}>
                    <dt className="text-xs font-semibold tracking-wider text-bamboo-700 uppercase">{c.labels[key]}</dt>
                    <dd className="mt-0.5 text-ink-700">{service[key]}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={pageHref(lang, service.path)}
                className="link-more mt-4 hover:text-bamboo-600"
              >
                {c.labels.more}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          ))}
        </div>
      </section>
      <PageCta className="mt-14 lg:mt-20" />
    </article>
  )
}
