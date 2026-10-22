import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** Shared building blocks for the custom chart tooltips. */

export type TooltipRow = Record<string, number | null>

/** Props Recharts passes into a custom tooltip element when rendering it. */
export interface TooltipContentProps {
  active?: boolean
  payload?: { payload?: TooltipRow }[]
}

export function TooltipFrame({
  title,
  className,
  children,
}: {
  title: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "grid gap-3 rounded-lg border border-border/50 bg-background px-3 py-2.5 text-xs shadow-xl",
        className
      )}
    >
      <div className="font-medium">{title}</div>
      {children}
    </div>
  )
}

/**
 * A swatch, a name and a value. Long names wrap, staying aligned to their
 * own left edge rather than wrapping under the swatch.
 */
export function TooltipSeriesRow({
  swatch,
  name,
  children,
}: {
  swatch: ReactNode
  name: string
  children: ReactNode
}) {
  return (
    <li className="flex items-start gap-2 leading-4">
      {/* Same height as one line of text, so the swatch centres on the first line */}
      <span className="flex h-4 shrink-0 items-center">{swatch}</span>
      <span className="min-w-0 flex-1 text-muted-foreground">{name}</span>
      <span className="ml-4 shrink-0 whitespace-nowrap">{children}</span>
    </li>
  )
}

/** A number with its unit de-emphasised. */
export function TooltipValue({ value, unit }: { value: string; unit: string }) {
  return (
    <span className="font-mono font-medium text-foreground tabular-nums">
      {value}
      <span className="ml-1 font-normal text-muted-foreground">{unit}</span>
    </span>
  )
}
