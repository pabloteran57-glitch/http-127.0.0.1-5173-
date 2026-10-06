import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const publicBrandFiles = ["takegrid-mark.svg", "takegrid-app-icon.svg", "preview.html"];
const publicAssets: Plugin = {
  name: "takegrid-public-assets",
  apply: "build",
  generateBundle(_,bundle) {
    for (const name of publicBrandFiles) {
      this.emitFile({ type: "asset", fileName: `brand/${name}`, source: readFileSync(new URL(`./public/brand/${name}`, import.meta.url)) });
    }
    this.emitFile({ type: "asset", fileName: "404.html", source: '<!doctype html><html lang="es"><meta charset="utf-8"><title>Referencia no publicada</title><h1>Referencia no publicada</h1><p>Los medios del fabricante permanecen en el archivo de investigación local. Consulta los enlaces oficiales desde la ficha de la pieza.</p><a href="/">Volver a Takegrid</a></html>' });
    this.emitFile({type:"asset",fileName:"manifest.webmanifest",source:readFileSync(new URL("./public/manifest.webmanifest",import.meta.url))});
    const assets=["/index.html","/manifest.webmanifest","/brand/takegrid-mark.svg","/brand/takegrid-app-icon.svg",...Object.keys(bundle).filter(name=>/^assets\/[\w-]+\.(js|css)$/.test(name)).map(name=>`/${name}`)].sort();
    const digest=createHash("sha256").update(assets.join("\n"));
    for(const path of ["./index.html","./public/manifest.webmanifest","./public/offline-worker.js",...publicBrandFiles.map(name=>`./public/brand/${name}`)])digest.update(readFileSync(new URL(path,import.meta.url)));
    const hash=digest.digest("hex").slice(0,16);
    const worker=readFileSync(new URL("./public/offline-worker.js",import.meta.url),"utf8").replace("__BUILD_HASH__",hash).replace("__PRECACHE_ASSETS__",JSON.stringify(assets));
    this.emitFile({type:"asset",fileName:"sw.js",source:worker});
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
