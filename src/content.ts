import type { EnergyType } from "@/data/schema"

/**
 * The page's text, kept apart from the layout so the wording can be updated
 * in one place.
 *
 * content/page-text.md holds the same text, plus the short labels set in the
 * chart components, in a form for sharing with the researchers. Keep the two
 * in sync: text edited there is copied back here.
 */

export const PAGE_TITLE = "Tracking the Global Transport Effort"
export const PAGE_SUBTITLE =
  "Declaration “Towards Resilient and Low-Emission Transport Systems for People, Development and the Planet”"

export const INTRO: string[] = [
  "This tracker follows global progress in transport energy use against the pathway defined in the IEA’s Net Zero Roadmap (2023) to meet the Paris Agreement’s 1.5 °C goal. Based on this pathway, the Declaration sets out the Global Transport Effort for 2035. It has been signed by 11 countries: Austria, Brazil, Chile, Colombia, Costa Rica, the Dominican Republic, Honduras, Norway, Portugal, Slovenia and Spain. The tracker compares the latest historical data with this 2035 effort and the pathway’s 2050 values, for both the total energy consumed by transport and the share of it coming from renewable sources. The data is updated every year as new figures become available.",
  // The Global Transport Effort definition, set apart on the page
  "The Global Transport Effort (GTE) means achieving globally by 2035 a quarter drop in overall energy demand and shifting to one-third sustainable biofuels and renewable sources, considering that each country’s contributions to this global effort will reflect its national circumstances.",
]

/** Explains the Final / Useful switch, so the chart descriptions don't need to. */
export const ENERGY_TYPE_EXPLANATION = {
  title: "Final vs useful energy",
  paragraphs: [
    "Final energy is the energy delivered to vehicles: the fuel put in the tank, or the electricity used to charge a battery.",
    "Useful energy is the kinetic energy needed to actually move people and goods, after the losses in converting it, for example in an engine. Because electric drivetrains lose much less energy than combustion engines, shifting to electricity reduces final energy demand more than useful energy demand.",
  ],
}

export const CHART_DESCRIPTIONS: Record<
  "energy" | "shares",
  Record<EnergyType, string>
> = {
  energy: {
    final:
      "The stacked areas show the IEA Net Zero pathway for transport’s final energy consumption by energy carrier, from 2010 to 2050. The lines compare the pathway for total and renewable energy with the historical figures reported so far, and the markers show the Global Transport Effort for 2035. The gap between the historical and pathway lines shows the distance still to cover to get on track.",
    useful:
      "The stacked areas show transport’s useful energy consumption by energy carrier, from 2010 to 2050, implied by the IEA Net Zero pathway, calculated following the methodology outlined in the GIZ report Tracking Global Progress on Cleaner Transport. The lines compare the pathway for total and renewable useful energy with historical estimates, and the markers show the Global Transport Effort for 2035. The gap between the historical and pathway lines shows the distance still to cover to get on track.",
  },
  shares: {
    final:
      "The lines show three indicators of how transport’s final energy mix is changing over time. They track the role of electricity in the transport energy mix, the part of it that is renewable, and the uptake of fuels that are certified as sustainable according to internationally agreed criteria (currently only defined for aviation). All three are shown as a percentage of the relevant total.",
    useful:
      "The lines show three indicators of how transport’s useful energy mix is changing over time. They track the role of electricity in the transport energy mix, the part of it that is renewable, and the uptake of fuels that are certified as sustainable according to internationally agreed criteria (currently only defined for aviation). All three are shown as a percentage of the relevant total. Higher shares of electricity, in comparison with final energy shares, reflect better conversion efficiency for electric powertrains in comparison with combustion.",
  },
}

/** The dataset behind the tracker, on the Transport Data Commons portal. */
export const DATASET_URL =
  "https://portal.transport-data.org/@uc-davis/tracking-the-global-transport-effort"

/**
 * Who develops the tracker; the list of organisations isn't confirmed yet.
 * Links are written as [text](url).
 */
export const ABOUT: string[] = [
  `This tracker is developed by Climate Compatible Growth (CCG), the Institute of Transportation Studies at the University of California, Davis (ITS Davis), the Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ) and the University of Strathclyde. It is published on the Transport Data Commons, where the [underlying data](${DATASET_URL}) can be downloaded.`,
]

/** Sources of the data shown in the charts. */
export const SOURCES: { citation: string; url?: string; usedFor: string }[] = [
  {
    citation: "International Energy Agency (IEA), World energy balances (2025)",
    url: "https://www.iea.org/data-and-statistics/data-product/world-energy-balances",
    usedFor: "Historical energy consumption and shares until 2023",
  },
  {
    citation:
      "European Union 2026, European Commission, Joint Research Centre (JRC), EDGAR - Emissions Database for Global Atmospheric Research, Global Greenhouse Gas Emissions (2026)",
    url: "https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/EDGAR/datasets/EDGAR_2026_GHG/IEA_EDGAR_CO2_1970_2025.zip",
    usedFor: "Estimating 2023 to 2025 changes in transport fossil fuel demand",
  },
  {
    citation: "EMBER, Yearly electricity data (2026)",
    url: "https://ember-energy.org/data/yearly-electricity-data/",
    usedFor: "Data on electricity generation mix, 2023-25",
  },
  {
    citation: "IEA, Global EV Data (2026)",
    url: "https://www.iea.org/data-and-statistics/data-product/global-ev-outlook-2026#global-ev-data",
    usedFor:
      "Informing electricity demand growth in transport, 2023-25, considering EV stock, 0.05 kWh/km and 6000 km/year for two-wheelers, 0.17 kWh/km and 12000 km/year for cars, 0.17 kWh/km and 20000 km/year for light commercial vehicles, 1 kWh/km and 60000 km/year for buses and trucks, and 33% all-electric driving for PHEVs",
  },
  {
    citation: "IEA, Global Hydrogen Review 2026 (2026)",
    url: "https://www.iea.org/reports/global-hydrogen-review-2026",
    usedFor: "Informing transport hydrogen demand",
  },
  {
    citation: "OECD/FAO, OECD-FAO Agricultural Outlook 2026-2035 (2026)",
    url: "https://doi.org/10.1787/47874669-en",
    usedFor: "Informing biofuel demand growth, 2023-25",
  },
  {
    citation:
      "ICAO, ICAO tracker of CORSIA Certified Fuels and Economic operators (2026)",
    url: "https://www.icao.int/CORSIA/corsia-certified-fuels",
    usedFor: "CORSIA eligible fuels production data",
  },
  {
    citation: "GIZ, Tracking Global Progress on Cleaner Transport (2026)",
    url: "https://changing-transport.org/publications/tracking-global-progress-on-cleaner-transport/",
    usedFor:
      "Final to useful energy conversion methodology and other methodological considerations",
  },
]
