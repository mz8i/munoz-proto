import {
  TooltipFrame,
  TooltipSeriesRow,
  TooltipValue,
  type TooltipContentProps,
} from "@/components/chart-tooltip"
import { AreaSwatch, LineSwatch } from "@/components/series-legend"

interface Series {
  key: string
  name: string
  color: string
}

interface LineSeries extends Series {
  dashed: boolean
}

export interface Comparison {
  label: string
  target: LineSeries
  historical: LineSeries
}

const formatNumber = (value: number) =>
  value.toLocaleString("en", { maximumFractionDigits: value < 1 ? 2 : 1 })

/**
 * Tooltip for the energy charts: target vs historical comparisons first,
 * then the stacked areas listed in the same order as they are stacked.
 */
export function EnergyTooltip({
  active,
  payload,
  comparisons,
  areas,
}: TooltipContentProps & {
  comparisons: Comparison[]
  /** In stacking order, from bottom to top. */
  areas: Series[]
}) {
  const row = payload?.[0]?.payload
  if (!active || !row) return null

  return (
    <TooltipFrame title={row.year} className="min-w-60">
      {comparisons.map((c) => (
        <div key={c.label} className="grid gap-1.5">
          <div className="font-medium text-muted-foreground">{c.label}</div>
          <div className="grid grid-cols-2 gap-4">
            <Figure
              label="Target"
              series={c.target}
              value={row[c.target.key]}
            />
            <Figure
              label="Historical"
              series={c.historical}
              value={row[c.historical.key]}
            />
          </div>
        </div>
      ))}
      <ul className="grid gap-1.5 border-t pt-2.5">
        {/* Reversed so the top of the stack comes first */}
        {areas.toReversed().map((s) => {
          const value = row[s.key]
          return (
            <TooltipSeriesRow
              key={s.key}
              swatch={<AreaSwatch color={s.color} />}
              name={s.name}
            >
              {value != null && (
                <TooltipValue value={formatNumber(value)} unit="EJ" />
              )}
            </TooltipSeriesRow>
          )
        })}
      </ul>
    </TooltipFrame>
  )
}

function Figure({
  label,
  series,
  value,
}: {
  label: string
  series: LineSeries
  value: number | null
}) {
  return (
    <div className="grid gap-1">
      <div className="flex items-center gap-2 text-muted-foreground">
        <LineSwatch color={series.color} dashed={series.dashed} />
        {label}
      </div>
      <div className="flex min-h-5 items-center text-sm">
        {value == null ? (
          <span className="text-[0.625rem] font-medium tracking-wider text-muted-foreground uppercase">
            No data
          </span>
        ) : (
          <TooltipValue value={formatNumber(value)} unit="EJ" />
        )}
      </div>
    </div>
  )
}
