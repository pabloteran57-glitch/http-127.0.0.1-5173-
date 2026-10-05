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
- Monitor fuera de cámara, al lado del gimbal.
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
- `data/ports-manifest.json`: identidad de conectores; anclajes espaciales aproximados.
- `data/assembly-guide.json`: las trece etapas de montaje.
- `data/engineering-manifest.json`: límites publicados y políticas de incertidumbre.
- `data/geometry-references.json`: atribución y huellas de referencias descargadas.
- `data/geometry-audit.json`: referencias visualmente revisadas.
- `data/brand.json`: identidad provisional Takegrid.
- `data/planner-rules.json`: cadenas conservadoras para rigs propios y etapas del montaje visual; no ampliar el catálogo ni activar accesorios pendientes sin nueva verificación.
- Después de editar datos, ejecutar `node scripts/sync-docs.mjs`, validar y compilar.

## Fidelidad y carga

- Una masa menor de 4.5 kg no demuestra equilibrio, inercia ni holgura.
- El límite publicado de 1.5 kg del 3026B no certifica seguridad dinámica.
- El manual 3203B, página 5, documenta abrazadera de varillas en el borde superior; no inventar adaptadores.
- Las masas publicadas del 3203B discrepan; conservar fuentes y masa conservadora de planificación de 351 g.
- El centro ponderado de envolventes es una aproximación etiquetada, no CG medido ni par de motores.
- El ID histórico SmallHD que contiene `2mm` no es una especificación de conector: diámetro exterior 5.5 mm; interior y polaridad pendientes.
- No redistribuir imágenes del fabricante ni importar CAD comunitario sin verificar derechos, revisión exacta y escala.
- Netlify debe ejecutar `build:public` y publicar sólo `dist-public`; nunca subir el `dist` local completo ni `public/references`.
- No sustituir referencias retiradas de la demo pública por imágenes inventadas: enlazar a su fuente oficial.
- Preservar la identidad Takegrid, las cuatro tareas y las plantillas. Los rigs propios son copias/selecciones del usuario, no modificaciones del catálogo canónico.
- El guardado local no es sincronización de cuenta. No afirmar guardado si falla el almacenamiento; no sobrescribir cambios de otra pestaña ni añadir piezas implícitas a una selección.
- Conservar los planes en Mis rigs. No reintroducir exportación de archivos en la interfaz sin una petición explícita del usuario.
- Ejecutar `npm run test:planner`; las transiciones de montaje son ilustrativas, nunca trayectorias físicas verificadas.
