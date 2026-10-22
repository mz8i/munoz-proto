import { workbook } from "./workbook"

/**
 * Provisional adapter: assumes a "wide" sheet with years in the first row and
 * one series per row, named in the first column. Expect this to change along
 * with the data structure.
 */
export interface WideSheet {
  /** Series keys are safe for use in CSS variables; names are for display. */
  series: { key: string; name: string }[]
  /** One row per year, e.g. { year: 2010, s0: 1.2, s1: null } */
  rows: Record<string, number | null>[]
}

export function readWideSheet(sheetName: string): WideSheet {
  const sheet = workbook[sheetName]
  if (!sheet) throw new Error(`Sheet not found: ${sheetName}`)

  const [header, ...body] = sheet
  const years = header.slice(1).map(Number)
  const series = body.map((row, i) => ({ key: `s${i}`, name: String(row[0]) }))

  const rows = years.map((year, col) => {
    const row: Record<string, number | null> = { year }
    body.forEach((cells, i) => {
      const value = cells[col + 1]
      row[series[i].key] = typeof value === "number" ? value : null
    })
    return row
  })

  return { series, rows }
}

/** Looks up a series' key by its display name, failing loudly if it's missing. */
export function seriesKey(sheet: WideSheet, name: string): string {
  const series = sheet.series.find((s) => s.name === name)
  if (!series) throw new Error(`Series not found: ${name}`)
  return series.key
}
