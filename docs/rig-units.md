# Unidades y repuestos

Bloque 0.2.16, 17 de octubre de 2026. Continúa la base extensible antes de nuevas altas. Catálogo: 36 entradas; siete plantillas, especificaciones, geometrías y circuitos canónicos sin cambios.

Contrato reutilizable: `data/unit-planning.json`. Es estado de software, no otra autoridad de especificaciones.

## Alcance implementado

- `CustomRig.schema_version: 2` conserva `part_ids` como proyección única de los productos elegidos para el rig.
- `units` identifica cada unidad dentro del proyecto mediante `id`, `part_id`, `label` y `role` (`rig` o `spare`). Las etiquetas son del usuario, no números de serie comprobados.
- Una unidad `rig` expresa intención de montaje. El motor puede mantenerla pendiente; no significa instalación ni compatibilidad certificada.
- Sólo una unidad por SKU participa en las cadenas actuales. Las adicionales son repuestos sin pose, anclaje, cable ni carga activa. No se representan dos cuerpos superpuestos ni se divide una salida HDMI.
- «Usar en rig» intercambia explícitamente las unidades del mismo SKU. La anterior permanece como repuesto. No elige otro producto ni resuelve conflictos entre productos.
- «Quitar» retira sólo la unidad señalada. Retirar la unidad de un soporte deja sus accesorios elegidos pendientes, aunque exista un repuesto; no hay sustitución automática.
- Mi equipo muestra cada unidad y permite buscar su etiqueta. Una unidad de repuesto abre la gestión, no se muestra como instalada.
- Límites de software: 120 unidades por proyecto, 20 por producto. No son límites de peso, capacidad ni seguridad. Las aplicaciones no ofrecen el botón de repuesto.

## Conservación local

La nueva biblioteca usa `takegrid.rigs.v3`; el sobre tiene versión 3. Lee v3 o, cuando aún no existe, v2 o v1. La conversión en memoria es determinista, mantiene selección, fecha, orientación y ajustes; no escribe por abrir la app. Al guardar se conserva el historial anterior en el nuevo sobre y las claves v1/v2 permanecen intactas.

Se conservan huellas de ambas bibliotecas anteriores. Cambios de pestañas antiguas bloquean el guardado hasta su revisión explícita; se recuperan como copias. La coordinación entre pestañas vigentes conserva bloqueo y comparación de la biblioteca completa.

Los borradores nuevos usan `takegrid.drafts.v2.*`. Los antiguos `takegrid.drafts.v1.*` siguen recuperables; confirmar un guardado nuevo no los elimina. Los perfiles locales aíslan ambos formatos, historial y bibliotecas. Duplicar o recuperar crea nuevos identificadores de unidad, sin alterar originales.

No hay nube, autenticación, sincronización, exportación ni garantía de recuperación tras borrar datos del navegador.

## Siguiente criterio

Antes de montar simultáneamente dos unidades del mismo modelo: declarar asignación de asiento por unidad, capacidad y exclusiones de recursos, extremos de cable por instancia, ajustes independientes, guía y masas por instalación. Documentar una cadena real completa y probar regresiones de biblioteca, selección, geometría y conexiones. Una rosca o dos objetos dibujados no prueban que esa cadena exista.

Después: primer lote pequeño y coherente de accesorios SmallRig/Tilta, con revisión exacta, dimensiones/masas trazables, montaje y cableado documentados. Los 26 candidatos de investigación no se convierten en seleccionables por este bloque.

## Verificación

`scripts/test-rig-units.mjs`: conversión, identidad, etiquetas, intercambio, retirada sin sustitución, sólo repuestos, límites, formatos rechazados, copia, conservación v1/v2 e historial, detección de cambios antiguos, conflictos/cuota, borradores y perfiles. Compara geometría lógica, trece fotogramas y circuitos antes/después de añadir repuestos; conserva las siete plantillas. Las pruebas de software no son ensayos físicos ni aceptación de beta.

Revisión local del paquete público: perfil separado «QA unidades 0.2.16»; ocho productos para el rig y dos repuestos. Etiqueta «Monitor B» recuperada tras recarga y búsqueda devuelve sólo esa unidad. Intercambio de unidad en ventana móvil de 390 × 844: conserva diez unidades/dos repuestos, muestra roles distintos y controles de 42 px; página y diálogo sin desbordamiento horizontal (390 px). Montaje muestra seis etapas del conjunto elegido, sin una etapa de instalación para repuestos. Es una ventana emulada, no un teléfono ni una prueba de usuarios. Evidencia visual privada en `research/model-incoming/qa-0216/`, excluida del respaldo y paquete públicos.
