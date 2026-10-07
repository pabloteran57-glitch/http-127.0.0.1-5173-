import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const catalog = JSON.parse(readFileSync(resolve(root, "data/reference-catalog.json"), "utf8"));
const directory = resolve(root, "public/references");
mkdirSync(directory, { recursive: true });
const get = async url => {
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response;
};
async function save(url, name) {
  const response = await get(url);
  let mime = response.headers.get("content-type") ?? "";
  const bytes = Buffer.from(await response.arrayBuffer());
  if (mime.includes("octet-stream")) {
    if (bytes.subarray(0,4).toString() === "RIFF" && bytes.subarray(8,12).toString() === "WEBP") mime = "image/webp";
    else if (bytes[0] === 0xff && bytes[1] === 0xd8) mime = "image/jpeg";
    else if (bytes.subarray(1,4).toString() === "PNG") mime = "image/png";
  }
  if (!mime.match(/image|pdf/)) throw new Error(`Unexpected content type ${mime}`);
  if (mime.includes("image") && bytes.length < 5000) throw new Error("Small UI asset excluded; not a useful product reference");
  const ext = mime.includes("pdf") ? ".pdf" : mime.includes("webp") ? ".webp" : mime.includes("png") ? ".png" : mime.includes("avif") ? ".avif" : ".jpg";
  const file = `${name}${ext}`;
  writeFileSync(resolve(directory, file), bytes);
  return { url, local_path: `/references/${file}`, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex"), content_type: mime };
}
async function collect(part) {
  if (!part.physical) return { ...part, status: "software_no_physical_model", images: [] };
  try {
    const response = await get(part.page_url);
    if (/not-found|404/.test(response.url)) throw new Error("Product page no longer available");
    const html = (await response.text()).replaceAll("\\/", "/").replaceAll("&amp;", "&");
    const metas = [...html.matchAll(/<meta[^>]+>/g)].map(m => m[0]);
    const og = metas.filter(m => /og:image/.test(m)).map(m => m.match(/content=["']([^"']+)/)?.[1]);
    const urls = [...new Set([...og, ...(html.match(/https?:[^\s"<>\\]+/g) ?? [])])].filter(Boolean)
      .filter(url => /\.(jpg|jpeg|png|webp|avif)(\?|$)/i.test(url) && !/logo|favicon|header|banner|404|Benefits|PopUp|footer_social|retcode|smallrig-static/i.test(url));
    const host = new URL(part.page_url).hostname;
    let eligible = urls;
    if (host.includes("smallrig")) eligible = urls.filter(url => /static.smallrig.com\/mall\/img/.test(url) && !/1755684929787/.test(url));
    if (host.includes("sony")) eligible = urls.filter(url => /1200x1050|sony.scene7|sony.net\/is\/image|sony.*\.jpg/i.test(url));
    if (host.includes("smallhd")) eligible = urls.filter(url => /cdn.shopify.com/.test(url));
    if (host.includes("dji")) eligible = urls.filter(url => /djiits.com/.test(url));
    if (part.image_urls?.length) eligible = part.image_urls;
    const images = [];
    for (const [i, url] of [...new Set(eligible)].slice(0, 3).entries()) {
      try { images.push(await save(url, `${part.id}-${i + 1}`)); } catch (error) { console.log(`${part.id}: image failed: ${error.message}`); }
    }
    return { ...part, resolved_page: response.url, status: images.length ? "downloaded_visual_identity_review_required" : "no_product_image_extracted", images };
  } catch (error) { return { ...part, status: "unavailable", error: error.message, images: [] }; }
}
const wanted = process.argv.slice(2);
let existing = { parts: [], documents: [] };
if (wanted.length) existing = JSON.parse(readFileSync(resolve(root, "data/geometry-references.json"), "utf8"));
const results = wanted.length ? existing.parts.filter(p => !wanted.includes(p.id)) : [];
const queue = catalog.parts.filter(p => !wanted.length || wanted.includes(p.id));
async function worker() {
  while (queue.length) {
    const part = queue.shift();
    const result = await collect(part); results.push(result);
    console.log(`${part.id}: ${result.status} (${result.images.length} images)`);
  }
}
await Promise.all([worker(), worker(), worker()]);
const documents = wanted.length ? existing.documents : [];
for (const doc of wanted.length ? [] : catalog.documents) {
  try { documents.push({ id: doc.id, ...await save(doc.url, doc.id) }); console.log(`${doc.id}: downloaded`); }
  catch (error) { documents.push({ ...doc, status: "unavailable", error: error.message }); }
}
writeFileSync(resolve(root, "data/geometry-references.json"), JSON.stringify({ generated_on: new Date().toISOString(), license_note: catalog.license_note, parts: results.sort((a,b) => catalog.parts.findIndex(p => p.id === a.id) - catalog.parts.findIndex(p => p.id === b.id)), documents }, null, 2));
console.log(`Saved ${results.reduce((n,p) => n+p.images.length,0)} reference images and ${documents.filter(d=>d.local_path).length} documents.`);
