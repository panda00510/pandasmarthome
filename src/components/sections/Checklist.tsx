import { ArrowLeft, Printer } from 'lucide-react'
import { brand } from '../../config/brand'
import { site } from '../../config/site'
import { langPath, pageHref, useI18n } from '../../i18n/context'
import { Button } from '../ui'

/**
 * /renovation-checklist/: a one-page sheet to print for the ID and electrician.
 * Copy is in content/<lang>.ts (`checklist`); print layout is in index.css
 * (`@media print`, `.checklist`). Ticks are not saved anywhere, on purpose.
 */

const COLUMNS = ['control', 'power', 'network'] as const

/** Blank lines to write on. */
function WriteIn({ lines }: { lines: number }) {
  return Array.from({ length: lines }, (_, i) => (
    <span key={i} aria-hidden="true" className="write-in block h-6 border-b border-dashed border-ink-300" />
  ))
}

function Tick({ children }: { children: string }) {
  return (
    <label className="flex items-start gap-2 py-0.5">
      <input type="checkbox" className="mt-1 size-3.5 shrink-0 accent-bamboo-600" />
      <span>{children}</span>
    </label>
  )
}

export function ChecklistPage() {
  const { t, lang } = useI18n()
  const c = t.checklist
  const host = site.url ? new URL(site.url).host : null

  return (
    <article className="checklist shell pt-8 pb-14 lg:pt-12">
      <div className="print:hidden">
        <a
          href={pageHref(lang, 'guides/')}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-bamboo-700"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          {t.guides.all}
        </a>
      </div>

      <p className="eyebrow mt-4 print:hidden">
        <span aria-hidden="true" className="h-px w-6 bg-bamboo-500/50" />
        {c.eyebrow}
      </p>
      <h1 className="mt-4 text-[1.875rem] leading-[1.15] font-semibold tracking-[-0.03em] text-balance text-ink-950 sm:text-[2.5rem]">
        {c.title}
      </h1>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-700 sm:text-lg">{c.lead}</p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 print:hidden">
        <Button type="button" size="lg" onClick={() => window.print()} className="w-full sm:w-auto">
          <Printer size={17} aria-hidden="true" />
          {c.print}
        </Button>
        <p className="text-sm text-ink-500">{c.printNote}</p>
      </div>

      <dl className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
        {c.fields.map((field) => (
          <div key={field} className="flex items-end gap-2">
            <dt className="shrink-0 text-sm font-medium text-ink-700">{field}</dt>
            <dd className="h-6 flex-1 border-b border-ink-300" />
          </div>
        ))}
      </dl>

      <table className="mt-8 block w-full border-collapse text-left text-sm leading-snug text-ink-800 md:table print:table">
        <thead className="hidden md:table-header-group print:table-header-group">
          <tr>
            <th scope="col" className="w-[14%] border-b-2 border-ink-900 py-2 pr-3 font-semibold text-ink-950">
              {c.columns.room}
            </th>
            {COLUMNS.map((col) => (
              <th key={col} scope="col" className="w-[28.6%] border-b-2 border-ink-900 px-3 py-2 font-semibold text-ink-950">
                {c.columns[col]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="block md:table-row-group print:table-row-group">
          {c.rows.map((row) => (
            <tr
              key={row.room}
              className="mt-4 block rounded-card border border-ink-200 p-4 md:mt-0 md:table-row md:rounded-none md:border-0 md:border-b md:p-0 print:table-row print:border-0 print:border-b print:p-0"
            >
              <th
                scope="row"
                className="block pb-1 align-top text-base font-semibold text-ink-950 md:table-cell md:py-3 md:pr-3 md:text-sm print:table-cell print:py-2 print:pr-3 print:text-sm"
              >
                {row.room}
              </th>
              {COLUMNS.map((col) => (
                <td
                  key={col}
                  className="block pt-3 align-top md:table-cell md:px-3 md:py-3 print:table-cell print:px-3 print:py-2"
                >
                  <span className="mb-1 block text-xs font-semibold tracking-wide text-bamboo-700 uppercase md:hidden print:hidden">
                    {c.columns[col].split(/[:：]/)[0]}
                  </span>
                  {row[col].map((item) => (
                    <Tick key={item}>{item}</Tick>
                  ))}
                  <WriteIn lines={row[col].length ? 1 : 2} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <section className="final mt-10 rounded-card bg-bamboo-50 p-5 ring-1 ring-bamboo-100 print:mt-5 print:p-3">
        <h2 className="text-lg font-semibold text-ink-950 print:text-base">{c.finalTitle}</h2>
        <ol className="mt-3 grid gap-x-6 gap-y-1 text-sm text-ink-800 md:grid-cols-2">
          {c.final.map((item) => (
            <li key={item}>
              <Tick>{item}</Tick>
            </li>
          ))}
        </ol>
      </section>

      <ul className="mt-6 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-600 print:mt-3 print:text-xs">
        {c.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>

      <nav aria-labelledby="checklist-sources" className="mt-10 border-t border-ink-200 pt-6 print:hidden">
        <h2 id="checklist-sources" className="text-sm font-semibold tracking-wide text-ink-500 uppercase">
          {c.sourcesTitle}
        </h2>
        <ul className="mt-3 grid gap-x-6 gap-y-2 text-[0.9375rem] sm:grid-cols-2 lg:grid-cols-3">
          {c.sources.map((source) => (
            <li key={source.path}>
              <a
                href={pageHref(lang, source.path)}
                className="font-medium text-bamboo-700 underline decoration-bamboo-300 underline-offset-2 hover:decoration-bamboo-600"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-8 border-t border-ink-200 pt-3 text-xs text-ink-500 print:mt-4">
        {lang === 'zh' ? brand.nameZh : brand.name}
        {host ? ` · ${host}${langPath(lang, 'renovation-checklist/')}` : null}
      </p>
    </article>
  )
}
