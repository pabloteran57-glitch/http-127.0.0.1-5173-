import {readFileSync} from "node:fs";
import sharp from "sharp";
const assets=JSON.parse(readFileSync("research/model-incoming/product-visuals-report.json","utf8")).assets,tiles=[];
for(const [i,asset] of assets.entries()){
  const title=Buffer.from(`<svg width="240" height="168"><text x="8" y="16" font-size="12" fill="white">${asset.part_id}</text></svg>`);
  tiles.push({input:await sharp("public"+asset.image.path).resize(240,168).flatten({background:"#344049"}).composite([{input:title}]).png().toBuffer(),left:i%4*240,top:Math.floor(i/4)*168});
}
await sharp({create:{width:960,height:Math.ceil(assets.length/4)*168,channels:3,background:"#344049"}}).composite(tiles).png().toFile("research/model-incoming/product-visuals-review.png");
