/**
 * Validates the source workbook against the data template (src/data/schema.ts)
 * and converts it into:
 *
 * - src/data/generated/dataset.json, read by the app
 * - dist-data/, the files to publish on the TDC portal: the workbook itself,
 *   plus one tall CSV per sheet (one row per energy type, region, variable
 *   and year; empty and #N/A cells are left out)
 *
 * Fails with a list of all problems found, by cell address, if the workbook
 * doesn't match the template.
 *
 * Usage: pnpm data [path/to/workbook.xlsx]
 */
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { basename, extname, join, resolve } from "node:path"
import * as XLSX from "xlsx"

import {
  ENERGY_TYPES,
  ID_COLUMNS,
  SHEETS,
  type Dataset,
  type SeriesRow,
  type SheetData,
  type SheetId,
} from "../src/data/schema.ts"

const inputPath = resolve(
  process.argv[2] ?? "data/towards-resilient-low-emissions-transport.xlsx"
)
const appOutputDir = resolve("src/data/generated")
const tdcOutputDir = resolve("dist-data")

const errors: string[] = []
const warnings: string[] = []

const workbook = XLSX.read(readFileSync(inputPath))

const unexpectedSheets = workbook.SheetNames.filter(
  (name) => !Object.values(SHEETS).some((s) => s.name === name)
)
if (unexpectedSheets.length > 0) {
  warnings.push(`Ignoring unexpected sheets: ${unexpectedSheets.join(", ")}`)
}

const dataset = Object.fromEntries(
  (Object.keys(SHEETS) as SheetId[]).map((id) => [id, readSheet(id)])
) as Dataset

