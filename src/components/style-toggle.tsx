import { useLayoutEffect, useState } from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type SiteStyle = "original" | "tdc"

const STYLE_LABELS: Record<SiteStyle, string> = {
  original: "Original",
  tdc: "TDC",
}

function styleFromUrl(): SiteStyle {
  const style = new URLSearchParams(window.location.search).get("style")
  return style === "tdc" ? "tdc" : "original"
}

/**
 * Temporary, for comparing the page's two styles. Sets the data-style attribute
 * that the TDC styles in index.css and the `tdc:` variant depend on, and keeps
 * it in the URL so that a link opens the same style.
 */
export function StyleToggle() {
  const [style, setStyle] = useState(styleFromUrl)

  useLayoutEffect(() => {
    document.documentElement.dataset.style = style
    const url = new URL(window.location.href)
    if (style === "tdc") url.searchParams.set("style", "tdc")
    else url.searchParams.delete("style")
    window.history.replaceState(null, "", url)
  }, [style])

  return (
    <div className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-xl border bg-background py-1 pr-1 pl-3 text-xs font-medium shadow-lg">
      Style
      <Tabs
        value={style}
        onValueChange={(value) => setStyle(value as SiteStyle)}
      >
        <TabsList>
          {Object.entries(STYLE_LABELS).map(([value, label]) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
