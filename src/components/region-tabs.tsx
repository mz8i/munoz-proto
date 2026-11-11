import { InfoSwitch } from "@/components/info-switch"
import { REGION_EXPLANATION, REGION_LABELS } from "@/content"
import type { Region } from "@/data/schema"

export type { Region }

/**
 * Switch between the whole world and the countries that have signed the
 * Declaration, with a popover explaining both and listing the countries.
 * Rendered next to each chart, but all instances share one state.
 */
export function RegionTabs({
  value,
  onValueChange,
}: {
  value: Region
  onValueChange: (value: Region) => void
}) {
  return (
    <InfoSwitch
      value={value}
      onValueChange={onValueChange}
      labels={REGION_LABELS}
      info={{
        title: REGION_EXPLANATION.title,
        content: (
          <>
            <p className="text-muted-foreground">{REGION_EXPLANATION.global}</p>
            <p className="text-muted-foreground">
              {REGION_EXPLANATION.signatories}
            </p>
            <ul className="list-disc columns-2 gap-x-6 pl-5 text-muted-foreground">
              {REGION_EXPLANATION.signatoryCountries.map((country) => (
                <li key={country} className="break-inside-avoid">
                  {country}
                </li>
              ))}
            </ul>
          </>
        ),
      }}
    />
  )
}
