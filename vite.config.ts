import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import modelRegistry from "./data/model-assets.json";
import visualRegistry from "./data/product-visuals.json";
import pilotRegistry from "./data/pilot-model-assets.json";
import intake from "./data/catalog-intake.json";
import { pilotModelIssues, type PilotModelAsset } from "./src/lib/pilot-model-assets";
import { approvedProductVisual } from "./src/lib/product-visuals";
import type { ModelAsset } from "./src/lib/model-assets";

const publicBrandFiles = ["takegrid-mark.svg", "takegrid-app-icon.svg", "preview.html"];
const publicAssets: Plugin = {
  name: "takegrid-public-assets",
  apply: "build",
  generateBundle(_,bundle) {
    for (const name of publicBrandFiles) {
      this.emitFile({ type: "asset", fileName: `brand/${name}`, source: readFileSync(new URL(`./public/brand/${name}`, import.meta.url)) });
    }
    for (const asset of (modelRegistry.assets as ModelAsset[]).filter(a => a.status === "approved")) {
      this.emitFile({ type: "asset", fileName: asset.artifact.path.slice(1), source: readFileSync(new URL("./public" + asset.artifact.path, import.meta.url)) });
    }
    for(const visual of visualRegistry.assets){
      const model=(modelRegistry.assets as ModelAsset[]).find(a=>a.id===visual.id)??null;
      if(!approvedProductVisual(visual.part_id,model,visualRegistry.assets))this.error("Miniatura sin revisión: "+visual.id);
      const bytes=readFileSync(new URL("./public"+visual.image.path,import.meta.url));
      if(bytes.length!==visual.image.bytes||createHash("sha256").update(bytes).digest("hex")!==visual.image.sha256)this.error("Miniatura distinta de su huella: "+visual.id);
      this.emitFile({type:"asset",fileName:visual.image.path.slice(1),source:bytes});
    }
    if(pilotRegistry.scope!=="research_preview_only")this.error("Alcance del piloto alterado");
    for(const asset of pilotRegistry.assets as PilotModelAsset[]){
      const issues=pilotModelIssues(asset,intake.products.find(product=>product.id===asset.part_id));
      if(issues.length)this.error("Modelo de investigación sin revisión: "+issues.join("; "));
      for(const file of [asset.artifact,asset.image]){
        const bytes=readFileSync(new URL("./public"+file.path,import.meta.url));
        if(bytes.length!==file.bytes||createHash("sha256").update(bytes).digest("hex")!==file.sha256)this.error("Recurso del piloto distinto de su huella: "+asset.id);
        if(!modelRegistry.assets.some(model=>model.artifact.path===file.path)&&!visualRegistry.assets.some(visual=>visual.image.path===file.path))this.emitFile({type:"asset",fileName:file.path.slice(1),source:bytes});
      }
    }
    this.emitFile({ type: "asset", fileName: "404.html", source: '<!doctype html><html lang="es"><meta charset="utf-8"><title>Referencia no publicada</title><h1>Referencia no publicada</h1><p>Los medios del fabricante permanecen en el archivo de investigación local. Consulta los enlaces oficiales desde la ficha de la pieza.</p><a href="/">Volver a Takegrid</a></html>' });
    this.emitFile({type:"asset",fileName:"manifest.webmanifest",source:readFileSync(new URL("./public/manifest.webmanifest",import.meta.url))});
    const assets=[...new Set(["/index.html","/manifest.webmanifest","/brand/takegrid-mark.svg","/brand/takegrid-app-icon.svg",...visualRegistry.assets.map(v=>v.image.path),...pilotRegistry.assets.map(v=>v.image.path),...Object.keys(bundle).filter(name=>/^assets\/[\w-]+\.(js|css)$/.test(name)).map(name=>`/${name}`)])].sort();
    const digest=createHash("sha256").update(assets.join("\n"));
    visualRegistry.assets.forEach(v=>digest.update(v.image.sha256));
    pilotRegistry.assets.forEach(v=>digest.update(v.image.sha256).update(v.artifact.sha256));
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
