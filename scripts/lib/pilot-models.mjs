import { ExtrudeGeometry, Group, LatheGeometry, Shape, Vector2 } from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { finalizeVisual, visualPrimitives } from "./authored-models.mjs";

const { add, block, cylinder, ring, knurl, plate, shoe } = visualPrimitives;

// Formas propias desde vistas oficiales. Ninguna pieza define un encaje o puerto CAD.
function fx30(g) {
  plate(g, "FX30 / cuerpo con abertura optica aproximada", 100, 72, 61, [-14.85, -2.9, 5], [[14.85, 2.9, 24]], "alloy");
  block(g, "Hombro superior FX30", [100, 5.8, 58], [-14.85, 36, 5], "alloy", 2);
  const shape = new Shape();
  shape.moveTo(30.85, -38.9); shape.lineTo(51, -38.9); shape.quadraticCurveTo(64.85, -38.9, 64.85, -25);
  shape.lineTo(64.85, 24); shape.quadraticCurveTo(64.85, 38.9, 51, 38.9); shape.lineTo(37, 38.9);
  shape.quadraticCurveTo(28, 36, 30.85, 23); shape.lineTo(30.85, -38.9); shape.closePath();
  const grip = new ExtrudeGeometry(shape, { depth: 73, bevelEnabled: false, curveSegments: 12 });
  grip.translate(0, 0, -36.5); add(g, "Empunadura FX30 / contorno estimado", mergeVertices(grip), [0, 0, 0], "rubber");
  block(g, "Hombro negro de empunadura", [31, 4, 50], [48, 36.5, 7], "black", 3);
  ring(g, "Montura E / sin patron de bayoneta", 30.8, 25, 3, [0, 0, 40.75]);
  ring(g, "Interior de montura ilustrativo", 25, 23, 1.4, [0, 0, 38.9], "black");
  block(g, "Sensor APS-C / tamano publicado, pose estimada", [23.3, 15.5, .3], [0, 0, 33], "glass", .3);
  cylinder(g, "Liberacion de objetivo / estimada", 4.2, 1.8, [29, -20, 36.5], "black");
  cylinder(g, "REC frontal aproximado", 4.7, 1.5, [-50, -26, 36.3], "black");
  ring(g, "Aro REC", 4.8, 4.1, .25, [-50, -26, 37.2], "red");
  block(g, "Pantalla cerrada / no trayectoria de bisagra", [77, 49, 6], [-17, -2, -38.8], "black", 3);
  block(g, "Cristal LCD sin imagen copiada", [69, 41, .45], [-17, -2, -42.025], "glass", 1);
  block(g, "Bisagra LCD aproximada", [5, 44, 8], [-58, -2, -36], "dark", 1);
  knurl(g, "Rueda posterior de control", 8.5, 1.2, [33, -10, -37.3], "rubber", "z", 32);
  cylinder(g, "Centro de rueda", 4.4, 1.5, [33, -10, -37.5], "dark");
  for (const [x, y] of [[33, 17], [46, 17], [33, 5], [32, -27], [46, -27]]) cylinder(g, "Control posterior ilustrativo", 3, 1.1, [x, y, -37.1], "black");
  block(g, "MENU superior posterior", [10, 4, 1.2], [12, 29, -26.3], "black", .5);
  block(g, "Interruptor y modo / no simulados", [13, 2, 7], [33, 39, -21], "black", .7);
  knurl(g, "Dial trasero", 6.3, 2, [49, 38, -20], "rubber", "y", 28);
  cylinder(g, "REC superior", 4.7, 1, [28, 39, 15], "red", "y");
  for (const [x, z] of [[21, 1], [34, 1], [46, 1]]) cylinder(g, "IRIS WB ISO / ubicacion estimada", 3, 1.1, [x, 39, z], "black", "y", 20);
  knurl(g, "Dial frontal de empunadura", 8, 2, [51, 36.9, 24], "rubber", "y", 28);
  cylinder(g, "Disparador", 4, 1.1, [51, 38.3, 24], "black", "y");
  shoe(g, [-9, 39.7, -3], [0, 0, 0], 19, 21);
  // Huellas de roscas, no agujeros dimensionados ni anclajes utilizables por el planificador.
  for (const [x, z] of [[-45, 20], [-21, 20], [3, 20]]) cylinder(g, "Huella superior sin rosca CAD", 2.5, .2, [x, 39, z], "recess", "y", 16);
  for (const [y, z, h, d] of [[21, -5, 14, 20], [1, 9, 18, 28], [-20, -4, 15, 22]]) block(g, "Cubierta lateral cerrada / sin puerto inventado", [.5, h, d], [-65.15, y, z], "black", .8);
  block(g, "Puerta de tarjetas cerrada", [.4, 42, 27], [64.65, -2, -12], "dark", 1.5);
  block(g, "Cubierta de bateria / pose estimada", [28, .4, 40], [48, -38.7, -4], "black", 1);
  for (let i = 0; i < 8; i++) block(g, "Ventilacion inferior / dibujo aproximado", [1.7, .3, 18], [-42 + i * 4, -39, 3], "recess", .2);
}

