# Data

All data comes from one Excel file,
[`data/towards-resilient-low-emissions-transport.xlsx`](data/towards-resilient-low-emissions-transport.xlsx).
Everything else (the data used by the charts, and the files published on the
TDC portal) is generated from it.

## The template

The workbook has two sheets, **Energy consumption** (in EJ) and **Shares of
energy** (as fractions, so 0.05 = 5%). Both have the same layout:

| Energy type | Region | Variable | 2010 | 2011 | …   |
| ----------- | ------ | -------- | ---- | ---- | --- |
| Final       | Global | Oil      | 94.7 | 96.5 | …   |
| Useful      | Global | Oil      | 23.4 | 23.9 | …   |

- **Energy type** is `Final` or `Useful`. Both need the same variables.
- **Region** is `Global` for now. Other regions can be added as extra rows.
- **Variable** names must match the template exactly: the charts look them up
  by name. The full list is in [`src/data/schema.ts`](src/data/schema.ts).
- **Years** are one column each, with no gaps. Add a column to add a year.
- **Values** are plain numbers. Where there's no value, leave the cell
  **empty** or `#N/A`, rather than writing `-` or text. Other Excel errors,
  such as `#REF!` or `#DIV/0!`, fail the checks.

## Updating the data

1. **Replace the workbook.** On GitHub, open the `data` folder, choose
   _Add file → Upload files_, and upload the new version under the same name.
   Choose _Create a new branch and start a pull request_.
2. **Check the pull request.** The _Checks_ workflow validates the workbook.
   If it fails, its log lists every problem by cell, e.g.
   `Energy consumption!AH5 should be a number, found "n/a"`. Fix the file and
   upload it again to the same branch.
3. **Merge.** This redeploys the site with the new data, and the _Release data_
   workflow publishes a new release on the repository's _Releases_ page, with:
   - the workbook, unchanged
   - one CSV per sheet, in a tall format (one row per energy type, region,
     variable and year), which suits the TDC portal's table preview
4. **Update the dataset on the TDC portal.** Download the files from the
   release and replace the dataset's resources with them. For each CSV, make
   sure _Upload to datastore_ is on, then save, so the table preview updates.

## Running it locally

```bash
pnpm install
pnpm data              # validate and convert the workbook
pnpm data other.xlsx   # ...or another file, e.g. to check it before uploading
pnpm dev               # runs `pnpm data`, then starts the site
```

`pnpm data` writes the chart data to `src/data/generated/` and the TDC files to
`dist-data/`. Neither is committed.
