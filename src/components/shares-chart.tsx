import { max, range } from "d3-array"
import { CartesianGrid, LineChart, Line, XAxis, YAxis } from "recharts"

import {
  CHART_MARGIN,
  EXCEL_BLUE,
  EXCEL_GREENS,
  EXCEL_PURPLE_LIGHT,
  GRID_COLOR,
  LINE_WIDTH,
} from "@/components/chart-style"
import type { EnergyType } from "@/components/energy-type-tabs"
import { SeriesLegend } from "@/components/series-legend"
import { SharesTooltip } from "@/components/shares-tooltip"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import { readSeries, seriesKey } from "@/data/dataset"
import type { Variable } from "@/data/schema"

const LINE_STYLES: { name: Variable<"shares">; color: string }[] = [
  {
    name: "Aviation and shipping fuels certified as sustainable in all renewable fuels",
    color: EXCEL_PURPLE_LIGHT,
  },
  { name: "Electricity in transport energy demand", color: EXCEL_BLUE },
  {
    name: "Renewable electricity in transport energy demand",
    color: EXCEL_GREENS[0],
  },
]

const X_TICK_STEP = 2
/** In percentage points. */
const Y_STEP = 0.5

/** Chart titles. */
export const SHARES_CHART_TITLES: Record<EnergyType, string> = {
  final: "Shares of final energy",
  useful: "Shares of useful energy",
}

/** Prepares one energy type for the chart: series keys, chart config and axis scales. */
function prepareChart(energyType: EnergyType) {
  const title = SHARES_CHART_TITLES[energyType]
  const sheet = readSeries("shares", energyType)
  const lines = LINE_STYLES.map((s) => ({
    ...s,
    key: seriesKey(sheet, s.name),
  }))

  const config = Object.fromEntries(
    lines.map((s) => [s.key, { label: s.name, color: s.color }])
  ) satisfies ChartConfig

  // The data has shares as fractions, the chart shows percentages
  const rows = sheet.rows.map((row) => {
    const percentages: Record<string, number | null> = { year: row.year }
    for (const s of lines) {
      const value = row[s.key]
      percentages[s.key] = value === null ? null : value * 100
    }
    return percentages
  })

  const dataMax = max(rows, (row) => max(lines, (s) => row[s.key] ?? 0)) ?? 0
  const yMax = Math.ceil(dataMax / Y_STEP) * Y_STEP
  const yTicks = range(0, yMax + Y_STEP / 2, Y_STEP)

  const xDomain = [sheet.years[0], sheet.years[sheet.years.length - 1]]
  const xTicks = range(xDomain[0], xDomain[1] + 1, X_TICK_STEP)

  return { title, rows, lines, config, yMax, yTicks, xDomain, xTicks }
}

const CHARTS: Record<EnergyType, ReturnType<typeof prepareChart>> = {
  final: prepareChart("final"),
  useful: prepareChart("useful"),
}

export function SharesChart({ energyType }: { energyType: EnergyType }) {
  const chart = CHARTS[energyType]

  return (
    <div className="flex flex-col gap-4">
      <ChartContainer config={chart.config} className="aspect-[3/2]">
        <LineChart data={chart.rows} margin={CHART_MARGIN}>
          <CartesianGrid stroke={GRID_COLOR} vertical={false} />
          <XAxis
            dataKey="year"
            type="number"
            domain={chart.xDomain}
            ticks={chart.xTicks}
            tickLine={false}
          />
          <YAxis
            domain={[0, chart.yMax]}
            ticks={chart.yTicks}
            tickFormatter={(value: number) => `${value}%`}
            tickLine={false}
            label={{
              value: chart.title,
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />
          <ChartTooltip content={<SharesTooltip lines={chart.lines} />} />
          {chart.lines.map((s) => (
            <Line
              key={s.key}
              dataKey={s.key}
              type="linear"
              stroke={s.color}
              strokeWidth={LINE_WIDTH}
              strokeLinecap="round"
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ChartContainer>
      <SeriesLegend lines={chart.lines} />
    </div>
  )
}