function sel20(g) {
  const profile = [[30, -42.35], [31, -39], [32.5, -35], [33, -27], [34.5, -20], [35.8, -15], [36.4, 28], [36.75, 33], [36.75, 42.35], [33.5, 42.35], [32.5, 37], [28, 32]];
  const barrel = new LatheGeometry(profile.map(p => new Vector2(...p)), 64); barrel.rotateX(Math.PI / 2);
  add(g, "SEL20F18G / perfil propio sin parasol", barrel, [0, 0, 0], "dark");
  ring(g, "Montura posterior / sin contactos ni bayoneta", 30.8, 25, 1.4, [0, 0, -41.65]);
  cylinder(g, "Cristal posterior ilustrativo", 19, .3, [0, 0, -40.8], "glass");
  knurl(g, "Anillo de enfoque estimado", 36.35, 23, [0, 0, 15], "rubber", "z", 80);
  knurl(g, "Anillo de apertura estimado", 33.5, 7, [0, 0, -27], "rubber", "z", 72);
  for (const z of [-21.8, 2.8, 27.3]) ring(g, "Junta visual entre anillos", 36, 35.4, .6, [0, 0, z], "black");
  ring(g, "Frontal / filtro nominal 67 mm, sin paso roscado", 36.75, 33.5, 2, [0, 0, 41.35], "black");
  cylinder(g, "Elemento optico frontal ilustrativo", 29, .4, [0, 0, 35], "glass", "z", 64);
  ring(g, "Aro interior visual", 32, 30, .5, [0, 0, 36], "black");
  cylinder(g, "Boton de retencion de enfoque", 4.8, 1.6, [-35.2, 0, -8], "rubber", "x");
  block(g, "Panel AF MF / estimado", [1, 6, 10], [-32.9, -9, -17], "black", .4);
  block(g, "Selector AF MF ilustrativo", [1.4, 4, 3], [-33.7, -9, -17], "steel", .3);
  block(g, "Placa de identificacion sin logotipo copiado", [1, 6, 7], [-34.4, 11, -8], "alloy", .4);
  cylinder(g, "Indice visual de montura", .8, .3, [-31.5, 0, -36], "steel", "x", 12);
}

function npfz(g) {
  block(g, "NP-FZ100 / carcasa propia", [38.7, 22.7, 51.7], [0, 0, 0], "rubber", 2.5);
  block(g, "Union de carcasa estimada", [38.1, .25, 46], [0, 10.8, 0], "dark", .3);
  for (const x of [-16, 16]) block(g, "Rebaje longitudinal visual", [1, .3, 43], [x, 11.2, 1], "black", .4);
  block(g, "Cara de insercion sin patron de contactos", [32, 15, .3], [0, -1, -25.7], "black", 1);
  block(g, "Etiqueta propia sin fotografia o marca", [24, .3, 30], [0, 11.2, 1], "dark", 1);
  block(g, "Indicador de serie ilustrativo", [6, .35, 5], [0, 11.25, 8], "green", .7);
  // El pinout no esta publicado: no dibujar contactos ni asignar polaridad por apariencia.
}

export const pilotAuthors = { "sony-fx30": fx30, "sony-fe-20-f18-g": sel20, "sony-np-fz100": npfz };
export function pilotModel(partId) {
  if (!pilotAuthors[partId]) throw new Error("Producto sin autor propio: " + partId);
  const group = new Group(); group.name = partId; pilotAuthors[partId](group);
  return finalizeVisual(group, { id: partId });
}
