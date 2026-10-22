import {
  TooltipFrame,
  TooltipSeriesRow,
  TooltipValue,
  type TooltipContentProps,
} from "@/components/chart-tooltip"
import { LineSwatch } from "@/components/series-legend"

interface Series {
  key: string
  name: string
  color: string
}

/** Tooltip for the shares charts; long series names wrap within a fixed width. */
export function SharesTooltip({
  active,
  payload,
  lines,
}: TooltipContentProps & { lines: Series[] }) {
  const row = payload?.[0]?.payload
  if (!active || !row) return null

  return (
    <TooltipFrame title={row.year} className="w-72">
      <ul className="grid gap-2">
        {lines.map((s) => {
          const value = row[s.key]
          return (
            <TooltipSeriesRow
              key={s.key}
              swatch={<LineSwatch color={s.color} />}
              name={s.name}
            >
              {value != null && (
                <TooltipValue value={value.toFixed(2)} unit="%" />
              )}
            </TooltipSeriesRow>
          )
        })}
      </ul>
    </TooltipFrame>
  )
}
