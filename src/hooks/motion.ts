import { useEffect, useRef, useState } from 'react'

/** Respects the OS "reduce motion" setting. Checked at call time, not cached,
 *  so toggling it in system settings takes effect on the next interaction. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Reveals `[data-reveal]` elements as they scroll into view.
 *
 * The hidden state is added *by this hook*, never in the markup — so if
 * JavaScript fails, or motion is reduced, the page renders fully visible
 * instead of blank. Each element is unobserved once shown; nothing re-hides
 * on scroll back up.
 */
export function useReveal() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (elements.length === 0) return

    for (const el of elements) el.classList.add('reveal-pending')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('reveal-in')
          observer.unobserve(entry.target)
        }
      },
      // Trigger a little before the element reaches the bottom edge, so the
      // motion finishes about when it is comfortably in view.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [])
}

/**
 * Eases a number towards `target` so readouts count rather than snap.
 * Interrupting mid-tween resumes from wherever it got to.
 */
export function useAnimatedNumber(target: number, duration = 600): number {
  const reduced = prefersReducedMotion()
  const [value, setValue] = useState(target)
  const currentRef = useRef(target)

  useEffect(() => {
    if (reduced) return

    const from = currentRef.current
    if (from === target) return

    const start = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - progress) ** 3
      const next = from + (target - from) * eased
      currentRef.current = next
      setValue(next)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, reduced])

  // With motion reduced the readout jumps straight to the value — no tween,
  // and no state write from inside the effect.
  return reduced ? target : value
}

/**
 * Tracks which section is currently in the middle of the viewport, for the
 * header's active-link state.
 */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join(',')

  useEffect(() => {
    const order = key.split(',')
    const elements = order
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    // Track the whole visible set rather than latching onto the last section
    // that fired — otherwise the highlight sticks after scrolling back to the
    // top, where no section is in the band and nothing should be marked.
    const visible = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        setActive(order.find((id) => visible.has(id)) ?? null)
      },
      // A thin band across the middle of the screen: whatever crosses it wins.
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [key])

  return active
}
