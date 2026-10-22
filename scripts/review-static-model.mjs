import {readFileSync} from "node:fs";
import sharp from "sharp";
import {authoredModel} from "./lib/authored-models.mjs";
import {renderProductVisual} from "./lib/render-product-visual.mjs";
const node=JSON.parse(readFileSync("data/layout-manifest.json","utf8")).nodes.find(n=>n.id==="smallrig-3751b");
const tiles=[];
for(const [i,viewDirection] of [[.8,.4,1.4],[0,0,1],[0,0,-1],[1,0,0],[0,1,.001]].entries()){
  const model=authoredModel(node),view=renderProductVisual(model,{partId:node.id,width:320,height:420,viewDirection});
  tiles.push({input:await sharp(Buffer.from(view.svg)).flatten({background:"#344049"}).png().toBuffer(),left:i*320,top:0});
  model.traverse(o=>o.geometry?.dispose());
}
await sharp({create:{width:1600,height:420,channels:3,background:"#344049"}}).composite(tiles).png().toFile("research/model-incoming/static-0219/model-review.png");
console.log("Cinco vistas propias; inspección visual requerida, no aprobación automática.");
