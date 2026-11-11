import { InfoSwitch } from "@/components/info-switch"
import { ENERGY_TYPE_EXPLANATION } from "@/content"
import type { EnergyType } from "@/data/schema"

export type { EnergyType }

const ENERGY_TYPE_LABELS: Record<EnergyType, string> = {
  final: "Final energy",
  useful: "Useful energy",
}

/**
 * Switch between the final and useful energy variants of the charts, with a
 * popover explaining the difference. Rendered next to each chart, but all
 * instances share one state.
 */
export function EnergyTypeTabs({
  value,
  onValueChange,
}: {
  value: EnergyType
  onValueChange: (value: EnergyType) => void
}) {
  return (
    <InfoSwitch
      value={value}
      onValueChange={onValueChange}
      labels={ENERGY_TYPE_LABELS}
      info={{
        title: ENERGY_TYPE_EXPLANATION.title,
        content: ENERGY_TYPE_EXPLANATION.paragraphs.map((text) => (
          <p key={text} className="text-muted-foreground">
            {text}
          </p>
        )),
      }}
    />
  )
}
