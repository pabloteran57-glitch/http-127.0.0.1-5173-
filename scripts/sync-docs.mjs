import { readFileSync, writeFileSync } from "node:fs";
import { validateCatalogPilot } from "./lib/catalog-pilot.mjs";
const read=name=>JSON.parse(readFileSync(new URL(`../data/${name}.json`,import.meta.url),"utf8"));
const parts=read("parts-manifest"),layout=read("layout-manifest"),cables=read("cables-manifest"),ports=read("ports-manifest"),assembly=read("assembly-guide"),variants=read("variants"),refs=read("geometry-references"),audit=read("geometry-audit");
const ui=read("ui-content");
const planner=read("planner-rules"),intake=read("catalog-intake");
const roadmap=read("product-roadmap");
const modelProduction=read("model-production"),modelAssets=read("model-assets");
const connectionReviews=read("connection-reviews"),sourceList=read("sources").sources;
const pilot=read("catalog-pilot"),pilotReport=validateCatalogPilot(pilot,{intake,parts,sources:{sources:sourceList}});
const contract={version:1,catalog_revision:planner.catalog_revision,scope:"Índice derivado; identidad en parts-manifest, forma en layout-manifest y guía en assembly-profile-content.",products:parts.parts.map(p=>({part_id:p.id,record_revision:planner.catalog_revision,model_number:p.model_number,identity_source_url:p.primary_source_url,geometry_profile_id:layout.nodes.find(n=>n.id===p.id)?.id??null,geometry_status:layout.nodes.some(n=>n.id===p.id)?"approximate":"not_modeled",assembly_steps:planner.assembly_frames.filter(f=>f.add_part_ids.includes(p.id)).map(f=>f.step),release_status:planner.parked_part_ids.includes(p.id)?"reserve":"planning_candidate",physically_tested:false}))};
writeFileSync(new URL("../data/catalog-contract.json",import.meta.url),JSON.stringify(contract,null,2)+"\n");
const name=id=>ui.part_names[id]??parts.parts.find(p=>p.id===id)?.exact_product_name??id;
const label=value=>ui.schema_labels[value]??value;
const join=list=>list.length?list.join("; "):"Ninguno";
const bullets=list=>list.map(item=>"- "+item).join("\n");
const write=(file,content)=>writeFileSync(new URL("../docs/"+file,import.meta.url),content.trim()+"\n");
const intakeReviews=intake.manifest_reviews??[];
const reviewMethods={direct_official_page:"Página oficial consultada",official_browser_page_review:"Página oficial revisada en navegador",official_pdf_text_review:"Sección textual del PDF oficial; no medición de figura",official_pdf_visual_review:"Diagrama oficial revisado visualmente; no CAD",official_indexed_text_direct_access_failed:"Texto oficial indexado; acceso directo falló en esa revisión"};
write("catalog-manifest-reviews.md",`# Revisiones del manifiesto piloto\n\nFuente: \`data/catalog-intake.json\`. Revisión ${intake.reviewed_on}. ${intakeReviews.length} revisiones parciales, sin productos activados ni instrucciones físicas liberadas. Los otros candidatos conservan su fecha y alcance anteriores.\n\n${intakeReviews.map(review=>`## ${intake.products.find(p=>p.id===review.part_id).exact_product_name}\n\nRevisión: ${review.reviewed_on}.\n\n| Campos en investigación | Fuente y localizador | Método |\n|---|---|---|\n${review.citations.map(citation=>`| ${citation.field_paths.map(path=>`\`${path}\``).join(", ")} | [Sony](${sourceList.find(source=>source.id===citation.source_id).url}): ${citation.locator} | ${reviewMethods[citation.method]??"Método no reconocido; revisar"} |`).join("\n")}\n\nPendiente:\n\n${bullets(review.remaining)}`).join("\n\n")}\n\n## Límites\n\nNo se copian puertos, mallas ni poses de FX3. El par exacto FX30/SEL20F18G tiene [confirmación Sony](${sourceList.find(s=>s.id==="intake-sony-fx30-sel20f18g-pair").url}); la tabla no especifica firmware ni certifica holguras. NP-FZ100 es batería nativa de FX30 documentada; tensión nominal no equivale a rango completo ni pinout. Las diferencias ILME-FX30 / ILME-FX30B de contenido incluido se conservan sin añadir piezas al usuario. La [ficha del conjunto](catalog-pilot-blueprint.md) define distribución relacional, alimentación y guía documental. El catálogo instalable mantiene ${parts.parts.length} entradas.\n`);
const pilotName=id=>intake.products.find(p=>p.id===id)?.exact_product_name??name(id);
const pilotSources=ids=>ids.map(id=>{const source=sourceList.find(s=>s.id===id);return `[${source.brand}](${source.url})`;}).join("; ");
write("catalog-pilot-blueprint.md",`# ${pilot.title}

Generado desde \`data/catalog-pilot.json\`, con especificaciones referenciadas de \`catalog-intake.json\` y \`parts-manifest.json\`. Revisión ${pilot.reviewed_on}.

${pilot.scope}

## 1. Manifiesto

| Pieza | Modelo exacto | Autoridad | Fuentes |
|---|---|---|---|
${pilot.manifest.map(p=>`| ${pilotName(p.part_id)} | ${p.model_number} | \`${p.authority}\` | ${pilotSources(p.source_ids)} |`).join("\n")}

