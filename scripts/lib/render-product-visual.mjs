import { AmbientLight, Box3, DirectionalLight, OrthographicCamera, Scene, Vector3 } from "three";
import { SVGRenderer } from "three/examples/jsm/renderers/SVGRenderer.js";

// Adaptador SVG limitado al renderer: no procesa HTML ni medios externos.
class SvgElement {
  constructor(tag) { this.tag = tag; this.attributes = new Map(); this.childNodes = []; this.style = {}; }
  setAttribute(key, value) { this.attributes.set(key, String(value)); }
  appendChild(node) { this.childNodes.push(node); }
  removeChild(node) { this.childNodes.splice(this.childNodes.indexOf(node), 1); }
  serialize() {
    const escape = value => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
    const attributes = [...this.attributes].map(([key, value]) => ` ${key}="${escape(value)}"`).join("");
    return `<${this.tag}${attributes}>${this.childNodes.map(node => node.serialize()).join("")}</${this.tag}>`;
  }
}

export const VISUAL_SIZE = { width: 400, height: 280 };

export function renderProductVisual(model, { partId, width = VISUAL_SIZE.width, height = VISUAL_SIZE.height, viewDirection }) {
  const previousDocument = globalThis.document;
  globalThis.document = { createElementNS: (_namespace, tag) => new SvgElement(tag) };
  try {
    const scene = new Scene(); scene.add(model);
    scene.add(new AmbientLight("#edf3f5", 1.2));
    for (const [position, intensity] of [[[.8, 1.2, 1], 1.4], [[-1, .5, -1], .6]]) {
      const light = new DirectionalLight("#ffffff", intensity); light.position.set(...position); scene.add(light);
    }
    model.updateMatrixWorld(true);
    const box = new Box3().setFromObject(model), center = box.getCenter(new Vector3());
    const side = partId === "smallhd-indie-7" ? -1 : 1;
    const direction = new Vector3(...(viewDirection??[.75,.45,1.4*side])).normalize();
    const camera = new OrthographicCamera(-1, 1, 1, -1, .001, 10);
    camera.position.copy(center).addScaledVector(direction, 2); camera.lookAt(center); camera.updateMatrixWorld(true);
    const viewCorners = [];
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) viewCorners.push(new Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse));
    const viewBox = new Box3().setFromPoints(viewCorners), span = viewBox.getSize(new Vector3());
    const halfHeight = Math.max(span.y / 2, span.x / 2 / (width / height)) * 1.16;
    camera.top = halfHeight; camera.bottom = -halfHeight; camera.right = halfHeight * width / height; camera.left = -camera.right;
    camera.updateProjectionMatrix();
    const renderer = new SVGRenderer(); renderer.setSize(width, height); renderer.setPrecision(3);
    renderer.overdraw = .3; renderer.render(scene, camera);
    renderer.domElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    return { svg: renderer.domElement.serialize(), faces: renderer.info.render.faces };
  } finally {
    if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument;
  }
}
