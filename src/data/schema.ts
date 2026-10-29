/**
 * The data template: what the source workbook must contain.
 *
 * Shared by scripts/convert-data.ts, which validates the workbook against it,
 * and the charts, which can only reference variables listed here. Variable
 * names are copied verbatim from the master file, so keep them in sync with it.
 *
 * Plain TypeScript with no imports, so that Node can run it directly.
 */

/** Leading columns of every sheet; the remaining columns are years. */
export const ID_COLUMNS = ["Energy type", "Region", "Variable"] as const

/** Energy type values as written in the workbook, by the app's own key. */
export const ENERGY_TYPES = { final: "Final", useful: "Useful" } as const

export const SHEETS = {
  energy: {
    name: "Energy consumption",
    /** Short name, used in the TDC CSV file names. */
    slug: "energy-consumption",
    variables: [
      "Other",
      "Electricity",
      "Biofuels",
      "Biomethane",
      "Hydrogen",
      "Oil",
      "Natural gas",
      "Total (target)",
      "Renewable (target)",
      "Renewables (historical)",
      "Total (historical)",
    ],
    /** In EJ. */
    min: 0,
    max: Infinity,
  },
  shares: {
    name: "Shares of energy",
    slug: "energy-shares",
    variables: [
      "Aviation and shipping fuels certified as sustainable in all renewable fuels",
      "Electricity in transport energy demand",
      "Renewable electricity in transport energy demand",
    ],
    /** Fractions, so 0.05 = 5%. */
    min: 0,
    max: 1,
  },
} as const

export type SheetId = keyof typeof SHEETS
export type EnergyType = keyof typeof ENERGY_TYPES
export type Variable<S extends SheetId> =
  (typeof SHEETS)[S]["variables"][number]

/** One row of a sheet: a time series for one energy type, region and variable. */
export interface SeriesRow {
  energyType: (typeof ENERGY_TYPES)[EnergyType]
  region: string
  variable: string
  /** Aligned with the sheet's years; null where the cell is empty. */
  values: (number | null)[]
}

export interface SheetData {
  years: number[]
  rows: SeriesRow[]
}

/** Shape of src/data/generated/dataset.json. */
export type Dataset = Record<SheetId, SheetData>
