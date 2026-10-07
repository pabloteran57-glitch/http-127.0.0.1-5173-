# Revisión del piloto FX30

Fecha: 2026-10-07. Alcance: investigación y contratos de datos; no nuevas piezas instalables ni cambios en el editor o las bibliotecas.

## Trabajo Completado

- Manifiesto: confirmación oficial adicional de FX30, SEL20F18G y NP-FZ100. Corregida la masa del objetivo a aproximada; una sola salida HDMI Type A en FX30.
- Pares exactos: Sony confirma FX30/SEL20F18G y batería nativa; el manual visual 4770 incluye FX30. La tabla de óptica no especifica firmware.
- Distribución relacional: cuerpo, jaula, objetivo y batería nativa. Coordenadas y rotaciones permanecen nulas, sin copiar FX3.
- Alimentación: contactos nativos; sin cable externo, dummy, V-mount, monitor o gimbal añadido.
- Guía: cinco etapas aplicables y comprobaciones de acceso, ventilación, fijación y batería. No inventa torque ni longitudes de tornillos.
- Masa: subtotal documental aproximado de 1226 g desde cuerpo solo, kit de jaula, objetivo y batería. Excluye tarjeta y parasol; no demuestra equilibrio ni masa del subconjunto instalado.
- Datos reutilizables: [ficha estructurada](../data/catalog-pilot.json), [documentación generada](catalog-pilot-blueprint.md) y validador separado de la aplicación.

## Evidencia De Software

`node scripts/sync-docs.mjs` y `npm run build:public` completados. La compilación comprueba los datos, 17 mallas propias, TypeScript y el paquete público. Pasaron 248 comprobaciones de software: 170 del planificador, 58 de modelos/miniaturas y 20 del piloto. Los escenarios aleatorios adicionales conservan su alcance descrito en los informes previos; no representan usuarios reales.

Las nuevas pruebas rechazan modelos o fuentes ajenos, evidencia sin alcance de par, firmware inventado, masa compuesta que duplica batería, soportes sin evidencia, coordenadas no revisadas, cableado ficticio, piezas implícitas, omisiones de guía y mallas heredadas. Las autoridades y la selección original no se mutan.

`npm run check:catalog -- --strict` devuelve error de forma esperada: faltan geometría propia e integración. `npm run check:beta -- --strict` también devuelve error por criterios reales pendientes. No se cambia un criterio a aprobado sólo para obtener una salida correcta.

El build emitió la advertencia existente de paquetes JavaScript mayores de 500 kB. No se midió fluidez, GPU, batería ni UX móvil en este bloque; no se anuncia una mejora de rendimiento.

## Respaldo Y Publicación

Código y documentos respaldados en el repositorio GitHub existente, revisión `1e17b06804f68f70a1337e4704189daa449f4e8b`, sin forzar historial ni incluir investigación privada. La copia pública de los 50 archivos coincide byte a byte con `dist-public`. Sites confirmó `succeeded` a las 18:05 de Ecuador en el [enlace existente](https://takegrid-rigs.pabloteran57.chatgpt.site), conservando versión funcional 0.2.8 y sin activar el piloto. [Registro de publicación](additional-hosting.md).

La finalización del proveedor no es un nuevo ensayo de la interfaz de producción. Los registros de UX anteriores mantienen su fecha y alcance; no se recargaron pestañas ni se tocaron borradores del usuario.

## Lo Siguiente

1. Crear recursos propios aproximados para FX30, SEL20F18G y NP-FZ100; auditar escala, forma, alcance, huellas y derechos. No tratar diagramas como CAD.
2. Integrar ese conjunto por datos, con selección y guía dinámica; probar guardado, perfiles, montaje y escritorio/móvil antes de ofrecerlo.
3. Registrar ensamblaje y mediciones del equipo físico, y pruebas observadas con usuarios. No sustituirlos con fixtures de software.

Las fases del plan conservan sus criterios: núcleo pendiente de aceptación/mediciones físicas; extensibilidad pendiente de segundo conjunto integrado; catálogo pendiente de liberación; protección local disponible y nube aplazada; beta cerrada/pública y financiación no liberadas. Las notas privadas de la reunión siguen siendo exploratorias, no observaciones de beta ni recursos públicos.

No se importaron modelos de Sketchfab/Meshy ni fotos con derechos sin verificar. No se cambiaron las siete plantillas, las 30 entradas activas, los 18 circuitos actuales, el almacenamiento local ni el contexto de rigs del usuario.
