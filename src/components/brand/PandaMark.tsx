import { PANDA_PATH, PANDA_VIEWBOX } from './pandaPath'

type Props = {
  className?: string
  /** Decorative by default — the wordmark next to it carries the accessible name. */
  title?: string
}

/**
 * Panda brand glyph, supplied by the site owner.
 *
 * The artwork is a single evenodd path, so the eye highlights and the hollow
 * nose are holes rather than white fills — meaning the glyph sits correctly on
 * any background and follows `currentColor`.
 *
 * Geometry lives in `pandaPath.ts`; see the note there before editing.
 */
export function PandaMark({ className, title }: Props) {
  return (
    <svg
      viewBox={PANDA_VIEWBOX}
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d={PANDA_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}