Subtotal: **aproximadamente ${pilotReport.subtotal_g} g**. ${pilot.mass.note}

Excluidos: ${join(pilot.mass.exclusions)}.

${pilot.claims.map(c=>`- ${c.model_numbers.join(" + ")}: ${pilotSources([c.source_id])}, ${c.locator}. ${c.limitation}`).join("\n")}

## 2. Distribución física

No hay coordenadas ni rotaciones calibradas: sus campos permanecen \`null\`. El grafo expresa relaciones de montaje, no mediciones.

${pilot.layout.map(p=>`### ${pilotName(p.part_id)}\n\n- Posición: ${p.placement}\n- Orientación: ${p.orientation}\n- Motivo: ${p.why}\n- Rechazado: ${join(p.rejected)}\n- Comprobar: ${join(p.checks)}`).join("\n\n")}

## 3. Alimentación y conexiones

${pilot.connections.map(c=>`- \`${c.id}\`: ${pilotName(c.from_part_id)} → ${pilotName(c.to_part_id)}; ${c.connector_a} → ${c.connector_b}.\n- Tipo: alimentación por contactos; ${intake.products.find(p=>p.id===c.nominal_voltage_ref.part_id)[c.nominal_voltage_ref.field]} V nominales, ${pilotSources([c.nominal_voltage_ref.source_id])}. Pinout y rango: pendientes. Longitud: no aplica.\n- Recorrido: ${c.routing}\n- Retención: ${c.retention}\n- Riesgos: ${join(c.risk_notes)}`).join("\n\n")}

Vista ensamblada: ${pilot.routing_views.assembled} Vista separada: ${pilot.routing_views.exploded}

Colores reservados para futuras rutas: energía \`${pilot.cable_overlays.power}\`, vídeo \`${pilot.cable_overlays.video}\`, datos \`${pilot.cable_overlays.data}\`. ${pilot.cable_overlays.note}

## 4. Guía documental

${pilot.assembly.map((s,index)=>`### ${index+1}. ${s.title}\n\n- Montar/preparar: ${s.mount}\n- Lugar: ${s.where}\n- Comprobar: ${join(s.verify)}\n- Equilibrio: ${s.rebalance}\n- Fuentes: ${pilotSources(s.source_ids)}.`).join("\n\n")}

No prescribe un par de apriete inventado. La cota Sony menor de 5.5 mm pertenece al tornillo de trípode del cuerpo; no demuestra longitudes de los tornillos suministrados de la jaula.

## 5. Visor

${pilot.viewer.note} Sin modelo integrado ni reproducción de montaje del piloto.

## 6. Variantes

${pilot.variants.note}

No incluidos: ${join(pilot.not_included)}.

## Criterios pendientes

${pilot.gates.map(g=>`- ${g.status==="documented"?"Documentado":"Pendiente"}: ${g.note}`).join("\n")}

${pilot.physical_validation.note}

