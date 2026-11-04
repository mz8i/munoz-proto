import { useState, type ReactNode } from "react"

import { ENERGY_CHART_TITLES, EnergyChart } from "@/components/energy-chart"
import { EnergyTypeTabs, type EnergyType } from "@/components/energy-type-tabs"
import { SHARES_CHART_TITLES, SharesChart } from "@/components/shares-chart"
import { StyleToggle } from "@/components/style-toggle"
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
  "font-heading text-xl font-semibold tracking-tight tdc:text-2xl tdc:font-bold tdc:text-primary"

export function App() {
  // Shared by all charts; each chart has its own switch so one is always in view
  const [energyType, setEnergyType] = useState<EnergyType>("final")

  const energyTypeTabs = (
    <EnergyTypeTabs value={energyType} onValueChange={setEnergyType} />
  )

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-12 px-6 py-10">
      <StyleToggle />
      <header className="flex flex-col gap-6 border-b pb-8">
        <img
          src={tdcLogo}
          alt="Transport Data Commons"
          className="hidden h-8 w-fit tdc:block"
        />
        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl tdc:text-4xl tdc:font-extrabold tdc:text-primary sm:tdc:text-5xl">
            {PAGE_TITLE}
          </h1>
          <p className="text-lg text-balance text-muted-foreground tdc:font-semibold tdc:text-primary">
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
        <p className="border-l-2 border-foreground/20 pl-4 text-muted-foreground tdc:rounded-lg tdc:border-l-0 tdc:bg-tdc-pale-lime tdc:p-4">
          {definition}
        </p>
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
            {text}
          </p>
        ))}
      </div>
      <Sources />
    </footer>
  )
}

function Sources() {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="font-heading text-base font-semibold tracking-tight tdc:text-lg tdc:text-primary">
        Sources
      </h3>
      <ol className="flex list-decimal flex-col gap-3 pl-5 text-sm">
        {SOURCES.map((source) => (
          <li key={source.citation} className="pl-1">
            {source.url ? (
              <a
                href={source.url}
                className="underline underline-offset-4 hover:text-muted-foreground tdc:text-tdc-teal-500"
              >
                {source.citation}
              </a>
            ) : (
              source.citation
            )}
            <div className="text-muted-foreground tdc:text-xs tdc:text-caption">
              {source.usedFor}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default App
