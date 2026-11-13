import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

/* --------------------------------------------------------------------------
   Shared primitives. The visual rules live in `.btn` / `.card` / `.eyebrow`
   in index.css; these components only pick variants and sizes.
   -------------------------------------------------------------------------- */

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'inverse' | 'glow' | 'outlineDark'
type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-bamboo-800',
  accent: 'bg-brand text-white hover:bg-bamboo-800',
  secondary: 'bg-transparent text-ink-900 border border-ink-300 hover:border-ink-500 hover:bg-white',
  ghost: 'text-ink-700 hover:text-ink-950 hover:bg-ink-100',
  inverse: 'bg-paper text-ink-950 hover:bg-white',
  /** Main action on an ink band: bright green, dark text (contrast ≈ 7:1). */
  glow: 'bg-bamboo-400 text-ink-950 shadow-glow hover:bg-bamboo-300',
  /** Secondary action on an ink band. */
  outlineDark: 'border border-white/20 text-paper hover:border-white/45 hover:bg-white/8',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-11 px-4 text-sm',
  md: 'h-12 px-5 text-[0.9375rem]',
  lg: 'h-13 px-7 text-base',
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
  level = 2,
  split = false,
}: {
  eyebrow: string
  title: string
  lead?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  /** Hide the lead paragraph below 640px so a section's heading stays short on a phone. */
  shortOnPhone?: boolean
  /** 1 when this heading is the page title (index pages). */
  level?: 1 | 2
  /** Full width with the lead beside the title from 1024px: a shorter heading for wide sections. */
  split?: boolean
}) {
  const dark = tone === 'dark'
  const Heading = level === 1 ? 'h1' : 'h2'
  return (
    <div
      data-reveal
      className={`${split ? 'lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-x-16' : 'max-w-3xl'} ${
        align === 'center' ? 'mx-auto text-center' : ''
      }`}
    >
      <div>
      <p className={`eyebrow ${dark ? 'text-bamboo-300!' : ''}`}>
        <span
          aria-hidden="true"
          className={`h-px w-6 ${dark ? 'bg-bamboo-300/60' : 'bg-bamboo-500/50'}`}
        />
        {eyebrow}
      </p>
      <Heading
        className={`mt-5 text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[2.75rem] sm:leading-[1.06] lg:text-[3.5rem] ${
          dark ? 'text-paper' : 'text-ink-950'
        }`}
      >
        {title}
      </Heading>
      </div>
      {lead ? (
        <p
          className={`mt-4 max-w-2xl text-base leading-relaxed sm:mt-6 sm:text-lg lg:text-xl lg:leading-relaxed ${
            split ? 'lg:mt-0 lg:pb-1.5 lg:text-lg ' : ''
          }${
            shortOnPhone ? 'hidden sm:block ' : ''
          }${dark ? 'text-ink-300' : 'text-ink-600'}`}
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