Validar estructura: \`npm run check:catalog\`. Exigir liberación: \`npm run check:catalog -- --strict\` devuelve error mientras falten geometría e integración. Ensayo físico y aceptación de beta permanecen separados; un subtotal o una compilación no los certifica.
`);
const weight=n=>{const p=parts.parts.find(p=>p.id===n.id);return n.subcomponent_id?p.subcomponents?.find(c=>c.id===n.subcomponent_id)?.weight_g??0:p.planning_weight_g??0;};
const mass=v=>layout.nodes.filter(n=>n.mass_domain==="moving"&&v.active_part_ids.includes(n.id)).reduce((sum,n)=>sum+weight(n),0);
const disclaimer="Plan de ingeniería, no montaje certificado. Medidas publicadas no prueban forma exacta, enganche de tornillos, equilibrio, rigidez, holguras ni compatibilidad de toda la pila. Fotos y geometría aproximada no son CAD calibrado.";
write("adjustable-layout.md",`# Ajustes de posición\n\nGenerado desde \`data/layout-manifest.json\`. Los ajustes se conservan en el borrador y se confirman con Guardar rig, dentro del perfil local. No modifican plantillas ni catálogo.\n\n## Monitor\n\n${Object.entries(layout.monitor_joints??{}).map(([route,joint])=>`### ${layout.monitor_mount_routes[route].label}\n\n- Soporte: ${name(joint.mount_id)}. Pantalla y batería elegida acompañan el cabezal; la abrazadera permanece fija.\n- Inclinación ilustrativa: ${joint.tilt_range_deg.join(" a ")} grados; giro: ${joint.swivel_range_deg.join(" a ")} grados. Son intervalos centrados en una pose aproximada, no topes medidos del rig.\n- [Manual oficial](${joint.source_url}): ${joint.source_locator}\n- ${joint.geometry_note}`).join("\n\n")}\n\n## Placa V-mount\n\n${layout.battery_plate_slide.source_locator}\n\n${layout.battery_plate_slide.note}\n\nEl control permanece sin recorrido hasta que el usuario indique las distancias medidas y confirme el asiento. Placa y batería se trasladan juntas en el eje de las varillas; no se permite inclinación ni movimiento libre. La entrada tiene un límite informático basado en el largo de la varilla, no una certificación del recorrido. [Manual oficial](${layout.battery_plate_slide.source_url}).\n\n## Cables y montaje\n\n- Puertos y tangentes de aproximación del cable acompañan la orientación del monitor; extremos de cables de batería acompañan la traslación.\n- Las curvas siguen siendo ilustrativas: comprobar holgura, radios, retención, manos y motores en el rig real. El rango angular del soporte no significa giro libre con cables.\n- Ajustar con motores apagados. Fijar articulaciones y abrazaderas; volver a equilibrar tras mover masa sobre la cámara/varillas.\n- La guía acumulativa conserva la pose elegida cuando el conjunto aparece. No simula una trayectoria de instalación física.\n- Guardado, historial, duplicados y recuperación conservan los ajustes; una cadena inactiva no los aplica.\n`);
write("verified-build-manifest.md",`# Manifiesto verificado de piezas

Generado desde \`data/parts-manifest.json\`. Auditoría ${parts.engineering_audit_on??parts.verified_on}. 25 productos solicitados y 2 componentes del Combo conservados, más 3 accesorios de monitor verificados: ${parts.parts.length} entradas.

${disclaimer}

${parts.parts.map(p=>`## ${name(p.id)}

- ID: \`${p.id}\`
- Nombre oficial del fabricante: ${p.exact_product_name}.
- Modelo: ${p.model_number??"No publicado"}; fabricante: ${p.brand}; categoría: ${label(p.category)}.
- Medidas publicadas L/W/H: ${[p.verified_dimensions_mm.length,p.verified_dimensions_mm.width,p.verified_dimensions_mm.height].map(v=>v??"pendiente").join(" / ")} mm. Aproximadas/incompletas: ${p.verified_dimensions_mm.approximate?"sí":"no"}.
- Nota de dimensiones: ${p.verified_dimensions_mm.note}
- Masa publicada: ${p.verified_weight_g.value??"pendiente"} g. Aproximada: ${p.verified_weight_g.approximate?"sí":"no"}.
- Nota de masa: ${p.verified_weight_g.note}
- Fuente de masa: [${p.brand}](${p.verified_weight_g.source_url??p.primary_source_url}).
- Masa de planificación: ${p.planning_weight_g??"pendiente"} g; no sustituye pesaje del subconjunto instalado.
- Interfaces: ${join(p.ports_interfaces)}
- Montaje: ${p.mounting_method}
- Material: ${p.likely_material}
- Obligatorio/opcional: ${label(p.mandatory_or_optional)}; función: ${p.rig_role}.
- Restricciones: ${join(p.physical_constraints)}
- Confianza: ${label(p.confidence_level)}.
- [Fuente principal](${p.primary_source_url})${p.secondary_source_url?"; [fuente secundaria]("+p.secondary_source_url+")":""}
`).join("\n")}`);
write("physical-layout-plan.md",`# Plan de distribución física

