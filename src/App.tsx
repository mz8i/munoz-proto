import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { readWideSheet } from "@/data/wide-sheet"

const finalEnergy = readWideSheet("Final energy consumption")

const chartConfig = Object.fromEntries(
  finalEnergy.series.map((s, i) => [
    s.key,
    { label: s.name, color: `var(--chart-${(i % 5) + 1})` },
  ])
) satisfies ChartConfig

export function App() {
  return (
    <main className="mx-auto flex min-h-svh max-w-5xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Munoz prototype</h1>
      <Card>
        <CardHeader>
          <CardTitle>Final energy consumption</CardTitle>
          <CardDescription>
            Placeholder chart, by energy carrier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="aspect-auto h-96">
            <LineChart data={finalEnergy.rows}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {finalEnergy.series.map((s) => (
                <Line
                  key={s.key}
                  dataKey={s.key}
                  stroke={`var(--color-${s.key})`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </main>
  )
}

export default App
