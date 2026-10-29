import type { EnergyType } from "@/data/schema"

/**
 * The page's text, kept apart from the layout so the wording can be updated
 * in one place.
 *
 * content/page-text.md holds the same text, plus the short labels set in the
 * chart components, in a form for sharing with the researchers. Keep the two
 * in sync: text edited there is copied back here.
 *
 * PLACEHOLDER: apart from the Global Transport Effort definition, all of this
 * is draft or made-up text, sized to stand in for the researchers' wording.
 */

export const PAGE_TITLE = "Tracking the Global Transport Effort"
export const PAGE_SUBTITLE =
  "Towards Resilient and Low-Emission Transport Systems for People, Development and the Planet Declaration"

export const INTRO: string[] = [
  "This tracker follows global progress in transport energy use against the pathway set out in the Declaration. It compares the latest historical data with the targets for 2035 and 2050, for both the total energy consumed by transport and the share of it coming from renewable sources. The data is updated every year as new figures become available.",
  // From the researchers
  "The Global Transport Effort (GTE) means achieving globally by 2035 a quarter drop in overall energy demand and shifting to one-third sustainable biofuels and renewable sources, considering that each country’s contributions to this global effort will reflect its national circumstances.",
]

/** Explains the Final / Useful switch, so the chart descriptions don't need to. */
export const ENERGY_TYPE_EXPLANATION = {
  title: "Final vs useful energy",
  paragraphs: [
    "Final energy is the energy delivered to vehicles: the fuel put in the tank, or the electricity used to charge a battery.",
    "Useful energy is what's left to actually move people and goods, after the losses in converting it, for example in an engine. Because electric drivetrains lose much less energy than combustion engines, shifting to electricity reduces final energy demand more than useful energy demand.",
  ],
}

export const CHART_DESCRIPTIONS: Record<
  "energy" | "shares",
  Record<EnergyType, string>
> = {
  energy: {
    final:
      "The stacked areas show the pathway for transport's final energy consumption by energy carrier, from 2010 to 2050. The lines compare the target pathway for total and renewable energy with the historical figures reported so far. Where the historical lines sit above the targets, consumption is running ahead of the pathway.",
    useful:
      "The stacked areas show the pathway for transport's useful energy consumption by energy carrier, from 2010 to 2050. The lines compare the target pathway for total and renewable useful energy with historical estimates. The gap between the two shows how far current trends are from the pathway.",
  },
  shares: {
    final:
      "The lines show three indicators of how transport's final energy mix is changing over time. They track the role of electricity, the part of it that is renewable, and the uptake of certified sustainable fuels in aviation and shipping. All three are shown as a percentage of the relevant total.",
    useful:
      "The lines show the same three indicators, calculated on useful energy. Because electric vehicles convert energy more efficiently, electricity's share is higher here than in final energy terms. All three are shown as a percentage of the relevant total.",
  },
}

/** Who develops the tracker; the list of organisations isn't confirmed yet. */
export const ABOUT: string[] = [
  "This tracker is developed by Climate Compatible Growth (CCG), the Institute of Transportation Studies at the University of California, Davis (ITS Davis), the Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ) and the University of Strathclyde. It is published on the Transport Data Commons, where the underlying data can be downloaded.",
]

/** Sources of the data shown in the charts. */
export const SOURCES: { citation: string; url?: string; usedFor: string }[] = [
  {
    citation:
      "[Organisation], [Title of the historical energy dataset] ([Year])",
    url: "https://example.org",
    usedFor: "Historical energy consumption and shares",
  },
  {
    citation: "[Organisation], [Title of the scenario publication] ([Year])",
    url: "https://example.org",
    usedFor: "Target pathway by energy carrier",
  },
  {
    citation: "[Organisation], [Title of the methodology note] ([Year])",
    usedFor: "Conversion from final to useful energy",
  },
]