Canónico: \`data/layout-manifest.json\`. X derecha de cámara; Y arriba; Z lente hacia delante. Origen: centro nominal de envolvente FX3, no datum de fabricación. **Todas las poses son aproximadas.**

${disclaimer}

Varillas: 15 mm de diámetro, 203.2 mm de largo, 60 mm entre centros según el manual 1674. No barras ficticias de 410 mm. 3203B: abrazadera al borde superior documentada en la página 5 del manual, placa bajo las varillas; barrido del giro horizontal pendiente.

## Cadenas alternativas de monitor

${Object.entries(layout.monitor_mount_routes??{}).map(([id,route])=>`### ${route.label}\n\nRuta \`${id}\`; posiciones ilustrativas, no asiento verificado.\n\n${Object.entries(route.overrides).map(([part,pose])=>`- ${name(part)}: posición ${pose.position_mm?.join(" / ")??"heredada"} mm; soporte ${pose.parent_id?name(pose.parent_id):"heredado"}; carga ${pose.mass_domain??"heredada"}.`).join("\n")}`).join("\n\n")}

En gimbal conservar 3026B lateral fijo. A mano/estática usar 2906B sobre NATO 4770 sin XLR, o kit 4830 sobre XLR-H1 si el asa está elegida. No ocupar simultáneamente el riel superior 4770 y la interfaz XLR. Cada pieza se añade sólo por elección del usuario. NP-F970/PRO elegida alimenta el monitor en su placa nativa incluida, sin cable al barril.

${layout.nodes.map(n=>`## ${n.label}

- Posición candidata XYZ: ${n.position_mm.join(" / ")} mm; rotación XYZ: ${n.rotation_deg.join(" / ")} grados.
- Envolvente XYZ: ${n.size_xyz_mm.join(" / ")} mm; estado: ${label(n.envelope)}. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: ${label(n.mass_domain)}; soporte candidato: ${n.parent_id?name(n.parent_id):"raíz/sujeción externa no modelada"}.
- Colocación: ${n.placement}
- Orientación: ${n.orientation}
- Montaje: ${n.mount}
- Motivo: ${n.rationale}
- Rechazado: ${n.rejected}
- [Referencia de medidas](${n.dimension_source_url})
`).join("\n")}

## Componentes sin montaje 3D habilitado

- Distribuidor StarTech: banco con fuente incluida; soporte dinámico no verificado. 620 mm es producto con cable cautivo, no largo del cuerpo.
- RavenEye: banco, HDMI Mini-C; batería interna. No montaje ni ActiveTrack operativos prometidos.
- LiDAR/motor: inventario condicional; calibración de SEL1635GM y fijación/barrido pendientes.
- Interfaz Focus Pro a Transmission: estacionada; falta el sistema DJI Transmission. No se sustituye por una interfaz de otro modelo.
- Mic 2: sólo RX de 28 g modelado en la zapata inclinada 4770 como candidato. Estuche/TX fuera de cámara. La selección sin jaula permanece pendiente; no se añade el soporte sin autorización.

## Distribución de masa

${variants.variants.map(v=>"- "+v.label+": "+(mass(v)/1000).toFixed(2)+" kg de piezas móviles modeladas.").join("\n")}

Incluye masas de planificación aproximadas, especialmente varillas y parasol, y 28 g publicados del RX Mic 2 cuando está activo. Excluye cables, TX, estuche, tarjetas y tornillos adicionales. Monitor lateral fijo fuera de carga móvil en gimbal; monitor sobre jaula/asa y batería elegida incluidos en el núcleo a mano/estático. No sumar BG30 estándar al BG70 ni el Combo entero a sus subcomponentes. Peso total llevado y centro de gravedad reales no medidos.

3026B: límite publicado 1.5 kg; monitor 737 g de planificación conservadora, más NP-F970/PRO ~300 g si se elige. SmallHD publica masa inferior discrepante; pesar equipo real. La comparación escalar no prueba rigidez, par ni seguridad dinámica.

## Pruebas de liberación

${layout.clearance_gates.map(g=>"### "+g.title+"\n\n"+g.detail+"\n\nEstado: "+label(g.status)+".").join("\n\n")}`);
write("cable-power-map.md",`# Mapa de cables y alimentación

