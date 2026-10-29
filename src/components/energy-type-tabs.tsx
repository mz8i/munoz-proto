import { InfoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    <div className="flex items-center gap-1">
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
      <EnergyTypeInfo />
    </div>
  )
}

function EnergyTypeInfo() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            aria-label={ENERGY_TYPE_EXPLANATION.title}
          />
        }
      >
        <InfoIcon />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <PopoverHeader>
          <PopoverTitle>{ENERGY_TYPE_EXPLANATION.title}</PopoverTitle>
        </PopoverHeader>
        {ENERGY_TYPE_EXPLANATION.paragraphs.map((text) => (
          <p key={text} className="text-muted-foreground">
            {text}
          </p>
        ))}
      </PopoverContent>
    </Popover>
  )
}
