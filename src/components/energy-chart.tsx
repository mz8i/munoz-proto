import { max, range, ticks, tickStep } from "d3-array"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  Text,
  usePlotArea,
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
  TOOLTIP_WRAPPER_STYLE,
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
import { useTooltipPortal } from "@/lib/use-tooltip-portal"
import { REGIONS, type Region, type Variable } from "@/data/schema"

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
  { name: "Renewables (target)", color: EXCEL_GREENS[0], dashed: true },
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
    target: "Renewables (target)",
    historical: "Renewables (historical)",
  },
]

/**
 * Vertical lines marking key years. Where highlightTargets is set, the target
 * (dashed) lines get a dot where they cross the marker. Only shown for the
 * world, as the 2035 effort and the 2050 pathway are global goals: the
 * researchers chose not to mark scaled versions of them for the signatories.
 */
const YEAR_MARKERS = [
  { year: 2035, label: "2035 GTE Target", highlightTargets: true },
  { year: 2050, label: "2050 Net Zero Pathway", highlightTargets: false },
]

/** Labels wrap to fit between neighbouring markers, this many years apart. */
const MARKER_LABEL_YEARS = 15
const MARKER_LABEL_PADDING = 6

const X_TICK_STEP = 5
/** Roughly how many steps the y-axis is divided into. */
const Y_TICK_COUNT = 7

/** Chart titles. */
export const ENERGY_CHART_TITLES: Record<EnergyType, string> = {
  final: "Global Transport Effort: final energy consumption",
  useful: "Global Transport Effort: useful energy consumption",
}

/** Shorter than the chart titles, to fit along the y-axis. */
const Y_AXIS_LABELS: Record<EnergyType, string> = {
  final: "Final energy consumption [EJ]",
  useful: "Useful energy consumption [EJ]",
}

/** Prepares one region and energy type for the chart: series keys, chart config and data maximum. */
function prepareChart(region: Region, energyType: EnergyType) {
  const yAxisLabel = Y_AXIS_LABELS[energyType]
  const sheet = readSeries("energy", energyType, region)
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

  const yearMarkers = region === "global" ? YEAR_MARKERS : []
  const markerDots = yearMarkers
    .filter((m) => m.highlightTargets)
    .flatMap((m) => {
      const row = sheet.rows.find((r) => r.year === m.year)
      return lines
        .filter((s) => s.dashed && row?.[s.key] != null)
        .map((s) => ({
          key: `${m.year}-${s.key}`,
          year: m.year,
          value: row?.[s.key] ?? 0,
          color: s.color,
        }))
    })

  return {
    yAxisLabel,
    rows: sheet.rows,
    areas,
    lines,
    comparisons,
    config,
    dataMax,
    xDomain,
    xTicks,
    yearMarkers,
    markerDots,
  }
}

/**
 * The charts for each region, with a y-axis range shared by its energy types,
 * so that switching between final and useful energy keeps the scale. Regions
 * differ too much in size to share one.
 */
const CHARTS = Object.fromEntries(
  (Object.keys(REGIONS) as Region[]).map((region) => {
    const charts = {
      final: prepareChart(region, "final"),
      useful: prepareChart(region, "useful"),
    }
    const dataMax = max(Object.values(charts), (c) => c.dataMax) ?? 0
    const step = tickStep(0, dataMax, Y_TICK_COUNT)
    const yMax = Math.ceil(dataMax / step) * step
    // d3's ticks avoid the rounding errors of adding up decimal steps
    const yTicks = ticks(0, yMax, Math.round(yMax / step))
    return [region, { charts, yMax, yTicks }]
  })
) as Record<
  Region,
  {
    charts: Record<EnergyType, ReturnType<typeof prepareChart>>
    yMax: number
    yTicks: number[]
  }
>

export function EnergyChart({
  region,
  energyType,
}: {
  region: Region
  energyType: EnergyType
}) {
  const { charts, yMax, yTicks } = CHARTS[region]
  const chart = charts[energyType]
  const [tooltipPortal, setTooltipContainer] = useTooltipPortal()

  return (
    <div className="flex flex-col gap-4">
      <ChartContainer
        config={chart.config}
        className="aspect-[3/2] sm:aspect-[12/7]"
      >
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
            domain={[0, yMax]}
            ticks={yTicks}
            tickLine={false}
            label={{
              value: chart.yAxisLabel,
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />
          <ChartTooltip
            wrapperStyle={TOOLTIP_WRAPPER_STYLE}
            portal={tooltipPortal}
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
          {chart.yearMarkers.map((m) => (
            <ReferenceLine
              key={m.year}
              x={m.year}
              stroke={MARKER_COLOR}
              strokeDasharray={MARKER_DASH}
              label={
                <MarkerLabel
                  value={m.label}
                  widthFraction={
                    MARKER_LABEL_YEARS / (chart.xDomain[1] - chart.xDomain[0])
                  }
                />
              }
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
      {/* The tooltip on narrow screens; it cancels the gap above while empty */}
      <div
        ref={setTooltipContainer}
        className="-mt-4 has-[>.recharts-tooltip-wrapper>*]:mt-0 sm:hidden"
      />
      <SeriesLegend areas={chart.areas} lines={chart.lines} />
    </div>
  )
}

/** A year marker's label, right-aligned to its line and wrapping to fit. */
function MarkerLabel({
  value,
  widthFraction,
  viewBox,
}: {
  value: string
  /** Space available for the label, as a fraction of the plot's width. */
  widthFraction: number
  /** Passed in by Recharts: the marker line's position. */
  viewBox?: { x?: number; y?: number }
}) {
  const plotArea = usePlotArea()
  if (!plotArea || viewBox?.x === undefined || viewBox.y === undefined) {
    return null
  }

  return (
    <Text
      x={viewBox.x - MARKER_LABEL_PADDING}
      y={viewBox.y + MARKER_LABEL_PADDING}
      width={plotArea.width * widthFraction - 2 * MARKER_LABEL_PADDING}
      textAnchor="end"
      verticalAnchor="start"
      lineHeight="1.2em"
      fill={MARKER_COLOR}
      // A style with a unit, as that's what the word wrapping measures with
      style={{ fontSize: "12px" }}
    >
      {value}
    </Text>
  )
}