Canónicos: \`data/cables-manifest.json\` y \`data/ports-manifest.json\`. ${cables.cables.length} circuitos, ${ports.ports.length} puertos. Identidad de conectores documentada; coordenadas 3D y curvas aproximadas.

## Arquitectura

- BG70 -> contactos empuñadura -> RS 4 Pro, no cable externo ni segunda batería BG30.
- VB99 D-Tap -> 4253B regulado -> NP-FZ100 adaptador de batería -> FX3.
- VB99 contactos V-mount -> 3203B -> D-Tap -> SmallHD conector de barril 5.5 mm externo -> Indie 7 DC I.
- Alternativa propia: NP-F970/PRO -> contactos de placa serie L incluida -> Indie 7. Una batería elegida, sin cable; 7.2 V nominales y ~300 g. Nunca al barril DC de mínimo 10 V. Cargador externo requerido; el monitor no carga baterías.
- RS RSS -> USB-C control -> FX3 USB-C.
- Gimbal candidato: única FX3 HDMI A -> Indie 7 HDMI IN J.
- Doble salida solicitada, en banco: FX3 HDMI -> entrada cautiva StarTech -> salida 1 A-A a Indie 7 / salida 2 A-C a RavenEye. Adaptador StarTech incluido de 5 V / 2 A. No distribuidor sin fuente ni montaje invisible.
- RavenEye en banco con batería interna; no reclamar control gimbal/ActiveTrack por sólo tener vídeo.

**Corrección eléctrica:** Cable CBL-PWR-DTAP-BAR-36: exterior 5.5 mm y centro positivo publicados, interior del cable por confirmar. Fuente independiente SmallHD, tabla técnica Power: entrada del Indie 7 de 2.0 mm interior / 5.5 mm exterior y centro positivo, DC 10–34 V; terminales batería 6.0–16.8 V. El ID histórico del cable no es prueba de conector. 4253B: entrada 9.6–20 V / mínimo 2 A, salida 8.0–8.4 V / máximo continuo 2 A. Todas las cargas y ajustes reales siguen pendientes.

Revisión por circuito y fuentes: [comprobaciones de conexiones](connection-reviews.md). ${connectionReviews.reviews.length} enlaces revisados documentalmente; los demás no se dan por compatibles por tener puertos identificados.

## Colores

${Object.entries(cables.color_coding).map(([type,color])=>"- "+label(type)+": \`"+color+"\`").join("\n")}

## Recorridos

${cables.cables.map(c=>`### ${c.cable_id}

- Producto/fuente: ${name(c.source_part_id)}.
- Origen: ${c.source}; puerto \`${c.from_port_id}\`.
- Destino: ${c.destination}; puerto \`${c.to_port_id}\`.
- Conector A: ${c.connector_a}; conector B: ${c.connector_b}.
- Tipo: ${label(c.type)}; estándar/tensión: ${c.voltage_or_signal_standard}.
- Longitud estimada: ${c.ideal_length_estimate}
- Ruta candidata: ${c.routing_path}
- Alivio de tensión: ${c.strain_relief_requirement}
- Riesgos: ${join(c.risk_notes)}
- Obligatorio/opcional: ${label(c.mandatory_or_optional)}; estado: ${label(c.status)}; visualización: ${label(c.display_kind)}.
- Cruce de movimiento: ${label(c.motion_boundary)}; geometría: ${label(c.route_geometry)}.\n${Object.entries(c.monitor_route_overrides??{}).map(([route,override])=>`- Recorrido ${route}: ${override.routing_path} Cruce: ${override.motion_boundary}. Curva ilustrativa, no ruta física medida.`).join("\n")}
`).join("\n")}

## Puertos identificados

${ports.ports.map(p=>"- \`"+p.id+"\`: "+p.label+" / "+p.connector+"; "+(p.local_position_mm?"anclaje visual XYZ "+p.local_position_mm.join("/")+" mm aproximado":"sin pose habilitada")+"; [fuente]("+p.identity_source_url+").").join("\n")}

## Lógica ensamblada

${bullets(cables.assembled_routing_logic)}

## Lógica en despiece

${bullets(cables.exploded_routing_logic)}

El trazado superpuesto 3D es una anotación de topología, no cable físico para cortar ni una prueba de colisión. Contactos e internos no se dibujan como cables. Aparatos sin pose siguen en el esquema 2D.
`);
write("assembly-guide.md",`# Guía de montaje

Canónico: \`data/assembly-guide.json\`. 13 etapas, en orden. ${disclaimer}

${assembly.steps.map(s=>`## ${s.number}. ${s.title}

Montar: ${s.mount}

Ubicación: ${s.where}

