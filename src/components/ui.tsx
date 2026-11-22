import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

/* --------------------------------------------------------------------------
   Shared primitives — Tropical Monograph architectural system.
   Sharp micro-radii, deep forest primary buttons, hairline outlines,
   and editorial serif SectionHeading.
   -------------------------------------------------------------------------- */

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'inverse' | 'glow' | 'outlineDark'
type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-ink-950 text-paper border border-ink-950 hover:bg-brand hover:border-brand',
  accent:
    'bg-brand text-surface border border-brand hover:bg-ink-950 hover:border-ink-950',
  secondary:
    'bg-surface text-ink-950 border border-ink-950/24 hover:border-ink-950 hover:bg-white',
  ghost: 'text-ink-700 hover:text-ink-950 hover:bg-ink-950/[0.06]',
  inverse: 'bg-paper text-ink-950 border border-paper hover:bg-surface',
  /** Primary action on deep botanical forest bands: warm travertine cream with deep forest ink. */
  glow: 'bg-paper text-ink-950 border border-paper shadow-glow hover:bg-ember-300 hover:border-ember-300',
  /** Secondary action on deep forest bands: crisp warm hairline outline. */
  outlineDark:
    'border border-paper/30 bg-transparent text-paper hover:border-ember-300 hover:bg-paper/[0.08]',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-11 px-4 text-sm',
  md: 'h-12 px-5 text-[0.9375rem]',
  lg: 'h-[3.25rem] px-6 text-[0.9375rem]',
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

/** Corner caption tag for renders, illustrations and stock photos. Put inside a `relative` wrapper. */
export function PhotoTag({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`pointer-events-none absolute bottom-2.5 left-2.5 z-10 rounded-[2px] border border-paper/20 bg-ink-950/84 px-2 py-0.5 font-mono text-[0.625rem] leading-5 font-medium tracking-[0.08em] text-paper uppercase backdrop-blur-sm ${className}`}
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
        <p className={`eyebrow ${dark ? 'text-ember-300!' : ''}`}>
          {eyebrow}
        </p>
        <Heading
          className={`title-display mt-4 ${
            dark ? 'text-paper' : 'text-ink-950'
          }`}
        >
          {title}
        </Heading>
      </div>
      {lead ? (
        <p
          className={`text-lead mt-4 max-w-2xl sm:mt-5 ${
            split ? 'lg:mt-0 lg:border-l lg:border-ink-950/12 lg:pl-6 lg:text-[1.0625rem] ' : ''
          }${split && dark ? 'lg:border-paper/16! ' : ''}${
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

/** Crisp architectural spec chip for protocol names and brand text labels. */
export function Chip({
  children,
  tone = 'light',
}: {
  children: ReactNode
  tone?: 'light' | 'dark'
}) {
  return (
    <span
      className={`inline-flex items-center rounded-[2px] px-2.5 py-1.5 text-[0.8125rem] leading-none font-medium ${
        tone === 'dark'
          ? 'border border-paper/16 bg-paper/[0.06] text-paper/90'
          : 'border border-ink-950/15 bg-paper text-ink-800'
      }`}
    >
      {children}
    </span>
  )
}
