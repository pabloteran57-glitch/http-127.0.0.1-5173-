import { readFileSync } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const publicBrandFiles = ["takegrid-mark.svg", "takegrid-app-icon.svg", "preview.html"];
const publicAssets: Plugin = {
  name: "takegrid-public-assets",
  apply: "build",
  generateBundle() {
    for (const name of publicBrandFiles) {
      this.emitFile({ type: "asset", fileName: `brand/${name}`, source: readFileSync(new URL(`./public/brand/${name}`, import.meta.url)) });
    }
    this.emitFile({ type: "asset", fileName: "404.html", source: '<!doctype html><html lang="es"><meta charset="utf-8"><title>Referencia no publicada</title><h1>Referencia no publicada</h1><p>Los medios del fabricante permanecen en el archivo de investigación local. Consulta los enlaces oficiales desde la ficha de la pieza.</p><a href="/">Volver a Takegrid</a></html>' });
  },
};

export default defineConfig(({ mode }) => {
  const publicDemo = mode === "public-demo";
  return {
    plugins: [react(), ...(publicDemo ? [publicAssets] : [])],
    // El despliegue público sólo incluye recursos propios expresamente permitidos.
    publicDir: publicDemo ? false : "public",
    define: { __PUBLIC_DEMO__: JSON.stringify(publicDemo) },
    build: { outDir: publicDemo ? "dist-public" : "dist", rollupOptions: { treeshake: "safest" } },
  };
});

