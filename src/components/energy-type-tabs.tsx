import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type EnergyType = "final" | "useful"

const ENERGY_TYPE_LABELS: Record<EnergyType, string> = {
  final: "Final energy",
  useful: "Useful energy",
}

/**
 * Switch between the final and useful energy variants of the charts.
 * Rendered next to each chart, but all instances share one state.
 */
export function EnergyTypeTabs({
  value,
  onValueChange,
}: {
  value: EnergyType
  onValueChange: (value: EnergyType) => void
}) {
  return (
    <Tabs
      value={value}
      onValueChange={(value) => onValueChange(value as EnergyType)}
    >
      <TabsList>
        {Object.entries(ENERGY_TYPE_LABELS).map(([type, label]) => (
          <TabsTrigger key={type} value={type}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
