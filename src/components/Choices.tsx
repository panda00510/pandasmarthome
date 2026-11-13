import type { ReactNode } from 'react'

/** A pill-shaped radio or checkbox; the native input stays in the DOM (keyboard, forms, screen readers). */
export function Choice({
  type,
  name,
  value,
  checked,
  onChange,
  children,
}: {
  type: 'radio' | 'checkbox'
  name: string
  value: string
  checked: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
}) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-ink-300 px-4 text-sm font-medium text-ink-700 transition-colors hover:border-ink-500 hover:bg-white has-checked:border-brand has-checked:bg-brand has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink-950">
      <input type={type} name={name} value={value} className="sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {children}
    </label>
  )
}

/** One question: a fieldset with its legend, optional help line and a row of Choice pills. */
export function Choices({ legend, help, children }: { legend: string; help?: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink-900">{legend}</legend>
      {help ? <p className="mt-1 text-sm text-ink-600">{help}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  )
}
