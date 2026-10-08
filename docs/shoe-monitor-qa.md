# Verificación de zapata y asa 0.2.14

Revisión: 8 de octubre de 2026. Evidencia de software y documentación; no aprobación física, CAD exacto ni beta profesional.

## Alcance

36 entradas, 23 mallas y miniaturas propias aproximadas. Dos altas: SmallRig 2905B y 4152. Las siete plantillas, cuatro tareas, bibliotecas y revisión histórica de guardado permanecen sin sustituciones. Los 26 candidatos SmallRig/Tilta de investigación siguen fuera del selector; no constituyen el catálogo completo.

Orden cumplido: manifiesto y manuales, distribución, rutas existentes por cuerpo, guía condicionada, modelos/visor y cuatro selecciones de ejemplo. Fuentes y discrepancias en [altas aditivas](catalog-promotions.md), [manifiesto](verified-build-manifest.md) y [distribución](physical-layout-plan.md).

## Ciclo Ejecutado

| Reproducción | Corrección | Evidencia |
| --- | --- | --- |
| Un grupo de anclaje se trataba como exclusivo incluso fuera de su contexto | Evaluar su condición antes de bloquear piezas | `test-mount-resources.mjs`, regresiones del planificador |
| La sugerencia desde el asa evaluaba soportes antes de la selección propuesta | Resolver la propuesta completa y comprobar ancla y cadena activas | `test-shoe-monitor-integration.mjs`, interfaz local |
| Instrucción de giro atribuía 2906B a 2905B | Mostrar recorrido del soporte elegido y remitir a su manual | Panel de ajustes, prueba negativa y navegador |
| Tarjeta del monitor describía siempre la cadena NATO anterior | Leer el nombre de la ruta candidata resuelta; pendientes sin soporte inventado | Editor móvil y regresión |
| Informe anunciaba más subselecciones de las ejecutadas | Contador calculado desde las selecciones de ejemplo | 2048 combinaciones del lote, no 4096 |
| Paquete rebasaba el antiguo límite de 7 MB | Deduplicación numérica acotada de vértices nuevos; conservar detalle y declarar presupuesto ampliado a 7,5 MB | 62 archivos propios, 7 128 133 bytes; no mejora de GPU afirmada |

## Pruebas de Software

`npm run build:public` superado. Después de las correcciones de texto: `npm run validate`, `npx tsc --noEmit`, compilación pública Vite y `node scripts/check-public-build.mjs` repetidos correctamente. 388 casos identificados como CORRECTO; incluyen 22 comprobaciones del lote, 2048 subselecciones nuevas y regresiones anteriores. Rechazo de revisión ajena, fuente de otra interfaz, pareja duplicada y aprobación ficticia.

Casos del lote: cuatro selecciones completas FX3/FX30; zapata compartida bloquea soporte/RX; asa separa anclajes; NATO ocupado no se duplica; gimbal/vertical/XLR quedan pendientes; retirar soporte conserva elecciones; guía sin soportes ajenos; pivote ilustrativo unido al monitor; límites de ajuste acotados; guardado/historial preservan pose; cable visible sólo con extremos activos. La masa incluye exclusivamente piezas representadas y los 28 g del RX, no TX ni estuche.

## Navegador Local

Edge, compilación pública servida en `http://127.0.0.1:4174/`. Perfil aislado `QA montaje 0.2.14`; no se borraron ni modificaron planes anteriores. No se realizó un ensayo en teléfono físico.

- Crear desde cero: FX30, SEL35F18F, 4770, NP-FZ100 y 4152 elegidos individualmente.
- Seleccionar asa y añadir monitor: propuesta anuncia 2905B, Indie 7, HDMI y NP-F970/PRO; sólo se añaden al confirmar.
- Seleccionar jaula y añadir RX: zapata separada del monitor, sin TX sobre cámara.
- Diez elecciones guardadas y recuperadas tras recargar; HDMI permanece en lista sin objeto de cable independiente.
- Ajustes 1 grado de inclinación y -1 grado de giro recuperados con 2905B, sin textos de 2906B.
- Guía de diez etapas: asa incluida junto a jaula antes del monitor; reproducción 2x, pausa, continuación, fin y reinicio observados.
- Conexiones: cuatro enlaces elegidos, dos por contactos sin cable ficticio, HDMI FX30/Indie y TRS RX/FX30; extremos A/B y curva ilustrativa visibles.
- Viewport 390 x 844: quitar/añadir 4152 permanece en Catálogo, no salta al manual; nueve elecciones conservan monitor/RX pendientes por zapata compartida; restaurar asa devuelve diez. Guardado y recarga comprobados. Tamaño restablecido al terminar.
- Tras la recarga final, consola sin entradas de error capturadas en esta sesión. No equivale a ausencia universal de incidencias.

Capturas locales excluidas de publicación: `research/model-incoming/rigging-0214/desktop-connections.png` y `mobile-selection.png`. Diez vistas de mallas propias revisadas contra diagramas de los manuales; triángulos y envolventes permanecen aproximados. No se publican manuales, fotografías ni notas privadas.

## Pendientes Reales

Retención de zapata, longitud de tornillo, antirrotación, holgura, mano, palanca, masa instalada, señal y audio requieren ejemplares reales. No se habilita rotación del asa en la app ni uso simultáneo de ambas zapatas posteriores. La discrepancia 170/180 grados del 2905B queda abierta; rango visual conservador de 170 grados totales.

`npm run check:beta` conserva participantes, dispositivos, ensayos, privacidad, soporte y financiación pendientes. Cuentas y nube siguen aplazadas. El siguiente lote de montaje se trabaja con el mismo criterio; compartir marca, rosca o diámetro no certifica una cadena.

## Publicación Confirmada

0.2.14 publicada en el mismo enlace público el 2026-10-08T17:17:31.072287+00:00; Sites confirmó `succeeded`. Código `f975d6ab87830ad2daf261626be50f0bae8232e1`, copia estática `c474ce786f6a8ec88be293451df3c509dd9b423b`; paquete exacto de 62 archivos propios más configuración. [Registro de publicación](additional-hosting.md). La confirmación de alojamiento no se presenta como prueba física o navegación de producción.
