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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { readWideSheet, seriesKey } from "@/data/wide-sheet"

const LINE_STYLES = [
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

const X_TICKS = range(2010, 2036, 2)
/** In percentage points. */
const Y_STEP = 0.5

/** Chart titles, which are also the source sheet names. */
export const SHARES_CHART_TITLES: Record<EnergyType, string> = {
  final: "Shares of final energy",
  useful: "Shares of useful energy",
}

/** Prepares one sheet for the chart: series keys, chart config and y-axis scale. */
function prepareChart(title: string) {
  const sheet = readWideSheet(title)
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

  return { title, rows, lines, config, yMax, yTicks }
}

const CHARTS: Record<EnergyType, ReturnType<typeof prepareChart>> = {
  final: prepareChart(SHARES_CHART_TITLES.final),
  useful: prepareChart(SHARES_CHART_TITLES.useful),
}

const formatPercent = (value: number) => `${value.toFixed(2)} %`

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
            domain={[2010, 2035]}
            ticks={X_TICKS}
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
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => payload[0]?.payload.year}
                valueFormatter={formatPercent}
              />
            }
          />
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
