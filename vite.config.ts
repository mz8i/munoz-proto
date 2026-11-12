import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

import { LINK_PREVIEW, PAGE_TITLE } from "./src/content.ts"

/** The production site, used for the link preview URLs unless SITE_URL is set. */
const PRODUCTION_URL = "https://transport-data.github.io/gte-tracker/"

/** Fills the %…% placeholders in index.html with the page text. */
function pageText(): Plugin {
  // The deploy workflow sets SITE_URL, so each copy's previews use its own address
  const siteUrl = (process.env.SITE_URL || PRODUCTION_URL).replace(/\/?$/, "/")
  const values: Record<string, string> = {
    PAGE_TITLE,
    LINK_PREVIEW_DESCRIPTION: LINK_PREVIEW.description,
    LINK_PREVIEW_IMAGE_DESCRIPTION: LINK_PREVIEW.imageDescription,
    LINK_PREVIEW_SITE_NAME: LINK_PREVIEW.siteName,
    SITE_URL: siteUrl,
  }
  const escape = (text: string) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
  return {
    name: "page-text",
    transformIndexHtml: {
      order: "pre",
      handler: (html) =>
        html.replace(/%([A-Z_]+)%/g, (match, name: string) =>
          name in values ? escape(values[name]) : match
        ),
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // `pnpm build:offline` makes a single HTML file, with the scripts, styles,
  // fonts and images inlined, that opens from disk without a connection
  const offline = mode === "offline"
  return {
    // GitHub Pages serves the site from /<repo-name>/; the deploy workflow
    // sets BASE_PATH to match, so renaming the repo needs no change here
    base: offline
      ? "./"
      : process.env.BASE_PATH
        ? `${process.env.BASE_PATH}/`
        : "/",
    plugins: [
      pageText(),
      react(),
      tailwindcss(),
      ...(offline ? [viteSingleFile()] : []),
    ],
    resolve: {
      alias: {
        "@": resolve(import.meta.dirname, "./src"),
      },
    },
    build: offline ? { outDir: "dist-offline" } : {},
  }
})
