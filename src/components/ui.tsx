import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

/* --------------------------------------------------------------------------
   Shared primitives. The visual rules live in `.btn` / `.card` / `.eyebrow`
   in index.css; these components only pick variants and sizes.
   -------------------------------------------------------------------------- */

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'inverse'
type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-ink-950 text-paper hover:bg-ink-800',
  accent: 'bg-bamboo-500 text-white hover:bg-bamboo-600',
  secondary: 'bg-white text-ink-900 border border-ink-200 hover:border-ink-400 hover:bg-ink-50',
  ghost: 'text-ink-700 hover:text-ink-950 hover:bg-ink-100',
  inverse: 'bg-paper text-ink-950 hover:bg-white',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-12 px-6 text-base',
}

type ButtonProps<T extends ElementType> = {
  as?: T
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>

export function Button<T extends ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps<T>) {
  const Tag = (as ?? 'button') as ElementType
  return (
    <Tag className={`btn ${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

/* -------------------------------------------------------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  tone = 'light',
}: {
  eyebrow: string
  title: string
  lead?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
}) {
  const dark = tone === 'dark'
  return (
    <div
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}
    >
      <p className={`eyebrow ${dark ? 'text-bamboo-300!' : ''}`}>
        <span
          aria-hidden="true"
          className={`h-px w-6 ${dark ? 'bg-bamboo-300/60' : 'bg-bamboo-500/50'}`}
        />
        {eyebrow}
      </p>
      <h2
        className={`mt-4 text-3xl leading-[1.12] font-semibold tracking-[-0.025em] text-balance sm:text-4xl lg:text-[2.75rem] ${
          dark ? 'text-paper' : 'text-ink-950'
        }`}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={`mt-5 text-base leading-relaxed sm:text-lg ${
            dark ? 'text-ink-300' : 'text-ink-600'
          }`}
        >
          {lead}
        </p>
      ) : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */

/** Neutral pill used for protocol names and brand text labels. */
export function Chip({
  children,
  tone = 'light',
}: {
  children: ReactNode
  tone?: 'light' | 'dark'
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-[0.8125rem] leading-none font-medium ${
        tone === 'dark'
          ? 'bg-white/8 text-ink-200 ring-1 ring-white/10'
          : 'bg-ink-50 text-ink-700 ring-1 ring-ink-200'
      }`}
    >
      {children}
    </span>
  )
}