${bullets(s.verify)}

**Equilibrio:** ${s.rebalance}

Aplicabilidad del perfil: ${s.applies_if_any_part_ids.length?join(s.applies_if_any_part_ids.map(name)):"guía general"}.
`).join("\n")}

La casilla de la app sólo registra lectura en la sesión, no una prueba física aprobada.
`);
write("variants.md",`# Plantillas de variantes

Canónico: \`data/variants.json\`. Los cambios son frente al perfil principal \`${variants.master_variant_id}\`, no frente al inventario completo. Las piezas retiradas siguen disponibles en inventario. Los condicionales NO son activos.

${variants.variants.map(v=>`## ${v.label}

- ID: \`${v.id}\`; modo visual: ${label(v.viewer.mode)}; estado: ${v.operating_status}.
- Activos: ${join(v.active_part_ids.map(name))}
- Retirados del perfil principal: ${join(v.parts_removed.map(name))}
- Añadidos al perfil principal: ${join(v.parts_added.map(name))}
- En reserva/condicionales: ${join(v.conditional_part_ids.map(name))}
- Cableado activo: ${join(v.cable_profile_ids)}
- Conexiones retiradas: ${join(v.cables_removed)}
- Conexiones añadidas: ${join(v.cables_added)}
- Equilibrio: ${v.balance_impact}
- Flujo de trabajo: ${v.workflow_impact}
- Presupuesto: ${v.budget_impact}
- Complejidad: ${v.complexity_impact}
- Dependencias: ${join(v.dependencies)}
- Subtotal móvil modelado: ${(mass(v)/1000).toFixed(2)} kg, incompleto/aproximado.
`).join("\n")}

Vertical: plataforma nativa DJI, no soporte de terceros inventado. La rotación en el visor no prueba la pila vertical de placas.

Rigs propios con monitor lateral: ${planner.vertical_monitor_review.rationale} ${planner.vertical_monitor_review.pending} Fuentes: ${planner.vertical_monitor_review.source_urls.map(url=>`[Fabricante](${url})`).join("; ")}.
`);
write("rig-overview.md",`# Takegrid / Descripción del rig

DJI RS 4 Pro + Sony FX3, objetivo SEL1635GM original. Perfil principal Comercial; Documental comparte el bloque pesado y añade audio; A mano separa cámara/audio y requiere NP-FZ100 interna confirmada.

${disclaimer}

## Correcciones verificadas

- Combo contiene Focus Pro Motor y Ronin Image Transmitter. No todo el Combo se instala a la vez.
- VB99 Pro 4292: 644 ±10 g, 107.2 ×73.2 ×55.2 mm.
- 4770: 160 ×101.2 ×66.2 mm, 208 ±5 g.
- 1674: 80 ×80 ×26 mm, 171 ±5 g; 60 mm entre varillas.
- 3203B: 168.7 ×108 ×33 mm. Página 337 ±5 g frente a manual 341 ±10 g; 351 g conservadores. Abrazadera superior en manual p5 permite placa bajo varillas, no demuestra barrido del giro horizontal.
- 3026B: 152.6 ×54.8 ×38 mm, 125 ±5 g, carga publicada 1.5 kg. Indie 7 bajo su cabezal nativo mediante rosca inferior invertida; verificar inversión de imagen y manos.
- FX3 tiene una sola salida HDMI A. Doble salida con distribuidor presente sólo en banco; no brazo articulado ficticio ni fuente inexistente.
- SmallHD cable D-Tap a conector de barril 5.5 mm externo; no especificación inventada de diámetro interno.
- La interfaz Focus Pro a Transmission no pertenece a RavenEye; 139.3 g del modelo exacto.
- XLR-H1 fuera del gimbal activo; cámara a mano/entrevista. LiDAR/motor sin calibración de este objetivo no se presentan operativos.

## App

Cuatro tareas: Rig, Conexiones, Montaje y Piezas. Visor 3D con aproximaciones basadas en fotos y cotas, ensamble/despiece, ángulos, etiquetas/cables, puertos A/B seleccionables, doble HDMI 2D en banco, fotos reales, 13 etapas y 7 perfiles. Criterios y límites se consultan bajo demanda, sin llenar la pantalla.

## Referencias y fidelidad

${refs.parts.reduce((n,p)=>n+p.images.length,0)} imágenes descargadas, ${refs.documents.filter(d=>d.local_path).length} documentos; ${audit.references.length} referencias de inventario seleccionadas tras revisión visual o técnica. La tabla eléctrica 4253B no sustituye una foto de producto. 3026B usa su manual de revisión B, no foto ambigua de versión anterior.

