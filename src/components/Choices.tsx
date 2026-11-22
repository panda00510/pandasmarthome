import type { ReactNode } from 'react'

/** Crisp rectangular architectural choice button; native input stays in DOM for accessibility. */
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
    <label className="inline-flex min-h-11 cursor-pointer items-center rounded-[3px] border border-ink-950/20 bg-paper px-4 text-sm font-medium text-ink-800 transition-all hover:border-ink-950/50 hover:bg-surface hover:text-ink-950 has-checked:border-ink-950 has-checked:bg-ink-950 has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand">
      <input
        type={type}
        name={name}
        value={value}
        className="sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {children}
    </label>
  )
}

/** One question: a fieldset with its legend, optional step numeral, optional help line and a row of Choice tiles. */
export function Choices({
  legend,
  help,
  step,
  children,
}: {
  legend: string
  help?: string
  step?: string
  children: ReactNode
}) {
  return (
    <fieldset>
      <legend className="flex items-center gap-2.5 text-[0.9375rem] font-semibold text-ink-950">
        {step ? <span className="numeral text-xs font-semibold text-ember-500">{step}</span> : null}
        <span>{legend}</span>
      </legend>
      {help ? <p className="mt-1 text-sm text-ink-600">{help}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  )
}
