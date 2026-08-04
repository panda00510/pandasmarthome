import { useId } from 'react'

type Props = {
  className?: string
  /** Decorative by default — the wordmark next to it carries the accessible name. */
  title?: string
}

/**
 * Panda brand glyph.
 *
 * Deliberately geometric and reductive: two ear discs, a thin head ring and two
 * angled eye patches. No mouth, no nose, no cartoon face — it should read as a
 * mark at 16px in a browser tab and still sit comfortably next to a premium
 * residential wordmark.
 *
 * Renders entirely in `currentColor`; the eyes are punched out with a mask so
 * the glyph works on any background, light or dark.
 */
export function PandaMark({ className, title }: Props) {
  const maskId = useId()

  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
        <rect x="0" y="0" width="40" height="40" fill="#fff" />
        <circle cx="14.6" cy="20.6" r="1.85" fill="#000" />
        <circle cx="25.4" cy="20.6" r="1.85" fill="#000" />
      </mask>

      <g mask={`url(#${maskId})`} fill="currentColor">
        {/* Ears */}
        <circle cx="10.4" cy="10.6" r="5" />
        <circle cx="29.6" cy="10.6" r="5" />
        {/* Head ring */}
        <circle cx="20" cy="22.4" r="13.2" fill="none" stroke="currentColor" strokeWidth="2.6" />
        {/* Eye patches, angled inward */}
        <ellipse cx="14.3" cy="20.4" rx="4.05" ry="5.35" transform="rotate(-20 14.3 20.4)" />
        <ellipse cx="25.7" cy="20.4" rx="4.05" ry="5.35" transform="rotate(20 25.7 20.4)" />
      </g>
    </svg>
  )
}
