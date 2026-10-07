import { readFileSync } from "node:fs";

const parts = JSON.parse(readFileSync(new URL("../data/parts-manifest.json", import.meta.url), "utf8")).parts;
const wanted = process.argv.slice(2);
if (wanted[0] === "--url") {
  const response = await fetch(wanted[1], { signal: AbortSignal.timeout(20000) });
  const html = (await response.text()).replaceAll("\\/", "/").replaceAll("&amp;", "&");
  console.log(JSON.stringify({ page: response.url, images: [...new Set(html.match(/(?:https?:)?\/\/[^\s"<>\\]+|(?:src|data-src)=["'][^"']+/g) ?? [])].filter(s => /image|jpg|webp|png|pdf|sony.scene7|cloudfront/.test(s)).slice(0,120) }));
}
for (const part of parts.filter(p => wanted[0] !== "--url" && (!wanted.length || wanted.includes(p.id)))) {
  try {
    const response = await fetch(part.primary_source_url, { signal: AbortSignal.timeout(20000) });
    const html = (await response.text()).replaceAll("\\/", "/").replaceAll("&amp;", "&");
    const urls = [...new Set(html.match(/https?:[^\s"<>\\]+/g) ?? [])]
      .filter(url => /\.(png|jpg|jpeg|webp|avif|glb|gltf|step|stp|pdf)(\?|$)/i.test(url));
    const og = [...html.matchAll(/<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)/g)].map(m => m[1]);
    console.log(JSON.stringify({ id: part.id, status: response.status, page: response.url, og, assets: urls.slice(0, 100) }));
  } catch (error) { console.log(JSON.stringify({ id: part.id, error: error.message })); }
}
