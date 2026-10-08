# AGENTS

## Reglas de trabajo

1. Verificar antes de representar.
2. Preferir fuentes oficiales del fabricante; B&H como fuente secundaria.
3. No inventar puertos, rutas de cables, dimensiones ni soluciones de montaje.
4. Marcar las especificaciones incompletas como aproximadas; no adivinar en silencio.
5. Mantener el orden: manifiesto, distribución física, cables/alimentación, guía de montaje, interfaz/visor y variantes.
6. Todo texto redactado para el usuario, documentación, avisos y descripciones debe estar en español. Conservar nombres oficiales de productos, marcas, modelos, siglas y códigos técnicos; no traducir identificadores ni rutas de archivos.

## Autoridad de los datos

- `data/parts-manifest.json`: lista canónica de piezas.
- `data/cables-manifest.json`: conexiones y recorridos canónicos.
- `data/variants.json`: perfiles canónicos.
- Documentación Markdown y aplicación React se actualizan desde estos datos, no al revés.
- `data/ui-content.json`: etiquetas y traducciones de presentación; no sustituye especificaciones.

## Restricciones del rig

- FX3 dispone de una sola salida HDMI de tamaño completo.
- Monitor fuera de cámara, al lado del gimbal cuando está activo. A mano/estático: 2906B sobre NATO 4770 sin XLR, o 4830 + 2906B sobre XLR-H1. No acoplar simultáneamente el riel superior 4770 y el asa XLR.
- V-mount baja y sobre el sistema de varillas.
- Distribuidor StarTech en reserva hasta incorporar un soporte real verificado.
- Hub LiDAR de DJI en reserva sin el sistema DJI Transmission correspondiente.
- XLR-H1 no es la elección predeterminada en gimbal activo.

## Interfaz

- Conservar la dirección visual cinematográfica y técnica de alta gama.
- Vincular etiquetas y trazados de cables a la lógica real de conexiones.
- Toda geometría del visor es aproximada salvo verificación mecánica exacta.
- Comprobar escritorio y móvil, nombres accesibles, navegación, estados vacíos y textos técnicos desplegables.

## Datos canónicos adicionales

- `data/layout-manifest.json`: posiciones, envolventes y cadenas candidatas de soporte.
- Sus `monitor_joints` documentan rangos totales y pivotes aproximados: 2906B 180° de inclinación/360° de giro; 3026B 170° de inclinación, sin giro independiente verificado. `battery_plate_slide` sólo admite traslación axial con recorrido medido por el usuario, nunca bisagra ficticia. Conservar juntos pantalla/batería/cabezal y extremos/tangentes de cables. Ajustes locales no certifican topes, colisiones ni equilibrio; ejecutar pruebas de ajustes incluidas en `test:planner`.
- `data/ports-manifest.json`: identidad de conectores; anclajes espaciales aproximados.
- `data/assembly-guide.json`: las trece etapas de montaje.
- `data/engineering-manifest.json`: límites publicados y políticas de incertidumbre.
- `data/geometry-references.json`: atribución y huellas de referencias descargadas.
- `data/geometry-audit.json`: referencias visualmente revisadas.
- `data/model-production.json`: cola de reconstrucción del catálogo actual; candidatos no activos. `data/model-assets.json`: únicamente mallas visuales auditadas, sin sustituir datos mecánicos. Ejecutar auditoría GLB y `npm run test:models`; nunca convertir un fixture en producto.
- `data/brand.json`: identidad provisional Takegrid.
- `data/planner-rules.json`: cadenas conservadoras para rigs propios y etapas del montaje visual; no ampliar el catálogo ni activar accesorios pendientes sin nueva verificación.
- Raíces, grupos excluyentes, rutas contextuales y acciones de completar piezas se declaran en esas reglas. Cadenas ausentes, ciclos o decisiones contradictorias no activan geometría ni se solucionan eligiendo por el usuario. `vertical_frame` y `visual_subassemblies` en la distribución describen el marco ilustrativo y los objetos de malla, no medidas mecánicas nuevas. Ejecutar las pruebas de extensibilidad incluidas en `test:planner`.
- `data/catalog-intake.json`: investigación en cuarentena; no confundirla con piezas seleccionables.
- Sus `manifest_reviews` enlazan campos reales con fuentes y localizadores; mantener revisiones parciales y acceso fallido explícitos. No activan productos ni autorizan geometría.
- `data/catalog-pilot.json`: ficha relacional en cuarentena del conjunto exacto; referencia masas de las autoridades, sin duplicar especificaciones, coordenadas o piezas implícitas. Validar con `check:catalog` y `test:catalog`. Documentación, integración visual y ensayo físico son estados diferentes; el modo estricto no aprueba un piloto incompleto.
- `data/catalog-contract.json`: índice generado desde manifiestos, nunca otra autoridad de especificaciones.
- `data/connection-reviews.json`: evidencia por circuito y revisión exacta; los valores eléctricos permanecen en cables/puertos. No reutilizar una prueba para otro modelo, puerto o firmware.
- `data/beta-protocol.json`, `data/beta-evidence.json`, `data/release.json`, `data/funding-plan.json`: criterios, evidencia y alcance; no fabricar usuarios, ensayos ni presupuestos.
- `data/product-visuals.json`: miniaturas propias aprobadas por producto y huella de malla. Generar con `build:visuals`, sin aprobación automática; el build público permite sólo estas miniaturas y sus mallas auditadas.
- Después de editar datos, ejecutar `node scripts/sync-docs.mjs`, validar y compilar.

