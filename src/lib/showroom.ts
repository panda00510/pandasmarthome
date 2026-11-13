import type { Lang } from '../i18n/context'

/**
 * Link to the 3D showroom (a separate build), optionally opening one floor
 * plan. Chinese has its own URL, /showroom/zh/, so link previews get the
 * Chinese card; English keeps ?lang=en so a visitor who last chose Chinese in
 * the showroom still lands in the language of the page they came from.
 * BASE_URL keeps it right on both hosts.
 */
export function showroomHref(lang: Lang, plan?: string) {
  const query = [lang === 'en' && 'lang=en', plan && `plan=${plan}`].filter(Boolean).join('&')
  return `${import.meta.env.BASE_URL}showroom/${lang === 'zh' ? 'zh/' : ''}${query && `?${query}`}`
}
