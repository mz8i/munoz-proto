import { max, range } from "d3-array"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  AREA_OPACITY,
  CHART_MARGIN,
  DASH,
  EXCEL_GRAY_DARK,
  EXCEL_GRAY_LIGHT,
  EXCEL_GREENS,
  EXCEL_PURPLE,
  GRID_COLOR,
  LINE_WIDTH,
  MARKER_COLOR,
  MARKER_DASH,
  MARKER_DOT_RADIUS,
} from "@/components/chart-style"
import { EnergyTooltip, type Comparison } from "@/components/energy-tooltip"
import type { EnergyType } from "@/components/energy-type-tabs"
import { SeriesLegend } from "@/components/series-legend"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import { readSeries, seriesKey } from "@/data/dataset"
import type { Variable } from "@/data/schema"

/** Stacked areas, in order from bottom to top. */
const AREA_STYLES: { name: Variable<"energy">; color: string }[] = [
  { name: "Other", color: EXCEL_GREENS[1] },
  { name: "Electricity", color: EXCEL_GREENS[2] },
  { name: "Biofuels", color: EXCEL_GREENS[3] },
  { name: "Biomethane", color: EXCEL_GREENS[4] },
  { name: "Hydrogen", color: EXCEL_GREENS[5] },
  { name: "Oil", color: EXCEL_GRAY_LIGHT },
  { name: "Natural gas", color: EXCEL_GRAY_DARK },
]

/** Historical series end where the data does, as their later values are null. */
const LINE_STYLES: {
  name: Variable<"energy">
  color: string
  dashed: boolean
}[] = [
  { name: "Renewable (target)", color: EXCEL_GREENS[0], dashed: true },
  { name: "Renewables (historical)", color: EXCEL_GREENS[0], dashed: false },
  { name: "Total (target)", color: "#000000", dashed: true },
  { name: "Total (historical)", color: EXCEL_PURPLE, dashed: false },
]

/** Target vs historical line pairs, compared side by side in the tooltip. */
const COMPARISONS: {
  label: string
  target: Variable<"energy">
  historical: Variable<"energy">
}[] = [
  {
    label: "Total",
    target: "Total (target)",
    historical: "Total (historical)",
  },
  {
    label: "Renewables",
    target: "Renewable (target)",
    historical: "Renewables (historical)",
  },
]

/**
 * Vertical lines marking target years; labels are placeholders. Where
 * highlightTargets is set, the target (dashed) lines get a dot where they
 * cross the marker.
 */
const YEAR_MARKERS = [
  { year: 2035, label: "2035 GTE Target", highlightTargets: true },
  { year: 2050, label: "2050 Net Zero Target", highlightTargets: false },
]

const X_TICK_STEP = 5
const Y_STEP = 20

/** Chart titles. */
export const ENERGY_CHART_TITLES: Record<EnergyType, string> = {
  final: "Final energy consumption",
  useful: "Useful energy consumption",
}