for (const warning of warnings) console.warn(`Warning: ${warning}`)
if (errors.length > 0) {
  console.error(`${inputPath} doesn't match the data template:`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

writeAppData(dataset)
writeTdcFiles(dataset)

console.log(`Converted ${inputPath}`)
console.log(`  app data: ${join(appOutputDir, "dataset.json")}`)
console.log(`  TDC files: ${tdcOutputDir}/`)

function readSheet(id: SheetId): SheetData {
  const spec = SHEETS[id]
  const sheet = workbook.Sheets[spec.name]
  if (!sheet) {
    errors.push(`Missing sheet "${spec.name}"`)
    return { years: [], rows: [] }
  }
  const range = XLSX.utils.decode_range(sheet["!ref"] ?? "A1")
  const at = (r: number, c: number) =>
    `${spec.name}!${XLSX.utils.encode_cell({ r, c })}`
  const cell = (r: number, c: number) =>
    sheet[XLSX.utils.encode_cell({ r, c })] as XLSX.CellObject | undefined

  // Header: the ID columns, then one column per year
  ID_COLUMNS.forEach((name, c) => {
    if (text(cell(0, c)) !== name) {
      errors.push(`${at(0, c)} should be "${name}"`)
    }
  })
  const years: number[] = []
  let lastColumn = ID_COLUMNS.length - 1
  for (let c = ID_COLUMNS.length; c <= range.e.c; c++) {
    const header = cell(0, c)
    if (isEmpty(header)) break
    const year = Number(text(header))
    if (!Number.isInteger(year)) {
      errors.push(`${at(0, c)} should be a year, found "${text(header)}"`)
    } else if (years.length > 0 && year !== years[years.length - 1] + 1) {
      errors.push(`${at(0, c)}: year ${year} doesn't follow ${years.at(-1)}`)
    }
    years.push(year)
    lastColumn = c
  }
  if (years.length === 0) errors.push(`${spec.name} has no year columns`)

  const rows: SeriesRow[] = []
  const seen = new Set<string>()
  for (let r = 1; r <= range.e.r; r++) {
    const ids = ID_COLUMNS.map((_, c) => text(cell(r, c)))
    const values: (number | null)[] = []
    for (let c = ID_COLUMNS.length; c <= range.e.c; c++) {
      const value = cell(r, c)
      if (c > lastColumn) {
        if (!isEmpty(value)) {
          errors.push(`${at(r, c)} is outside the year columns`)
        }
        continue
      }
      values.push(readValue(value, at(r, c), spec))
    }
    if (ids.every((id) => id === "") && values.every((v) => v === null)) {
      continue // blank row
    }

    const [energyType, region, variable] = ids
    ids.forEach((id, c) => {
      if (id === "") errors.push(`${at(r, c)} (${ID_COLUMNS[c]}) is empty`)
    })
    const energyTypes: string[] = Object.values(ENERGY_TYPES)
    if (energyType !== "" && !energyTypes.includes(energyType)) {
      errors.push(
        `${at(r, 0)}: Energy type should be one of ${energyTypes.join(", ")}, found "${energyType}"`
      )
    }
    const key = ids.join(" / ")
    if (seen.has(key)) errors.push(`${at(r, 0)}: duplicate row for ${key}`)
    seen.add(key)

    rows.push({
      energyType: energyType as SeriesRow["energyType"],
      region,
      variable,
      values,
    })
  }

  checkCompleteness(spec, rows)
  return { years, rows }
}

/** Every region needs each of the template's variables, for every energy type. */
function checkCompleteness(spec: (typeof SHEETS)[SheetId], rows: SeriesRow[]) {
  const required: readonly string[] = spec.variables
  const regions = [...new Set(rows.map((row) => row.region))]
  for (const region of regions) {
    for (const energyType of Object.values(ENERGY_TYPES)) {
      const present = new Set(
        rows
          .filter((row) => row.region === region)
          .filter((row) => row.energyType === energyType)
          .map((row) => row.variable)
      )
      const missing = required.filter((v) => !present.has(v))
      if (missing.length > 0) {
        errors.push(
          `${spec.name}: ${energyType} / ${region} is missing variables: ${quoteAll(missing)}`
        )
      }
    }
  }
  const extra = [...new Set(rows.map((row) => row.variable))].filter(
    (v) => !required.includes(v)
  )
  if (extra.length > 0) {
    warnings.push(
      `${spec.name}: variables not in the template, so not shown in the charts: ${quoteAll(extra)}`
    )
  }
}

function readValue(
  value: XLSX.CellObject | undefined,
  address: string,
  spec: (typeof SHEETS)[SheetId]
): number | null {
  if (value === undefined || isEmpty(value)) return null
  if (value.t === "e") {
    // #N/A is what lookups into the master file return for years without
    // data, so it counts as empty. Other errors point to a real problem.
    if (value.w !== "#N/A") {
      errors.push(`${address} is an error value (${value.w ?? "unknown"})`)
    }
    return null
  }
  if (value.t !== "n" || typeof value.v !== "number") {
    errors.push(`${address} should be a number, found "${text(value)}"`)
    return null
  }
  if (value.v < spec.min || value.v > spec.max) {
    const expected =
      spec.max === Infinity
        ? `at least ${spec.min}`
        : `between ${spec.min} and ${spec.max}`
    errors.push(`${address}: ${value.v} should be ${expected}`)
  }
  return value.v
}

function isEmpty(value: XLSX.CellObject | undefined) {
  return value === undefined || value.t === "z" || text(value) === ""
}

function text(value: XLSX.CellObject | undefined): string {
  if (value === undefined || value.v === undefined) return ""
  return String(value.v).trim()
}

function quoteAll(names: string[]) {
  return names.map((name) => `"${name}"`).join(", ")
}

function writeAppData(data: Dataset) {
  rmSync(appOutputDir, { recursive: true, force: true })
  mkdirSync(appOutputDir, { recursive: true })
  writeFileSync(
    join(appOutputDir, "dataset.json"),
    JSON.stringify(data, null, 2) + "\n"
  )
}

function writeTdcFiles(data: Dataset) {
  rmSync(tdcOutputDir, { recursive: true, force: true })
  mkdirSync(tdcOutputDir, { recursive: true })

  // The CSVs are named after the workbook, so all published files share its name
  const name = basename(inputPath, extname(inputPath))
  copyFileSync(inputPath, join(tdcOutputDir, basename(inputPath)))

  for (const id of Object.keys(SHEETS) as SheetId[]) {
    const { years, rows } = data[id]
    const lines = [[...ID_COLUMNS, "Year", "Value"]]
    for (const row of rows) {
      row.values.forEach((value, i) => {
        if (value === null) return
        const { energyType, region, variable } = row
        lines.push([
          energyType,
          region,
          variable,
          String(years[i]),
          String(value),
        ])
      })
    }
    writeFileSync(
      join(tdcOutputDir, `${name}_${SHEETS[id].slug}.csv`),
      lines.map((line) => line.map(csvField).join(",")).join("\n") + "\n"
    )
  }
}

function csvField(value: string) {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value
}
