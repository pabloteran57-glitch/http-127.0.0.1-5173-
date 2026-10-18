import {mkdirSync, readFileSync} from "node:fs";
import sharp from "sharp";
import {authoredModel} from "./lib/authored-models.mjs";
import {renderProductVisual} from "./lib/render-product-visual.mjs";

const nodes=JSON.parse(readFileSync("data/layout-manifest.json","utf8")).nodes;
const views=[[.8,.4,1.4],[0,0,1],[0,0,-1],[1,0,0],[0,1,.001]],tiles=[];
for(const [row,id] of ["smallrig-4346","smallrig-2896c"].entries()) {
  const node=nodes.find(n=>n.id===id);
  for(const [column,viewDirection] of views.entries()) {
    const model=authoredModel(node),render=renderProductVisual(model,{partId:id,width:320,height:280,viewDirection});
    const title=Buffer.from(`<svg width="320" height="280"><text x="10" y="20" fill="white" font-size="14">${id} / ${column+1}</text></svg>`);
    tiles.push({input:await sharp(Buffer.from(render.svg)).flatten({background:"#344049"}).composite([{input:title}]).png().toBuffer(),left:column*320,top:row*280});
    model.traverse(o=>{if(o.isMesh)o.geometry.dispose();});
  }
}
mkdirSync("research/model-incoming/support-0218",{recursive:true});
await sharp({create:{width:1600,height:560,channels:3,background:"#344049"}}).composite(tiles).png().toFile("research/model-incoming/support-0218/model-review.png");
console.log("Diez vistas propias de revisión; no aprueban automáticamente los modelos.");
