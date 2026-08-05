import { useId } from 'react'

type Props = {
  className?: string
  /** Decorative by default — the wordmark next to it carries the accessible name. */
  title?: string
}

/**
 * Panda brand glyph.
 *
 * Redrawn as vector from the supplied reference so it scales cleanly from a
 * 16px favicon to the 1200px share card, and inherits `currentColor` instead
 * of being locked to one palette.
 *
 * The eye highlights and the nose ring are punched out with a mask rather
 * than painted white, so the glyph sits correctly on any background.
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
        {/* Eye whites */}
        <circle cx="14.7" cy="22.3" r="2.6" fill="#000" />
        <circle cx="25.3" cy="22.3" r="2.6" fill="#000" />
        {/* Hollow centre of the nose ring */}
        <ellipse cx="20" cy="28.5" rx="1.7" ry="0.75" fill="#000" />
      </mask>

      <g mask={`url(#${maskId})`} fill="currentColor">
        {/* Ears — large, tilted outward, tucked behind the head. */}
        <ellipse cx="9.2" cy="10.2" rx="5.5" ry="6.1" transform="rotate(-22 9.2 10.2)" />
        <ellipse cx="30.8" cy="10.2" rx="5.5" ry="6.1" transform="rotate(22 30.8 10.2)" />

        {/* Head */}
        <ellipse
          cx="20"
          cy="22.6"
          rx="14"
          ry="12.9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
        />

        {/* Eye patches */}
        <ellipse cx="13.4" cy="21.2" rx="5.1" ry="6.3" transform="rotate(-16 13.4 21.2)" />
        <ellipse cx="26.6" cy="21.2" rx="5.1" ry="6.3" transform="rotate(16 26.6 21.2)" />

        {/* Nose ring — its centre is removed by the mask above. */}
        <ellipse
          cx="20"
          cy="28.5"
          rx="2.9"
          ry="1.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
        />
        {/* Philtrum and mouth */}
        <rect x="19.32" y="29.5" width="1.36" height="3.3" rx="0.6" />
        <rect x="16.85" y="32.2" width="6.3" height="1.35" rx="0.65" />
      </g>

      {/* Pupils sit on top of the punched-out eye whites. */}
      <g fill="currentColor">
        <circle cx="15.3" cy="22.9" r="1.15" />
        <circle cx="24.7" cy="22.9" r="1.15" />
      </g>
    </svg>
  )
}
