import { Box3, BoxGeometry, CylinderGeometry, ExtrudeGeometry, Group, LatheGeometry, Mesh, MeshStandardMaterial, Path, Shape, SphereGeometry, TorusGeometry, Vector2, Vector3 } from "three";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Detalles visuales estimados desde referencias; no son patrones de mecanizado.
const palette = {
  alloy: ["#565b60", .4, .72], dark: ["#292e34", .42, .57], rubber: ["#171b1f", .08, .8],
  black: ["#0b1015", .25, .46], steel: ["#a4adb2", .9, .29], recess: ["#030608", .05, .95],
  glass: ["#163f50", .5, .18], red: ["#bb3438", .3, .44], orange: ["#c86532", .25, .45],
  green: ["#61b4a1", .1, .6], carbon: ["#353b40", .5, .56], gold: ["#bca477", .85, .4],
  natoRail: ["#292e34", .42, .57],
};
const materials = Object.fromEntries(Object.entries(palette).map(([id, [color, metalness, roughness]]) => [id, new MeshStandardMaterial({ name: id, color, metalness, roughness })]));

function rounded(w, h, radius) {
  const s = new Shape(), r = Math.min(radius, w / 2, h / 2), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); s.closePath(); return s;
}
function add(g, name, geometry, at = [0, 0, 0], material = "dark", rotation = [0, 0, 0]) {
  const m = new Mesh(geometry, materials[material]); m.name = name; m.position.set(...at); m.rotation.set(...rotation); g.add(m); return m;
}
function block(g, name, size, at, material = "dark", radius = 1.2, rotation) {
  const [w, h, d] = size, bevel = Math.min(radius * .3, d * .2, .65);
  const geometry = new ExtrudeGeometry(rounded(w - 2 * bevel, h - 2 * bevel, radius), { depth: d - 2 * bevel, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 1, curveSegments: 6, steps: 1 });
  geometry.translate(0, 0, -d / 2 + bevel);
  return add(g, name, mergeVertices(geometry), at, material, rotation);
}
function cylinder(g, name, radius, depth, at, material = "dark", axis = "z", segments = 32) {
  return add(g, name, new CylinderGeometry(radius, radius, depth, segments), at, material, axis === "z" ? [Math.PI / 2, 0, 0] : axis === "x" ? [0, 0, Math.PI / 2] : [0, 0, 0]);
}
function ring(g, name, outside, inside, depth, at, material = "steel", axis = "z") {
  const s = new Shape(); s.absarc(0, 0, outside, 0, 2 * Math.PI); const p = new Path(); p.absarc(0, 0, inside, 0, 2 * Math.PI, true); s.holes.push(p);
  const geom = new ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 24 }); geom.translate(0, 0, -depth / 2);
  return add(g, name, mergeVertices(geom), at, material, axis === "x" ? [0, Math.PI / 2, 0] : axis === "y" ? [-Math.PI / 2, 0, 0] : [0, 0, 0]);
}
function screw(g, at, axis = "z", radius = 2) {
  cylinder(g, "Cabeza de tornillo ilustrativa", radius, .7, at, "steel", axis, 16);
  const a = axis === "z" ? [0, 0, .4] : axis === "y" ? [0, .4, 0] : [-.4, 0, 0];
  block(g, "Ranura ilustrativa", axis === "z" ? [radius * 1.4, .6, .3] : axis === "y" ? [radius * 1.4, .3, .6] : [.3, radius * 1.4, .6], at.map((n, i) => n + a[i]), "recess", .1);
}
function knurl(g, name, radius, depth, at, material = "rubber", axis = "z", count = 48) {
  cylinder(g, name, radius - .3, depth, at, material, axis, count);
  for (let i = 0; i < count; i++) {
    const a = i * 2 * Math.PI / count, c = Math.cos(a), s = Math.sin(a);
    const p = axis === "y" ? [at[0] + c * radius, at[1], at[2] + s * radius] : axis === "x" ? [at[0], at[1] + c * radius, at[2] + s * radius] : [at[0] + c * radius, at[1] + s * radius, at[2]];
    add(g, "Estriado visual", new BoxGeometry(...(axis === "z" ? [.6, .7, depth] : axis === "y" ? [.6, depth, .7] : [depth, .6, .7])), p, material, axis === "z" ? [0, 0, a] : axis === "y" ? [0, -a, 0] : [a, 0, 0]);
  }
}
function plate(g, name, w, h, d, at, holes = [], material = "dark", rotation = [0, 0, 0]) {
  const s = rounded(w, h, 2);
  for (const [x, y, r] of holes) { const p = new Path(); p.absarc(x, y, r, 0, 2 * Math.PI, true); s.holes.push(p); }
  const geom = new ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 12 }); geom.translate(0, 0, -d / 2);
  return add(g, name, mergeVertices(geom), at, material, rotation);
}
function jack(g, name, at, radius = 2.4, axis = "x") {
  ring(g, name, radius, radius * .7, .4, at, "steel", axis);
  cylinder(g, name + " / fondo visual", radius * .7, .35, at, "recess", axis, 20);
}
function lever(g, at, axis = "x") {
  cylinder(g, "Pivote de palanca", 4, 6, at, "steel", axis, 20);
  block(g, "Palanca de apriete ilustrativa", axis === "x" ? [3, 16, 8] : [16, 3, 8], [at[0], at[1] - 5, at[2]], "dark", 1);
}
function clamps(g, at, w = 80, depth = 32, h = 26) {
  plate(g, "Abrazadera doble / paso real de 15 mm", w, h, depth, at, [[-30, 0, 7.5], [30, 0, 7.5]]);
  for (const s of [-1, 1]) lever(g, [at[0] + s * (w / 2 + 2), at[1] - 1, at[2]]);
}
function beam(g, a, b, width, depth, material = "carbon") {
  const delta = new Vector3(...b).sub(new Vector3(...a));
  const m = block(g, "Brazo / cinemática no simulada", [width, delta.length(), depth], a.map((n, i) => (n + b[i]) / 2), material, 2);
  m.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), delta.normalize()); return m;
}
function shoe(g, at, rotation = [0, 0, 0], w = 24, d = 24) {
  const p = new Group(); p.position.set(...at); p.rotation.set(...rotation); g.add(p);
  block(p, "Base de zapata / no cota de fabricación", [w, 3, d], [0, -1.5, 0]);
  for (const s of [-1, 1]) {
    block(p, "Carril de zapata", [3, 3, d], [s * (w / 2 - 1.5), 1.5, 0], "alloy", .4);
    block(p, "Labio de zapata", [5, 1, d], [s * (w / 2 - 2.5), 2.5, 0], "alloy", .3);
  }
}
function camera(g) {
  plate(g, "Cuerpo de magnesio / abertura óptica", 104, 72, 61, [-12.85, -2.9, 7], [[12.85, 2.9, 24]], "alloy");
  block(g, "Placa superior", [103, 5.8, 58], [-13.35, 36, 7], "alloy", 3);
  const grip = new Shape(); grip.moveTo(34, -38); grip.lineTo(52, -38); grip.quadraticCurveTo(63.45, -38, 63.45, -24);
  grip.lineTo(63.45, 23); grip.quadraticCurveTo(63.45, 40.85, 50, 40.85); grip.lineTo(31, 39); grip.quadraticCurveTo(26, 36, 31, 25); grip.lineTo(34, -38);
  const geom = new ExtrudeGeometry(grip, { depth: 67.8, bevelEnabled: true, bevelThickness: 2, bevelSize: 1.4, bevelSegments: 2, curveSegments: 8 }); geom.rotateX(Math.PI / 2); geom.translate(0, 31.8, 0);
  add(g, "Empuñadura contorneada", mergeVertices(geom), [0, 0, 0], "rubber");
  block(g, "Hombro de controles", [34, 9, 36], [46, 34, 19], "black", 3);
  ring(g, "Montura E / sin bayoneta mecánica", 30.8, 25.1, 3.4, [0, 0, 40.55]);
  ring(g, "Aro interior", 25.1, 22.8, 1.4, [0, 0, 39.1], "black");
  block(g, "Sensor / representación visual", [35.6, 23.8, .3], [0, 0, 36.1], "glass", .5);
  for (const a of [.55, 2.05, 3.15, 4.9]) screw(g, [Math.cos(a) * 28, Math.sin(a) * 28, 42.15], "z", 1.7);
  cylinder(g, "Liberador de montura", 4.1, 2.4, [29, -20, 39], "black");
  cylinder(g, "REC frontal", 4.8, 2, [-52, -27, 37.5], "black");
  ring(g, "Aro REC", 4.9, 4.3, .2, [-52, -27, 38.6], "red");
  block(g, "Pantalla abatible cerrada", [78, 51, 6], [-16, -2, -38.65], "black", 2.8);
  block(g, "Cristal posterior / sin imagen de fabricante", [70, 42, .4], [-16, -2, -41.85], "glass", 1.2);
  block(g, "Bisagra de pantalla", [6, 44, 8], [-57, -2, -37], "dark", 1);
  for (const [x, y] of [[30, 17], [30, 6], [30, -27], [42, -27]]) cylinder(g, "Botón posterior", 3.2, 1.2, [x, y, -26], "black");
  knurl(g, "Rueda posterior", 9, 1.8, [31, -10, -27], "rubber", "z", 32);
  cylinder(g, "Centro de rueda", 4.8, 2, [31, -10, -28], "dark");
  knurl(g, "Dial superior de empuñadura", 8.5, 3, [48, 38, 25], "rubber", "y", 32);
  knurl(g, "Dial posterior superior", 6.5, 3, [32, 36.5, -15], "rubber", "y", 28);
  cylinder(g, "REC superior", 4.5, 1.4, [29, 39.2, 16], "red", "y");
  cylinder(g, "Multiselector", 4.2, 1.8, [44, 38.5, 3], "black", "y");
  for (const x of [19, 3]) cylinder(g, "Botones WB / ISO", 3.5, 1.2, [x, 39.2, 21], "black", "y", 20);
  shoe(g, [-8, 41, -2], [0, 0, 0], 19, 21);
  for (const x of [-43, -20, 5]) jack(g, "Rosca superior aproximada", [x, 38.85, 22], 3, "y");
  for (let i = 0; i < 9; i++) block(g, "Ventilación lateral", [1, 1.7, 17], [-64.85, -29 + i * 3, 17], "recess", .3);
  block(g, "Zona HDMI / cubierta omitida para ver conexión", [.5, 10, 20], [-64.8, -3, 15], "black", .4);
  block(g, "Zona USB / cubierta", [.5, 11, 15], [-64.8, -21, -8], "black", .4);
  jack(g, "MIC / zona canónica aproximada", [-64.85, 20, -3], 2.2);
  block(g, "Puerta de batería inferior", [28, .4, 39], [45, -38.65, -4], "black", 1);
  block(g, "Tapa de tarjetas", [.4, 43, 27], [64.8, -2, -11], "dark", 1.2);
}
function lens(g) {
  const profile = [[29, -60.8], [31, -57], [33, -53], [33, -43], [40.5, -35], [41.7, -31], [41.7, 49], [44.25, 52], [44.25, 60.8], [41, 60.8], [40, 56], [34, 53], [30, 50]];
  const geom = new LatheGeometry(profile.map(p => new Vector2(...p)), 64); geom.rotateX(Math.PI / 2);
  // Lathe Y se transforma a +Z; invertir el perfil evita confundir montura y frontal.
  geom.rotateY(Math.PI); add(g, "Barril de SEL1635GM / sin parasol", geom, [0, 0, 0], "dark");
  ring(g, "Montura posterior", 31, 26, 2, [0, 0, -59.8]);
  knurl(g, "Anillo de zoom", 41.9, 22, [0, 0, -19], "rubber", "z", 96);
  knurl(g, "Anillo de enfoque", 42.15, 24, [0, 0, 31], "rubber", "z", 96);
  for (const z of [-31.5, -7, 18, 44]) ring(g, "Junta entre anillos", 42.1, 40.9, .7, [0, 0, z], "black");
  ring(g, "Frontal / filtro 82 mm nominal", 44.25, 41, 3, [0, 0, 59.3], "black");
  cylinder(g, "Elemento óptico visual", 36.2, .7, [0, 0, 54], "glass", "z", 64);
  for (const r of [37, 38, 39.2, 40.2]) ring(g, "Reflejo de aro interno", r + .25, r, .25, [0, 0, 55.5], "dark");
  cylinder(g, "Retención de enfoque", 5.1, 1.6, [-42, -2, 4], "rubber", "x");
  block(g, "Placa de selector AF/MF", [1.2, 7, 12], [-37.6, -5, -40], "black", .5);
  block(g, "Selector", [1.7, 6, 2.5], [-38.4, -5, -40], "steel", .2);
  block(g, "Marcador de serie / sin logotipo copiado", [1.1, 7, 8], [-42, 11, 4], "orange", .6);
  cylinder(g, "Índice blanco de montura", 1, .3, [-32.5, 0, -51], "steel", "x", 12);
}
function cage(g, node) {
  plate(g, "Base de jaula abierta", 154, 60, 5, [0, -47, 0], [[-38, 0, 3], [12, 0, 4]], "dark", [-Math.PI / 2, 0, 0]);
  plate(g, "Lateral con acceso HDMI", 22, 90, 5, [-74, 0, 4], [[0, -32, 3], [0, -18, 3], [0, 32, 3]], "dark", [0, Math.PI / 2, 0]);
  block(g, "Contorno de empuñadura abierto", [4, 80, 7], [73, -2, 22], "dark", 1.2);
  plate(g, "Riel NATO superior desmontable", 84, 17, 4.5, [-18, 46, 6], [[-28, 0, 3], [-15, 0, 2], [0, 0, 3], [17, 0, 2], [29, 0, 3]], "natoRail", [-Math.PI / 2, 0, 0]);
  block(g, "Abrazadera HDMI / cuerpo", [10, 36, 24], [-77, 3, 7], "alloy", 2);
  block(g, "Mordaza HDMI", [5, 34, 20], [-81, 3, 7], "dark", 1.6);
  knurl(g, "Tornillo de abrazadera", 3.8, 14, [-76, 29, 7], "steel", "y", 24);
  screw(g, [-81, 15, 20], "z", 2.2); screw(g, [-81, -8, 20], "z", 2.2);
  block(g, "Placa HawkLock inferior", [59, 5, 52], [0, -51, -1], "alloy", 1.5);
  for (const s of [-1, 1]) block(g, "Labio de liberación rápida", [4, 3, 49], [s * 27, -53, -1], "dark", .6);
  for (const p of node.mounting_points ?? []) shoe(g, p.local_position_mm, p.rotation_deg.map(v => v * Math.PI / 180), p.size_xyz_mm[0], p.size_xyz_mm[2]);
}
function receiver(g) {
  block(g, "DMR02 / carcasa", [54.2, 17.7, 28.36], [0, 1.2, 0], "dark", 3.5);
  block(g, "Marco OLED", [34, .8, 17], [-7, 10.05, 0], "black", 1.4);
  block(g, "Pantalla / sin telemetría real", [31, .3, 14], [-7, 10.6, 0], "glass", 1);
  knurl(g, "Dial de ganancia", 6.8, 2.8, [18.4, 9.75, 0], "rubber", "y", 36);
  ring(g, "Acento naranja del dial", 5.9, 5.5, .25, [18.4, 11.2, 0], "orange", "y");
  block(g, "Zapata integrada / sin adaptador MI", [20, 3.5, 18], [0, -9.5, 0], "steel", .5);
  block(g, "Cuello de zapata", [14, 2, 15], [0, -7.2, 0], "dark", .5);
  jack(g, "OUT / anclaje aproximado", [-27.1, 0, -6]);
  jack(g, "Auriculares / posición ilustrativa", [-27.1, 0, 6]);
  block(g, "Botón de encendido", [.4, 3, 7], [27, 1, 0], "rubber", .6);
}
function baseplate(g) {
  clamps(g, [0, -1, 0], 80, 80, 24);
  for (const x of [-24, 24]) for (const z of [-20, 20]) block(g, "Almohadilla de goma", [20, 1.3, 28], [x, 12, z], "rubber", 2);
  plate(g, "Canal de tornillo / no patrón certificado", 13, 44, 1, [0, 12, 0], [[0, 0, 3]], "black", [-Math.PI / 2, 0, 0]);
  screw(g, [0, 12.8, 9], "y", 4);
}
function rods(g) {
  for (const x of [-30, 30]) {
    const profile = [[5.5, -101.6], [7.5, -101.6], [7.5, 101.6], [5.5, 101.6], [5.5, -101.6]];
    const tube = new LatheGeometry(profile.map(p => new Vector2(...p)), 64); tube.rotateX(Math.PI / 2);
    add(g, "Varilla hueca / pared publicada 2 mm", tube, [x, 0, 0], "carbon");
    // El acento superficial no necesita tapas o triangulacion interior redundante.
    for (let i = 0; i < 8; i++) add(g, "Lectura de fibra / ilustrativa", new CylinderGeometry(7.505, 7.505, .45, 48, 1, true), [x, 0, -86 + i * 24], "dark", [Math.PI / 2, 0, 0]);
  }
}
function matte(g) {
  const s = rounded(156, 116, 6), hole = rounded(135, 94, 4); s.holes.push(new Path(hole.getPoints(8)));
  const geo = new ExtrudeGeometry(s, { depth: 24, bevelEnabled: true, bevelSize: 1, bevelThickness: 1, bevelSegments: 1, curveSegments: 5 }); geo.translate(0, 0, -12);
  add(g, "Visera abierta / envolvente estimada", mergeVertices(geo), [0, 0, 0]);
  ring(g, "Portafiltro 95 mm", 49.5, 45.5, 6, [0, 0, -15], "black");
  ring(g, "Aro VND visual", 48.5, 44, 2.5, [0, 0, -11], "dark");
  block(g, "Bandera superior / contorno aproximado", [156, 1.8, 76], [0, 61, 31], "carbon", 3, [-.25, 0, 0]);
  cylinder(g, "Bisagra de bandera", 3, 138, [0, 58, 7], "black", "x");
  knurl(g, "Bloqueo de bandera", 3.6, 5, [72, 61, 0], "steel", "y", 24);
  block(g, "Lateral de sujeción", [8, 89, 22], [78, -3, 0], "dark", 2);
  screw(g, [78, -38, 13]);
}
function batteryPlate(g) {
  block(g, "Placa 3203B", [108, 144.7, 27], [0, -12, 0], "dark", 7);
  plate(g, "Panel de fijación / taladros ilustrativos", 97, 129, 2, [0, -12, 14], [[-34, 46, 2], [0, 40, 3], [31, 46, 2], [-34, -46, 2], [0, -44, 3], [31, -46, 2]], "black");
  // Manual 3203B p.5: abrazadera en el borde superior, no invertida para imitar la foto comercial.
  clamps(g, [0, 72.35, 0], 96, 32, 24);
  const v = new Shape(); v.moveTo(-18, 24); v.lineTo(18, 24); v.lineTo(18, 0); v.lineTo(0, -20); v.lineTo(-18, 0); v.closePath();
  const geom = new ExtrudeGeometry(v, { depth: 2, bevelEnabled: false }); geom.translate(0, 0, -2);
  add(g, "Asiento V / no tolerancia de ajuste", geom, [0, 4, -14], "black");
  cylinder(g, "Botón de encendido", 4, 1.8, [54, 12, 1], "red", "x");
  jack(g, "Salida DC / posición ilustrativa", [54, -4, 1], 4.5);
}
function battery(g) {
  block(g, "VB99 Pro / carcasa", [73.2, 107.2, 55.2], [0, 0, 0], "dark", 6);
  block(g, "Panel frontal", [71, 103, .7], [0, 0, -27.3], "black", 5);
  block(g, "Pantalla OLED / sin niveles ficticios", [34, 18, .35], [0, 27, -27.75], "glass", 1.5);
  for (let i = 0; i < 12; i++) block(g, "Estriado lateral", [.8, 82, 1], [-36.5, -1, -20 + i * 3.5], "rubber", .2);
  block(g, "Zona D-Tap superior / sin polaridad inventada", [22, .5, 13], [14, 53.45, 0], "black", 1);
  for (const x of [-20, -8]) block(g, "Zona USB superior", [7, .5, 3], [x, 53.45, 0], "recess", .6);
  cylinder(g, "Botón", 3.3, 1, [36.5, 35, 0], "steel", "x");
  block(g, "Interfaz posterior V-mount / no adaptador extra", [34, 37, 2], [0, 9, 26.6], "black", 1.5);
}
function gimbal(g) {
  cylinder(g, "Motor pan", 29, 29, [0, 0, 0], "dark", "y", 48);
  ring(g, "Borde pan", 28, 25, 1.5, [0, 15, 0], "steel", "y");
  block(g, "Unidad de control / sin BG30", [65, 56, 65], [0, .5, 0], "dark", 7);
  block(g, "Pantalla OLED", [36, 31, .6], [0, 7.5, -32.6], "black", 2.3);
  block(g, "Cristal OLED / sin datos reales", [31, 27, .3], [0, 7.5, -33], "glass", 1.6);
  cylinder(g, "Joystick", 6, 2.4, [-13, -19.5, -32.4], "black");
  cylinder(g, "Botón REC", 3, 1.7, [8, -19.5, -32.4], "red");
  block(g, "Interfaz NATO izquierda", [4, 35, 21], [-34, -15, 0], "steel", .6);
  beam(g, [0, 11, -9], [0, 17, -98], 16, 18);
  cylinder(g, "Motor roll", 27, 27, [0, 35, -112], "dark", "z", 48);
  ring(g, "Aro roll", 25, 21, 1, [0, 35, -126], "black");
  beam(g, [11, 38, -112], [84, 88, -112], 17, 18);
  beam(g, [84, 88, -112], [96, 153, -112], 17, 18);
  beam(g, [96, 153, -112], [96, 157, 6], 17, 19);
  cylinder(g, "Motor tilt", 25, 27, [96, 157, 6], "dark", "x", 48);
  ring(g, "Aro tilt", 22, 18, 1, [110, 157, 6], "black", "x");
  block(g, "Detalle rojo de brazo", [1, 2, 82], [86.5, 159, -62], "red", .3);
  beam(g, [84, 126, 6], [44, 125, 6], 12, 14, "alloy");
  beam(g, [41, 126, 6], [41, 74, 6], 14, 17, "dark");
  plate(g, "Placa DJI / apoyo visual", 58, 74, 6, [17, 72, 6], [[0, 15, 3]], "alloy", [-Math.PI / 2, 0, 0]);
  for (const p of [[90, 126, 6], [41, 80, 15], [3, 15, -93]]) lever(g, p);
  for (let i = 0; i < 10; i++) block(g, "Escala de brazo / no graduación calibrada", [1, .5, 3], [86.4, 164, -91 + i * 8], "steel", .1);
}
function grip(g) {
  block(g, "BG70 / envolvente estimada", [43, 151, 43], [0, 4, 0], "rubber", 7);
  block(g, "Panel de agarre", [31, 124, .8], [-2, 4, -21.4], "dark", 5);
  block(g, "Extremo inferior", [42, 14, 41], [0, -75.5, 0], "alloy", 5);
  block(g, "Interfaz DJI / sin contactos inventados", [21, 5, 19], [0, 80, 0], "dark", 1);
  block(g, "Zona USB-C de carga", [.6, 4, 9], [21.5, -73, 0], "black", 1);
}
function monitorMount(g) {
  const holes = [[-32, 0, 3], [14, 0, 3]];
  plate(g, "Brazo 3026B / aligerado", 114, 20, 7, [-3, 4, 0], holes, "dark", [-Math.PI / 2, 0, 0]);
  for (const x of [-40, 27]) block(g, "Ventana de aligeramiento visual", [23, .4, 12], [x, 7.8, 0], "black", 3);
  block(g, "Detalle rojo del brazo", [85, 1.1, 1], [-7, 4, -10.4], "red", .2);
  block(g, "Abrazadera NATO", [26, 34, 32], [63, 0, 0], "dark", 3);
  block(g, "Mordaza NATO abierta", [7, 27, 20], [75, 0, 0], "alloy", 1);
  lever(g, [62, -17, 0], "y");
  cylinder(g, "Pivote basculante", 12, 25, [-65, 5.3, 0], "dark", "x");
  block(g, "Horquilla nativa", [26, 18, 29], [-66, -.7, 0], "dark", 2);
  knurl(g, "Rueda de fijación", 8, 5, [-66, -7.7, 0], "steel", "y", 36);
  cylinder(g, "Tornillo de monitor ilustrativo", 3, 3, [-66, -11.7, 0], "steel", "y", 16);
}
function monitor(g) {
  block(g, "Indie 7 / carcasa", [180.1, 118.6, 28], [0, 0, -2.75], "dark", 5);
  block(g, "Bisel frontal", [176, 114, .9], [0, 0, -16.3], "black", 4);
  block(g, "Panel 7 pulgadas / imagen ilustrativa sin señal", [155, 87, .35], [0, 2, -16.75], "glass", 1.4);
  for (const s of [-1, 1]) for (let i = 0; i < 6; i++) block(g, "Aleta de disipación", [1.8, 85, 4], [s * (70 + i * 3), 13, 13.3], "black", .4);
  // Dos alojamientos NP-F vacíos, nunca baterías no seleccionadas.
  for (const s of [-1, 1]) {
    block(g, "Fondo de alojamiento NP-F", [47, 73, 1.5], [s * 26, 18, 11.5], "black", 1);
    for (const x of [-22, 22]) block(g, "Carril NP-F", [3, 72, 4.5], [s * 26 + x, 18, 14.5], "dark", .5);
    for (const x of [-14, 14]) cylinder(g, "Contacto NP-F visual", .7, 2, [s * 26 + x, -18, 13], "gold", "y", 12);
  }
  for (const x of [-57, 57]) for (const y of [-24, 53]) screw(g, [x, y, 12]);
  block(g, "Zona de conectores inferior", [66, 14, 1], [53, -47, 16.4], "black", 1.8);
  jack(g, "Rosca inferior / no rosca superior", [0, -59.3, 0], 3.2, "y");
}
function handle(g) {
  block(g, "Módulo de audio XLR-H1", [57, 30, 41], [0, 20, 43], "dark", 4);
  block(g, "Cubierta de mandos", [1, 23, 36], [-29, 22, 43], "black", 2);
  for (const z of [30, 43, 56]) knurl(g, "Mandos de nivel", 3.7, 1.4, [-29.7, 15, z], "rubber", "x", 20);
  for (const x of [-14, 14]) { ring(g, "XLR/TRS / sin pinout", 7.6, 5.4, 2, [x, 20, 64], "black"); cylinder(g, "Fondo de entrada XLR", 5.4, .3, [x, 20, 63], "recess"); }
  block(g, "Empuñadura superior", [28, 18, 113], [0, 15, -3], "rubber", 5);
  const s = new Shape(); s.moveTo(-29, 12); s.quadraticCurveTo(-22, -5, -23, -20); s.lineTo(-13, -36); s.lineTo(14, -36); s.lineTo(14, -28); s.lineTo(-7, -28); s.quadraticCurveTo(-17, -14, -15, 12); s.closePath();
  const geo = new ExtrudeGeometry(s, { depth: 15, bevelEnabled: true, bevelSize: 1, bevelThickness: 1, bevelSegments: 1 }); geo.rotateY(Math.PI / 2); geo.translate(-7.5, 0, -20);
  add(g, "Pie contorneado de asa", mergeVertices(geo), [0, 0, 0], "dark");
  block(g, "Base Multi Interface / no adaptador extra", [23, 7, 32], [0, -35.5, -37], "dark", 2);
  knurl(g, "Tornillo de asa", 5, 6, [0, -28, -37], "steel", "y", 24);
  shoe(g, [0, 29, 45], [0, 0, 0], 20, 19);
}

