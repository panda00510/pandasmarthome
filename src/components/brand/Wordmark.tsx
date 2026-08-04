import { PandaMark } from './PandaMark'
import { brand } from '../../config/brand'
import { useI18n } from '../../i18n/context'

type Props = {
  className?: string
  /** Hide the text on very narrow layouts and keep only the glyph. */
  compact?: boolean
}

/**
 * The brand lockup: glyph + live-text wordmark.
 *
 * The wordmark is real text rather than an image so it stays crisp at every
 * size, respects the user's font settings and can carry the Chinese name.
 */
export function Wordmark({ className, compact = false }: Props) {
  const { lang } = useI18n()
  const name = lang === 'zh' ? brand.nameZh : brand.name

  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <PandaMark className="h-8 w-8 shrink-0" />
      <span
        className={`text-[0.98rem] leading-none font-semibold tracking-[-0.015em] whitespace-nowrap ${
          compact ? 'hidden sm:inline' : ''
        }`}
      >
        {name}
      </span>
    </span>
  )
}
