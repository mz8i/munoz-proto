import workbookJson from "./generated/workbook.json"

export type Cell = string | number | boolean | null

/** Raw sheets as dumped by scripts/convert-data.ts, keyed by sheet name. */
export const workbook = workbookJson as Record<string, Cell[][]>
