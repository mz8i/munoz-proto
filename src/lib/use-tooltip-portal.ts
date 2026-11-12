import { useEffect, useState } from "react"

/** Below Tailwind's sm breakpoint, where a tooltip would cover most of a chart. */
const NARROW_QUERY = "(max-width: 639px)"

/**
 * On narrow screens, charts show their tooltip below the chart instead of on
 * top of it. Returns the element to pass to the tooltip's portal, undefined on
 * wider screens so the tooltip floats over the chart as usual, and a callback
 * ref for the element to show it in.
 */
export function useTooltipPortal() {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const [narrow, setNarrow] = useState(
    () => window.matchMedia(NARROW_QUERY).matches
  )

  useEffect(() => {
    const query = window.matchMedia(NARROW_QUERY)
    const onChange = () => setNarrow(query.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  return [narrow ? element : undefined, setElement] as const
}