Medios de fabricante para investigación local, no licencia abierta de redistribución. Escaneo FX3 comunitario identificado, sin licencia/descarga/escala verificadas: no se importa. Antes de usar CAD: comprobar revisión exacta, licencia, unidades, escala, referencias geométricas y distinguir malla visual de malla de colisión.

## Entregables

- [Manifiesto](verified-build-manifest.md)
- [Distribución y masa](physical-layout-plan.md)
- [Conexiones](cable-power-map.md)
- [Montaje](assembly-guide.md)
- [Variantes](variants.md)
- [Identidad provisional](brand.md)

No hay medición del conjunto físico ni certificación de producción. El plan conserva esos límites en datos, documentación e interfaz; los planes se guardan en Mis rigs, sin exportación de archivos.
`);
write("catalog-pilot.md",`# Lote piloto de catálogo\n\nFuente canónica de investigación: \`data/catalog-intake.json\`. Revisión ${intake.reviewed_on}. **Diez candidatos; ninguno activado.** No se incluyen imágenes sin permiso ni formas heredadas.\n\n## Manifiesto inicial\n\n| Producto | Modelo | Masa publicada (g) | Cotas publicadas (mm) | Fuente |\n|---|---|---:|---|---|\n${intake.products.map(p=>`| ${p.exact_product_name} | ${p.model_number} | ${p.weight_approximate?"~ ":""}${p.weight_g} | ${p.dimensions.approximate?"~ ":""}${p.dimensions.diameter_mm?`D ${p.dimensions.diameter_mm} × L ${p.dimensions.length_mm}`:`W ${p.dimensions.width_mm} × H ${p.dimensions.height_mm} × D ${p.dimensions.depth_mm}`} | [Sony](${p.source_url}) |`).join("\n")}\n\n## Límites y liberación\n\n${bullets(intake.common_limits)}\n\n${intake.release_gates.map((g,i)=>`${i+1}. ${g}.`).join("\n")}\n\n## Conjuntos candidatos\n\n${intake.configuration_candidates.map(c=>`- \`${c.id}\`: ${c.part_ids.join(", ")}. ${c.reason}`).join("\n")}\n\nFX30/SEL20F18G: [ficha técnica del conjunto](catalog-pilot-blueprint.md) con pares oficiales, distribución relacional, alimentación nativa y cinco etapas documentales. Geometría e integración pendientes; los demás conjuntos no reciben esa verificación por analogía. Este lote no modifica las ${parts.parts.length} entradas del catálogo actual.\n`);
write("product-progress.md",`# Avance por fases\n\nFuente: \`data/product-roadmap.json\`. Estado: prototipo en curso. Ningún criterio externo se da por cumplido a partir de compilación.\n\n| Fase | Estado de preparación | Evidencia y trabajo restante |\n|---|---|---|\n${roadmap.phases.map(p=>`| ${p.order}. ${p.title} | \`${p.status}\` | [Documento](${p.verification_report.replace("docs/","")}); ${p.remaining.join("; ")} |`).join("\n")}\n\nDecisión del usuario: guardado local por ahora. Cuentas, sincronización y enlaces privados siguen en el plan futuro, aplazados. Catálogo activo sin ampliaciones no verificadas.\n`);
write("connection-reviews.md",`# Revisión de conexiones

Fuente: \`data/connection-reviews.json\`, revisión \`${connectionReviews.revision}\`. Valores eléctricos canónicos en cables y puertos, con fuente por campo. ${connectionReviews.reviews.length} de ${cables.cables.length} circuitos con revisión ampliada.

${connectionReviews.policy}

## Criterio de evaluación

- Identidad exacta: catálogo, producto, modelo, puertos, conectores, señal y revisión eléctrica deben coincidir. Un cambio invalida la evidencia anterior.
- Evidencia: fuente oficial vinculada a esos productos, URL conservada, afirmación y localizador. Una URL HTTPS aislada o la forma del conector no prueba protocolo.
- Alimentación: toda la salida debe estar contenida en la entrada. Solapamiento parcial bloquea; nominal o rango ausente siguen pendientes.
- Polaridad: ambos extremos deben estar documentados. Centro positivo del cable no verifica el pinout del monitor.
- Firmware, carga compartida, ajuste y holguras siguen requiriendo comprobaciones del equipo real. El motor documental no certifica un montaje.

${connectionReviews.reviews.map(r=>`## ${r.cable_id}