/** Prepares one energy type for the chart: series keys, chart config and data maximum. */
function prepareChart(energyType: EnergyType) {
  const title = ENERGY_CHART_TITLES[energyType]
  const sheet = readSeries("energy", energyType)
  const areas = AREA_STYLES.map((s) => ({
    ...s,
    key: seriesKey(sheet, s.name),
  }))
  const lines = LINE_STYLES.map((s) => ({
    ...s,
    key: seriesKey(sheet, s.name),
  }))

  const config = Object.fromEntries(
    [...areas, ...lines].map((s) => [s.key, { label: s.name, color: s.color }])
  ) satisfies ChartConfig

  // Highest point of either the stacked areas or any of the lines
  const dataMax =
    max(sheet.rows, (row) =>
      Math.max(
        areas.reduce((sum, s) => sum + (row[s.key] ?? 0), 0),
        ...lines.map((s) => row[s.key] ?? 0)
      )
    ) ?? 0

  const lineByName = (name: Variable<"energy">) => {
    const line = lines.find((s) => s.name === name)
    if (!line) throw new Error(`Line not configured: ${name}`)
    return line
  }
  const comparisons: Comparison[] = COMPARISONS.map((c) => ({
    label: c.label,
    target: lineByName(c.target),
    historical: lineByName(c.historical),
  }))

  const xDomain = [sheet.years[0], sheet.years[sheet.years.length - 1]]
  const xTicks = range(xDomain[0], xDomain[1] + 1, X_TICK_STEP)

  const markerDots = YEAR_MARKERS.filter((m) => m.highlightTargets).flatMap(
    (m) => {
      const row = sheet.rows.find((r) => r.year === m.year)
      return lines
        .filter((s) => s.dashed && row?.[s.key] != null)
        .map((s) => ({
          key: `${m.year}-${s.key}`,
          year: m.year,
          value: row?.[s.key] ?? 0,
          color: s.color,
        }))
    }
  )

  return {
    title,
    rows: sheet.rows,
    areas,
    lines,
    comparisons,
    config,
    dataMax,
    xDomain,
    xTicks,
    markerDots,
  }
}

const CHARTS: Record<EnergyType, ReturnType<typeof prepareChart>> = {
  final: prepareChart("final"),
  useful: prepareChart("useful"),
}

// The y-axis range is shared by all charts, so switching between them keeps the scale
const Y_MAX =
  Math.ceil((max(Object.values(CHARTS), (c) => c.dataMax) ?? 0) / Y_STEP) *
  Y_STEP
const Y_TICKS = range(0, Y_MAX + 1, Y_STEP)

export function EnergyChart({ energyType }: { energyType: EnergyType }) {
  const chart = CHARTS[energyType]

  return (
    <div className="flex flex-col gap-4">
      <ChartContainer config={chart.config} className="aspect-[3/2]">
        <ComposedChart data={chart.rows} margin={CHART_MARGIN}>
          <CartesianGrid stroke={GRID_COLOR} />
          <XAxis
            dataKey="year"
            type="number"
            domain={chart.xDomain}
            ticks={chart.xTicks}
            tickLine={false}
          />
          <YAxis
            domain={[0, Y_MAX]}
            ticks={Y_TICKS}
            tickLine={false}
            label={{
              value: `${chart.title} [EJ]`,
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />
          <ChartTooltip
            content={
              <EnergyTooltip
                comparisons={chart.comparisons}
                areas={chart.areas}
              />
            }
          />
          {chart.areas.map((s) => (
            <Area
              key={s.key}
              dataKey={s.key}
              stackId="energy"
              type="linear"
              fill={s.color}
              fillOpacity={AREA_OPACITY}
              stroke="none"
              isAnimationActive={false}
            />
          ))}
          {YEAR_MARKERS.map((m) => (
            <ReferenceLine
              key={m.year}
              x={m.year}
              stroke={MARKER_COLOR}
              strokeDasharray={MARKER_DASH}
              label={{
                value: m.label,
                position: "insideTopRight",
                fill: MARKER_COLOR,
                fontSize: 12,
              }}
            />
          ))}
          {chart.lines.map((s) => (
            <Line
              key={s.key}
              dataKey={s.key}
              type="linear"
              stroke={s.color}
              strokeWidth={LINE_WIDTH}
              strokeDasharray={s.dashed ? DASH : undefined}
              strokeLinecap="round"
              dot={false}
              isAnimationActive={false}
            />
          ))}
          {chart.markerDots.map((d) => (
            <ReferenceDot
              key={d.key}
              x={d.year}
              y={d.value}
              r={MARKER_DOT_RADIUS}
              fill={d.color}
              stroke="#ffffff"
              strokeWidth={2}
            />
          ))}
        </ComposedChart>
      </ChartContainer>
      <SeriesLegend areas={chart.areas} lines={chart.lines} />
    </div>
  )
}