function compactMonitorMount(g) {
  block(g,"Mordaza NATO 2906B",[46,15,32],[0,-19.4,0],"dark",2);
  block(g,"Canal NATO / asiento aproximado",[27,.8,24],[0,-26.5,0],"black",.5);
  lever(g,[-22,-17,0],"y");
  cylinder(g,"Pivote de giro",11,7,[0,-8.4,0],"alloy","y");
  for(const x of [-12,12])block(g,"Horquilla",[7,22,27],[x,1.1,0],"dark",2);
  cylinder(g,"Pivote inclinable",10,30,[0,9,0],"dark","x");
  knurl(g,"Mando lateral",7,5,[24,9,0],"rubber","x",24);
  block(g,"Placa de apoyo monitor",[36,4,30],[0,19,0],"dark",1);
  knurl(g,"Rueda de tornillo",10,3,[0,22,0],"steel","y",30);
  cylinder(g,"Tornillo 1/4-20 ilustrativo",3,3.4,[0,25.2,0],"steel","y",16);
}
function handleExtension(g) {
  // Contorno abierto desde manual p.8; kit y tornillería, no una pieza CAD calibrada.
  plate(g,"Riel NATO de asa XLR",100,18,5,[0,15,0],[[0,-30,3],[0,0,3],[0,30,3]],"alloy",[-Math.PI/2,0,Math.PI/2]);
  for(const x of [-9,9])block(g,"Labio NATO",[3,3,94],[x,19,0],"dark",.5);
  beam(g,[0,12,53],[0,-34,53],12,10,"alloy");
  beam(g,[0,-34,53],[0,-34,-57],12,10,"alloy");
  beam(g,[0,-34,-57],[0,12,-57],12,10,"alloy");
  block(g,"Bloqueo de extensión",[28,13,16],[0,8,52],"dark",1.5);
  for(const z of [-28,28])screw(g,[0,20,z],"y");
}
function monitorBattery(g) {
  block(g,"NP-F970/PRO / envolvente aproximada",[38.4,70.8,60],[0,0,0],"rubber",3);
  block(g,"Cara de contactos",[34,65,.8],[0,0,-29.8],"black",1);
  for(const x of [-14,14])block(g,"Guía serie L ilustrativa",[3,58,2],[x,1,-30],"dark",.5);
  for(const x of [-8,8])block(g,"Contacto / sin pinout geométrico",[3,4,.4],[x,-29,-30.2],"gold",.2);
  block(g,"Etiqueta visual sin marca copiada",[23,36,.3],[0,3,30.1],"dark",1);
}
export const authors = { camera, lens, cage, audioReceiver: receiver, baseplate, rods, matte, batteryPlate, battery, gimbal, grip, monitorMount, monitor, handle, compactMonitorMount, handleExtension, monitorBattery };

