import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

/* --------------------------------------------------------------------------
   Shared primitives. The visual rules live in `.btn` / `.card` / `.eyebrow`
   in index.css; these components only pick variants and sizes.
   -------------------------------------------------------------------------- */

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'inverse'
type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-bamboo-800',
  accent: 'bg-brand text-white hover:bg-bamboo-800',
  secondary: 'bg-transparent text-ink-900 border border-ink-300 hover:border-ink-500 hover:bg-white',
  ghost: 'text-ink-700 hover:text-ink-950 hover:bg-ink-100',
  inverse: 'bg-paper text-ink-950 hover:bg-white',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-11 px-4 text-sm',
  md: 'h-12 px-5 text-[0.9375rem]',
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

/** Corner label for stock photos. Put inside a `relative` wrapper. */
export function PhotoTag({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`pointer-events-none absolute bottom-2 left-2 z-10 rounded-full bg-ink-950/65 px-2.5 py-0.5 text-[0.6875rem] leading-5 font-medium text-white backdrop-blur-sm ${className}`}
    >
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  tone = 'light',
  shortOnPhone = false,
}: {
  eyebrow: string
  title: string
  lead?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  /** Hide the lead paragraph below 640px so a section's heading stays short on a phone. */
  shortOnPhone?: boolean
}) {
  const dark = tone === 'dark'
  return (
    <div
      data-reveal
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
        className={`mt-4 text-[1.75rem] leading-[1.15] font-semibold tracking-[-0.025em] text-balance sm:text-4xl lg:text-[2.5rem] ${
          dark ? 'text-paper' : 'text-ink-950'
        }`}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={`mt-4 text-base leading-relaxed sm:mt-5 sm:text-lg ${
            shortOnPhone ? 'hidden sm:block ' : ''
          }${dark ? 'text-[#c7cdd2]' : 'text-ink-600'}`}
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
