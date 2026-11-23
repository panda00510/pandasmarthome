/**
 * Central brand configuration.
 *
 * Every brand name, short name, tagline and logo asset the site renders is
 * resolved from here — swapping the brand means editing this one file plus
 * `src/components/brand/PandaMark.tsx` and `public/favicon.svg`.
 */

export const brand = {
  /** Full brand name. Used in the wordmark, footer, SEO title and JSON-LD. */
  name: 'Panda Smart',
  /** Chinese brand name. */
  nameZh: 'Panda 智能',
  /** Short form for tight spaces (mobile nav, favicon alt text). */
  shortName: 'Panda',
  shortNameZh: 'Panda',
  /** Two-letter/word mark fallback if the SVG mark fails to render. */
  initials: 'P',
  taglineEn: 'Smart AI hardware and local systems in Singapore',
  taglineZh: '新加坡智能 AI 硬件与本地化智能系统',
} as const

/**
 * Brand mark assets. The wordmark is rendered as live text (see
 * `Wordmark.tsx`) so it stays crisp and translatable; only the panda glyph is
 * an SVG. Replace `public/favicon.svg` and `public/og-image.svg` together with
 * `PandaMark.tsx` when a final identity is delivered.
 */
export const brandAssets = {
  favicon: '/favicon.svg',
  appleTouchIcon: '/apple-touch-icon.png',
  /** Raster card — social platforms do not render SVG. Built by `npm run og`. */
  ogImage: '/og-image.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  webmanifest: '/site.webmanifest',
} as const
