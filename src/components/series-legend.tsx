import { AREA_OPACITY, LEGEND_DASH, LINE_WIDTH } from "@/components/chart-style"

interface LegendSeries {
  key: string
  name: string
  color: string
}

/** Legend with color boxes for areas and line samples for lines. */
export function SeriesLegend({
  areas = [],
  lines = [],
}: {
  areas?: LegendSeries[]
  lines?: (LegendSeries & { dashed?: boolean })[]
}) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
      {areas.map((s) => (
        <li key={s.key} className="flex items-center gap-2">
          <AreaSwatch color={s.color} />
          {s.name}
        </li>
      ))}
      {lines.map((s) => (
        <li key={s.key} className="flex items-center gap-2">
          <LineSwatch color={s.color} dashed={s.dashed} />
          {s.name}
        </li>
      ))}
    </ul>
  )
}

export function AreaSwatch({ color }: { color: string }) {
  return (
    <span
      className="size-3 shrink-0 rounded-[2px]"
      style={{ backgroundColor: color, opacity: AREA_OPACITY }}
    />
  )
}

export function LineSwatch({
  color,
  dashed,
}: {
  color: string
  dashed?: boolean
}) {
  return (
    <svg width="26" height="4" className="shrink-0" aria-hidden>
      <line
        x1="0"
        y1="2"
        x2="26"
        y2="2"
        stroke={color}
        strokeWidth={LINE_WIDTH}
        strokeDasharray={dashed ? LEGEND_DASH : undefined}
      />
    </svg>
  )
}