Modelos vinculados: ${r.binding.models.map(m=>name(m.part_id)+(m.model_number?" / "+m.model_number:"")).join("; ")}. Puertos: \`${r.binding.from_port_id}\` -> \`${r.binding.to_port_id}\`.

Antes de conectar: ${r.action}

${r.checks.map(c=>"- **"+c.label+":** "+c.detail).join("\n")}

${Object.values(r.citations).map(c=>"- ["+sourceList.find(s=>s.id===c.source_id).brand+"]("+c.source_url+"): "+c.locator+". "+c.claim).join("\n")}
`).join("\n")}

## Alcance pendiente

Los otros ${cables.cables.length-connectionReviews.reviews.length} circuitos conservan especificaciones y riesgos, pero no se califican como compatibles por defecto. Las revisiones no añaden piezas, no cambian las siete plantillas y no modifican las selecciones guardadas. Cadenas mecánicas universales, revisión del resto del catálogo y ensayos físicos siguen pendientes.
`);
write("model-production.md",`# Producción de modelos realistas

Fuentes canónicas: \`data/model-production.json\` y \`data/model-assets.json\`. Revisión ${modelProduction.reviewed_on}. Estado: \`${modelProduction.status}\`. **${modelAssets.assets.filter(a=>a.status==="approved").length} mallas aprobadas. No se ha sustituido ninguna forma por un recurso sin auditar.**

## Acción por acción

${modelProduction.sequence.map((s,i)=>`${i+1}. ${s}.`).join("\n")}

## Primer lote, mismo catálogo

Reconstrucciones propias aproximadas; no descargas de Sketchfab ni resultados de Meshy. [Procedencia y uso](authored-model-rights.md). Aprobar una malla visual no verifica asiento, tolerancias ni funcionamiento del rig.

| Pieza representada | Archivo | Triángulos | Bytes | Alcance de referencia |
|---|---|---:|---:|---|
${modelAssets.assets.filter(a=>a.status==="approved").map(a=>`| ${name(a.part_id)}${a.subcomponent_id?" / "+a.subcomponent_id:""} | \`${a.artifact.path}\` | ${a.artifact.triangles} | ${a.artifact.bytes} | ${a.calibration.reference_basis} |`).join("\n")}

| Orden | Producto | Subcomponente | Estado | Referencias necesarias |
|---|---|---|---|---|
${modelProduction.priorities.map(p=>`| ${p.order} | ${name(p.part_id)} | ${p.subcomponent_id??"Producto"} | \`${p.status}\` | ${p.required_views.join("; ")} |`).join("\n")}

${modelProduction.priorities.map(p=>`### ${name(p.part_id)}\n\n${bullets(p.constraints)}`).join("\n\n")}

## Recursos investigados

${modelProduction.candidates.map(c=>`- [${c.id}](${c.source_url}): \`${c.status}\`. ${c.observations.join(". ")}. Descargado: ${c.downloaded?"sí":"no"}; licencia: ${c.license??"sin confirmar"}.`).join("\n")}

## Reconstrucción IA

${modelProduction.ai.platform_identification}. Estado: \`${modelProduction.ai.status}\`.

${modelProduction.ai.source_images_policy} ${modelProduction.ai.payment_policy} ${modelProduction.ai.output_accuracy}.

${modelProduction.ai.access_check}

${modelProduction.ai.sources.map(s=>`- [Documentación de Meshy](${s.url}): ${s.claim}.`).join("\n")}

## Fotografías con licencia revisada

${modelProduction.licensed_references.map(r=>`- [${r.id}](${r.source_url}): ${r.review} ${r.attribution} [Licencia](${r.license_url}). Descarga ${r.bytes} bytes; SHA-256 \`${r.sha256}\`.`).join("\n")}

## Puertas de liberación

${bullets(modelProduction.release_gates)}

${modelProduction.remaining_policy}

## Resto del catálogo actual

${(modelProduction.unmodeled??[]).map(p=>`- **${name(p.part_id)}**: \`${p.status}\`. ${p.reason}`).join("\n")}

El contrato técnico y los comandos se explican en [Integración GLB](model-asset-contract.md). La reunión exploratoria se mantiene privada, no se cuenta como ensayo puntuado de beta ni concede permisos de fotos.
`);
console.log("Documentos técnicos, modelos, revisiones de conexiones, índice, lote y avance regenerados desde los JSON canónicos.");
