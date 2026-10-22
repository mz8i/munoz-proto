/**
 * Dumps every sheet of the source workbook to JSON as-is: an array of rows,
 * each an array of cell values. Excel errors (#N/A etc.) and empty cells become null.
 *
 * Deliberately makes no assumptions about the sheets' structure - shaping the
 * data for charts happens in src/data/.
 *
 * Usage: pnpm data [path/to/workbook.xlsx]
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import * as XLSX from "xlsx"

const inputPath = resolve(process.argv[2] ?? "data/Munoz_dataset.xlsx")
const outputPath = resolve("src/data/generated/workbook.json")

type Cell = string | number | boolean | null

const workbook = XLSX.read(readFileSync(inputPath))

const sheets: Record<string, Cell[][]> = {}
for (const name of workbook.SheetNames) {
  const sheet = workbook.Sheets[name]
  const rows = XLSX.utils.sheet_to_json<Cell[]>(sheet, {
    header: 1,
    raw: true,
    defval: null,
  })
  sheets[name] = rows.map((row) => row.map(toCell))
}

function toCell(value: unknown): Cell {
  if (value === undefined || value === "") return null
  // Error cells come through as their display text, e.g. "#N/A"
  if (typeof value === "string" && /^#[A-Z/0!?]+[!?]?$/.test(value)) return null
  return value as Cell
}

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, JSON.stringify(sheets, null, 2) + "\n")

console.log(
  `Wrote ${Object.keys(sheets).length} sheets from ${inputPath} to ${outputPath}`
)