## Fidelidad y carga

- Una masa menor de 4.5 kg no demuestra equilibrio, inercia ni holgura.
- El límite publicado de 1.5 kg del 3026B no certifica seguridad dinámica.
- El manual 3203B, página 5, documenta abrazadera de varillas en el borde superior; no inventar adaptadores.
- Las masas publicadas del 3203B discrepan; conservar fuentes y masa conservadora de planificación de 351 g.
- Mic 2: representar sólo el RX DMR02 (28 g publicados), no la masa del kit ni los TX sobre cámara. Zapata 4770 documentada en manual página 4; asiento/pose/retención aproximados. Sin jaula elegida, conservar RX pendiente. Los offsets TRS en marco de cámara giran con el núcleo vertical, no con el monitor fijo.
- El centro ponderado de envolventes es una aproximación etiquetada, no CG medido ni par de motores.
- El ID histórico SmallHD que contiene `2mm` no es una especificación de conector: cable CBL-PWR-DTAP-BAR-36 de exterior 5.5 mm y centro positivo publicado. Entrada Indie 7 de 2.0 mm interior / 5.5 mm exterior y centro positivo verificados independientemente en SmallHD. Interior del cable y ajuste físico pendientes; nunca inferirlos de un ID.
- No redistribuir imágenes del fabricante ni importar CAD comunitario sin verificar derechos, revisión exacta y escala.
- Generar con IA no elimina derechos de fotos. No subir referencias sin autorización ni contratar planes/créditos sin permiso. Conservar entradas y notas de reunión bajo `research/private/` o `research/model-incoming/`, fuera del repositorio público. GLB sólo autocontenido, escala uniforme y coincidencia exacta; no mover puertos por aspecto de la malla.
- Las 18 mallas del generador `*-takegrid-v1`, más tres del piloto, son reconstrucciones propias aproximadas, no los originales de Sketchfab, CAD ni Meshy. Generar con `npm run build:models` antes de desarrollo/auditoría; ambos builds lo hacen automáticamente. Nunca actualizar huellas/revisión desde el generador. Conservar discrepancias de envolvente, salientes y pose explícitas. Las 13 entradas no modeladas tienen alcance en `model-production.unmodeled`.
- Netlify debe ejecutar `build:public` y publicar sólo `dist-public`; nunca subir el `dist` local completo ni `public/references`.
- No sustituir referencias retiradas de la demo pública por imágenes inventadas: enlazar a su fuente oficial.
- Preservar la identidad Takegrid, las cuatro tareas y las plantillas. Los rigs propios son copias/selecciones del usuario, no modificaciones del catálogo canónico.
- El guardado local no es sincronización de cuenta. No afirmar guardado si falla el almacenamiento; no sobrescribir cambios de otra pestaña ni añadir piezas implícitas a una selección.
- Conservar los planes en Mis rigs. No reintroducir exportación de archivos en la interfaz sin una petición explícita del usuario.
- Ejecutar `npm run test:planner`; las transiciones de montaje son ilustrativas, nunca trayectorias físicas verificadas.
- Rigs propios verticales: el monitor lateral 3026B/Indie 7 es una cadena candidata fija, no parte de la pila girada. NP-F970/PRO elegida permite alimentación nativa por contactos, no por barril DC; la pila V-mount vertical permanece en reserva. No modificar las siete plantillas ni esconder elecciones en el editor o la bandeja.
- Las tarjetas públicas priorizan 21 miniaturas de mallas propias aproximadas auditadas en `data/product-visuals.json`; el resto usa pictogramas de categoría etiquetados. No son fotos ni CAD. Los enlaces a fotos oficiales deben usar referencias visualmente revisadas; tablas eléctricas no son fotos de producto. Mantener los medios del fabricante fuera del paquete público.
- El usuario aplazó cuentas y nube: conservar guardado local. Biblioteca v2 aislada de v1, recuperación e historial como copias; no borrar la copia heredada sin petición expresa.
- Perfiles locales autorizados sin contraseña ni nube. El perfil inicial conserva las claves heredadas; otros perfiles usan namespaces aislados. Elección por pestaña, borradores confirmados antes de cambiar y ningún acceso a historial/borradores de otra biblioteca. No confundir separación de UX con autenticación o privacidad. Ejecutar pruebas de perfiles incluidas en `test:planner`.
- El service worker sólo admite recursos propios del manifiesto de compilación. No forzar activación/recarga ni cachear referencias del fabricante, APIs o datos privados como respuestas de red.
- Las mediciones del laboratorio son callbacks JavaScript, no tiempos de GPU, consumo de batería ni ensayos físicos. Beta y financiación no se liberan por compilación o registros vacíos.
- `data/pilot-model-assets.json`: expediente de tres reconstrucciones propias aproximadas para inspección aislada. Su alta explícita se registra en `data/pilot-integration.json`; datos vigentes en partes/puertos/distribución y recursos activos en `model-assets.json`, sin alterar las huellas.
- Piloto FX30/SEL20F18G/4770/NP-FZ100: sólo planificación a mano y horizontal. Monitor NATO 4770/2906B/Indie 7 con NP-F970/PRO y RX Mic 2 admitidos como candidatos propios de 0.2.12. Guía y fotogramas declarativos: cinco etapas del núcleo, hasta diez con accesorios. Otros contextos, gimbal, asa XLR y fuentes externas quedan elegidos pendientes. NP-FZ100 interna, sin cable ni bloque externo. Poses aproximadas no sustituyen campos físicos sin medir.
- NP-FZ100 también tiene pareja FX3 revisada en Sony: circuito y alojamiento propios, sin coordenadas de contactos. Es excluyente con 4253B; no sustituir fuentes automáticamente ni imponer dummy si la V-mount alimenta sólo monitor. Mantener 83 g sobre cuerpo solo, no sobre 715 g con batería/tarjeta. Ejecutar `test-native-camera-power.mjs` incluido en `test:catalog`; retención y ventilación reales pendientes.
- Una alta aditiva conserva la revisión de biblioteca; no modifica rigs existentes. Ejecutar `test:catalog` para las regresiones de integración y las revisiones de origen. Ensayo físico sigue pendiente.
- HDMI/MIC FX30 tienen sólo anclajes visuales aproximados del diagrama Sony; contactos y demás puertos siguen sin coordenadas. Circuitos/revisiones separados de FX3. `data/fx30-accessories-review.json` registra relaciones y ejemplos, no otra autoridad de especificaciones ni ensayos. Ejecutar `scripts/test-fx30-accessories.mjs` incluido en `test:catalog`; nunca añadir gimbal, fuentes o accesorios implícitos.
- `data/catalog-promotions.json`: registro de altas aditivas posteriores al piloto. SEL35F18F sólo a mano/horizontal, pares FX3 y FX30 propios; lente excluyente, 55 mm no hereda anillo 82-95 mm. Autor visual `sel35f18f`, sin anillo de zoom/apertura ni parasol implícito. Guía FX30 requiere cualquiera de las ópticas elegidas, no sólo SEL20F18G. Ejecutar `test-sel35-integration.mjs`.
- `data/rigging-intake.json`: inventario de investigación SmallRig/Tilta prioritario antes de más cámaras/ópticas. Doce familias, SKU/revisión distintos e interfaces direccionales; no se importa al selector. Tornillo incluido no es pieza añadida implícita ni masa duplicada. Rosca sola no prueba profundidad, antirrotación, carga ni seguridad; NATO riel no es NATO abrazadera. No inferir roscas internas de varillas por diámetro/material ni usar dimensiones de embalaje o contradictorias en geometría. Total y porcentaje desconocidos hasta enumeración completa. Ejecutar `test-rigging-intake.mjs` incluido en `test:catalog`.
