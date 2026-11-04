import { InfoIcon } from "lucide-react"
import { useEffect, useRef, useState, type PointerEvent } from "react"

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

/** Long enough not to open the popover when the mouse just passes through. */
const HOVER_OPEN_DELAY = 300
/** Leaves time to move the mouse across the gap between the toggle and popover. */
const HOVER_CLOSE_DELAY = 200

/**
 * Switch between the final and useful energy variants of the charts, with a
 * popover explaining the difference, opened by hovering over the switch or by
 * clicking the info icon. Rendered next to each chart, but all instances share
 * one state.
 */
export function EnergyTypeTabs({
  value,
  onValueChange,
}: {
  value: EnergyType
  onValueChange: (value: EnergyType) => void
}) {
  const [infoOpen, setInfoOpen] = useState(false)
  // Opened by hovering, so closes on leaving; opened by a click, it stays open
  const [openedOnHover, setOpenedOnHover] = useState(false)
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(hoverTimer.current), [])

  const onHoverStart = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return
    clearTimeout(hoverTimer.current)
    if (infoOpen) return
    hoverTimer.current = setTimeout(() => {
      setOpenedOnHover(true)
      setInfoOpen(true)
    }, HOVER_OPEN_DELAY)
  }
  const onHoverEnd = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return
    clearTimeout(hoverTimer.current)
    if (!infoOpen || !openedOnHover) return
    hoverTimer.current = setTimeout(() => {
      setOpenedOnHover(false)
      setInfoOpen(false)
    }, HOVER_CLOSE_DELAY)
  }

  return (
    <div
      className="flex w-fit items-center gap-1"
      onPointerEnter={onHoverStart}
      onPointerLeave={onHoverEnd}
      // A click means the user is busy with the switch, so don't open on top of it
      onPointerDown={() => clearTimeout(hoverTimer.current)}
    >
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
      <EnergyTypeInfo
        open={infoOpen}
        openedOnHover={openedOnHover}
        onOpenChange={(open) => {
          setOpenedOnHover(false)
          setInfoOpen(open)
        }}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
      />
    </div>
  )
}

function EnergyTypeInfo({
  open,
  openedOnHover,
  onOpenChange,
  onHoverStart,
  onHoverEnd,
}: {
  open: boolean
  openedOnHover: boolean
  onOpenChange: (open: boolean) => void
  onHoverStart: (event: PointerEvent) => void
  onHoverEnd: (event: PointerEvent) => void
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
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
      <PopoverContent
        align="end"
        className="w-80"
        // Hovering shouldn't take the keyboard focus away from where it is
        initialFocus={!openedOnHover}
        finalFocus={!openedOnHover}
        onPointerEnter={onHoverStart}
        onPointerLeave={onHoverEnd}
      >
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
