import { PandaMark } from './PandaMark'
import { brand } from '../../config/brand'
import { useI18n } from '../../i18n/context'

type Props = {
  className?: string
  /** Hide the text on very narrow layouts and keep only the glyph. */
  compact?: boolean
}

/**
 * The brand lockup: glyph + live-text editorial serif wordmark.
 */
export function Wordmark({ className, compact = false }: Props) {
  const { lang } = useI18n()
  const name = lang === 'zh' ? brand.nameZh : brand.name

  return (
    <span className={`inline-flex min-w-0 items-center gap-2.5 ${className ?? ''}`}>
      <PandaMark className="h-7 w-7 shrink-0" />
      <span
        className={`font-display min-w-0 truncate text-[1.0625rem] leading-none font-medium tracking-[-0.01em] sm:text-[1.125rem] ${
          compact ? 'hidden sm:inline' : ''
        }`}
      >
        {name}
      </span>
    </span>
  )
}
