import { useState, type ReactNode } from "react"

import { ENERGY_CHART_TITLES, EnergyChart } from "@/components/energy-chart"
import { EnergyTypeTabs, type EnergyType } from "@/components/energy-type-tabs"
import { SHARES_CHART_TITLES, SharesChart } from "@/components/shares-chart"
import gteLogo from "@/assets/gte-logo.png"
import tdcLogo from "@/assets/tdc-logo.svg"
import {
  ABOUT,
  CHART_DESCRIPTIONS,
  INTRO,
  PAGE_SUBTITLE,
  PAGE_TITLE,
  SOURCES,
} from "@/content"

const SECTION_HEADING_CLASS =
  "font-heading text-2xl font-bold tracking-tight text-primary"

export function App() {
  // Shared by all charts; each chart has its own switch so one is always in view
  const [energyType, setEnergyType] = useState<EnergyType>("final")

  const energyTypeTabs = (
    <EnergyTypeTabs value={energyType} onValueChange={setEnergyType} />
  )

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-12 px-6 py-10">
      <header className="flex flex-col gap-6 border-b pb-8">
        <img src={tdcLogo} alt="Transport Data Commons" className="h-8 w-fit" />
        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-balance text-primary sm:text-5xl">
            {PAGE_TITLE}
          </h1>
          <p className="text-lg font-semibold text-balance text-primary">
            {PAGE_SUBTITLE}
          </p>
        </div>
        <Intro />
      </header>
      <ChartSection
        title={ENERGY_CHART_TITLES[energyType]}
        description={CHART_DESCRIPTIONS.energy[energyType]}
        controls={energyTypeTabs}
      >
        <EnergyChart energyType={energyType} />
      </ChartSection>
      <ChartSection
        title={SHARES_CHART_TITLES[energyType]}
        description={CHART_DESCRIPTIONS.shares[energyType]}
        controls={energyTypeTabs}
      >
        <SharesChart energyType={energyType} />
      </ChartSection>
      <About />
    </main>
  )
}

/** The last paragraph defines the Global Transport Effort, so it's set apart. */
function Intro() {
  const paragraphs = INTRO.slice(0, -1)
  const definition = INTRO.at(-1)

  return (
    <div className="flex flex-col gap-4 leading-7">
      {paragraphs.map((text) => (
        <p key={text}>{text}</p>
      ))}
      {definition && (
        <div className="flex flex-col items-center gap-4 rounded-lg bg-tdc-pale-lime p-4 sm:flex-row">
          <img
            src={gteLogo}
            alt="Global Transport Effort"
            className="size-32 shrink-0"
          />
          <p className="text-muted-foreground">{definition}</p>
        </div>
      )}
    </div>
  )
}

function ChartSection({
  title,
  description,
  controls,
  children,
}: {
  title: string
  description: string
  controls: ReactNode
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <h2 className={SECTION_HEADING_CLASS}>{title}</h2>
          {controls}
        </div>
        <p className="leading-7 text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}

function About() {
  return (
    <footer className="flex flex-col gap-8 border-t pt-8">
      <div className="flex flex-col gap-4">
        <h2 className={SECTION_HEADING_CLASS}>About</h2>
        {ABOUT.map((text) => (
          <p key={text} className="leading-7">
            {withLinks(text)}
          </p>
        ))}
      </div>
      <Sources />
    </footer>
  )
}

/**
 * Turns [text](url) in the page text into links. They open in a new tab, as
 * the page is also embedded in the TDC portal, where a link would otherwise
 * open inside the frame.
 */
function withLinks(text: string) {
  // Splits into plain text, then link text and url, then plain text, and so on
  const parts = text.split(/\[([^\]]+)\]\(([^)]+)\)/)
  return parts.map((part, i) => {
    if (i % 3 === 0) return part
    if (i % 3 === 2) return null
    return (
      <a
        key={i}
        href={parts[i + 1]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-tdc-teal-500 underline underline-offset-4 hover:text-muted-foreground"
      >
        {part}
      </a>
    )
  })
}

function Sources() {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="font-heading text-lg font-semibold tracking-tight text-primary">
        Sources
      </h3>
      <ol className="flex list-decimal flex-col gap-3 pl-5 text-sm">
        {SOURCES.map((source) => (
          <li key={source.citation} className="pl-1">
            {source.url ? (
              <a
                href={source.url}
                className="text-tdc-teal-500 underline underline-offset-4 hover:text-muted-foreground"
              >
                {source.citation}
              </a>
            ) : (
              source.citation
            )}
            <div className="text-xs text-caption">{source.usedFor}</div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default App
