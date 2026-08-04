import { useId } from 'react'

type Props = {
  className?: string
  /** Decorative by default — the wordmark next to it carries the accessible name. */
  title?: string
}

/**
 * Panda brand glyph.
 *
 * Three features do the work of making this read as a panda rather than a
 * generic animal, and all three matter at 16px:
 *   1. ears large and set wide, breaking the head silhouette
 *   2. eye patches tilted inward-down, not upright ovals
 *   3. a nose, closing the eye/nose triangle the eye actually looks for
 *
 * Still deliberately reductive — no mouth, no cheeks, no cartoon face — so it
 * sits next to a premium residential wordmark without turning juvenile.
 *
 * Renders entirely in `currentColor`; the eye highlights are punched out with
 * a mask so the glyph works on any background, light or dark.
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
        {/* Eye highlights, set toward the nose so the gaze converges. */}
        <circle cx="14.7" cy="20.4" r="1.15" fill="#000" />
        <circle cx="25.3" cy="20.4" r="1.15" fill="#000" />
      </mask>

      <g mask={`url(#${maskId})`} fill="currentColor">
        {/* Ears — set wide and clearly proud of the head silhouette. */}
        <circle cx="10.6" cy="10.4" r="5.2" />
        <circle cx="29.4" cy="10.4" r="5.2" />

        {/* Head outline. The face itself is the page behind it — a panda is
            dark markings on a light face, so the glyph paints only markings. */}
        <circle
          cx="20"
          cy="21.9"
          r="13.1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
        />

        {/* Eye patches — kept small and pushed outward so they read as
            markings, not as eyes. The inward tilt is the panda signature. */}
        <ellipse cx="14.1" cy="20.1" rx="3.3" ry="4.3" transform="rotate(-30 14.1 20.1)" />
        <ellipse cx="25.9" cy="20.1" rx="3.3" ry="4.3" transform="rotate(30 25.9 20.1)" />

        {/* Nose — closes the eye/nose triangle the eye looks for. */}
        <path d="M18.35 25.4 Q20 24.75 21.65 25.4 Q20 27.9 18.35 25.4 Z" />
      </g>
    </svg>
  )
}
