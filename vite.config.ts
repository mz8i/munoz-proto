import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

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
    plugins: [react(), tailwindcss(), ...(offline ? [viteSingleFile()] : [])],
    resolve: {
      alias: {
        "@": resolve(import.meta.dirname, "./src"),
      },
    },
    build: offline ? { outDir: "dist-offline" } : {},
  }
})
