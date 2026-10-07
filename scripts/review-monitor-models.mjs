import {readFileSync, mkdirSync} from "node:fs";
import sharp from "sharp";
import {fileURLToPath} from "node:url";
import {authoredModel} from "./lib/authored-models.mjs";
import {renderProductVisual} from "./lib/render-product-visual.mjs";
const nodes=JSON.parse(readFileSync(new URL("../data/layout-manifest.json",import.meta.url),"utf8")).nodes;
const selected=nodes.filter(n=>["smallrig-4770","smallrig-2906b","smallrig-4830","sony-np-f970-pro"].includes(n.id));
const views=[[.8,.4,1.4],[0,0,1],[0,0,-1],[1,0,0],[0,1,.001]],tiles=[];
for(const [row,node] of selected.entries())for(const [column,viewDirection] of views.entries()){
  const model=authoredModel(node),render=renderProductVisual(model,{partId:node.id,width:280,height:240,viewDirection});
  const title=Buffer.from(`<svg width="280" height="240"><text x="10" y="20" fill="white" font-size="14">${node.id} / ${column+1}</text></svg>`);
  tiles.push({input:await sharp(Buffer.from(render.svg)).flatten({background:"#344049"}).composite([{input:title}]).png().toBuffer(),left:column*280,top:row*240});
  model.traverse(o=>{if(o.isMesh)o.geometry.dispose();});
}
mkdirSync(new URL("../research/model-incoming/",import.meta.url),{recursive:true});
await sharp({create:{width:1400,height:selected.length*240,channels:3,background:"#344049"}}).composite(tiles).png().toFile(fileURLToPath(new URL("../research/model-incoming/monitor-model-review.png",import.meta.url)));
console.log("Lámina local generada; no aprueba ni modifica el registro de mallas.");
