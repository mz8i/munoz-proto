import { useState, type ReactNode } from "react"

import { ENERGY_CHART_TITLES, EnergyChart } from "@/components/energy-chart"
import { EnergyTypeTabs, type EnergyType } from "@/components/energy-type-tabs"
import { SHARES_CHART_TITLES, SharesChart } from "@/components/shares-chart"

export function App() {
  // Shared by all charts; each chart has its own switch so one is always in view
  const [energyType, setEnergyType] = useState<EnergyType>("final")

  const energyTypeTabs = (
    <EnergyTypeTabs value={energyType} onValueChange={setEnergyType} />
  )

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-12 px-6 py-10">
      <header className="flex flex-col gap-2 border-b pb-8">
        <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
          Prototype
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Towards resilient and low-emissions transport systems
        </h1>
      </header>
      <ChartSection
        title={ENERGY_CHART_TITLES[energyType]}
        controls={energyTypeTabs}
      >
        <EnergyChart energyType={energyType} />
      </ChartSection>
      <ChartSection
        title={SHARES_CHART_TITLES[energyType]}
        controls={energyTypeTabs}
      >
        <SharesChart energyType={energyType} />
      </ChartSection>
    </main>
  )
}

function ChartSection({
  title,
  controls,
  children,
}: {
  title: string
  controls: ReactNode
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          {title}
        </h2>
        {controls}
      </div>
      {children}
    </section>
  )
}

export default App
