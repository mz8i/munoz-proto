import { InfoIcon } from "lucide-react"
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

/** Long enough not to open the popover when the mouse just passes through. */
const HOVER_OPEN_DELAY = 300
/** Leaves time to move the mouse across the gap between the toggle and popover. */
const HOVER_CLOSE_DELAY = 200

/**
 * A switch between a few options, with a popover explaining them, opened by
 * hovering over the switch or by clicking the info icon.
 */
export function InfoSwitch<T extends string>({
  value,
  onValueChange,
  labels,
  info,
}: {
  value: T
  onValueChange: (value: T) => void
  /** The options, in order, with their labels. */
  labels: Record<T, string>
  info: { title: string; content: ReactNode }
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
    hoverTimer.current = setTimeout(() => setInfoOpen(false), HOVER_CLOSE_DELAY)
  }

  return (
    <div
      className="flex w-fit items-center gap-1"
      onPointerEnter={onHoverStart}
      onPointerLeave={onHoverEnd}
      // A click means the user is busy with the switch, so don't open on top of it
      onPointerDown={() => clearTimeout(hoverTimer.current)}
    >
      <Tabs value={value} onValueChange={(value) => onValueChange(value as T)}>
        <TabsList>
          {(Object.entries(labels) as [T, string][]).map(([option, label]) => (
            <TabsTrigger key={option} value={option}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Popover
        open={infoOpen}
        onOpenChange={(open) => {
          // Kept when closing, as it also decides where the focus goes then
          if (open) setOpenedOnHover(false)
          setInfoOpen(open)
        }}
      >
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              aria-label={info.title}
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
            <PopoverTitle>{info.title}</PopoverTitle>
          </PopoverHeader>
          {info.content}
        </PopoverContent>
      </Popover>
    </div>
  )
}