export function authoredModel(node) {
  const g = new Group(); g.name = node.id; authors[node.kind]?.(g, node);
  g.userData = { method: "manual", mechanical_accuracy: "approximate", geometry_units: "millimetres", canonical_ports_unchanged: true };
  g.updateMatrixWorld(true);
  // Agrupar por material conserva la silueta reduciendo draw calls y duplicados del GLB.
  const byMaterial = new Map();
  g.traverse(o => { if (o instanceof Mesh) { const geometry = o.geometry.clone().applyMatrix4(o.matrixWorld); geometry.scale(.001, .001, .001); const articulation=Object.entries(node.articulated_subassemblies??{}).find(([,names])=>names.includes(o.name))?.[0]??""; const key = articulation?`${articulation}/${o.material.name}`:o.material.name; if (!byMaterial.has(key)) byMaterial.set(key, []); byMaterial.get(key).push(geometry); } });
  const out = new Group(); out.name = g.name; out.userData = g.userData;
  for (const [key, geometries] of byMaterial) { const geom = mergeGeometries(geometries.map(x => x.index ? x : mergeVertices(x)), false); if (!geom) throw new Error("No se pudo consolidar " + node.id); geom.deleteAttribute("uv"); geom.normalizeNormals(); const mesh = new Mesh(geom, materials[key.split("/").at(-1)]); mesh.name = node.id + "/" + key; out.add(mesh); for (const geo of geometries) geo.dispose(); }
  g.traverse(o => { if (o instanceof Mesh) o.geometry.dispose(); });
  out.updateMatrixWorld(true); out.userData.bounds_mm = new Box3().setFromObject(out).getSize(new Vector3()).multiplyScalar(1000).toArray();
  return out;
}
