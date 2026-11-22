import type { ReactNode } from 'react'
import { PhotoTag } from './ui'

/**
 * A large picture card on ink for the first capabilities on the custom
 * hardware and signage pages: a drawing on top, the text on the fade below,
 * the same frame as the homepage art cards. `tag` labels the drawing.
 */
export function FeatureCard({ art, tag, title, body, items }: { art: ReactNode; tag: string; title: string; body: string; items: string[] }) {
  return (
    <li data-reveal className="flex">
      <div className="media-card art-card w-full p-6 lg:p-8">
        <PhotoTag className="top-3! bottom-auto! left-3!">{tag}</PhotoTag>
        <div aria-hidden="true" className="flex min-h-48 flex-1 items-center justify-center pt-8 pb-6 sm:min-h-60">
          {art}
        </div>
        <h3 className="text-xl font-semibold tracking-[-0.015em] text-paper lg:text-2xl">{title}</h3>
        <p className="mt-2 max-w-lg text-[0.9375rem] leading-relaxed text-ink-200">{body}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item} className="rounded-full bg-white/8 px-3 py-1.5 text-[0.8125rem] font-medium text-ink-100 ring-1 ring-white/12">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}
