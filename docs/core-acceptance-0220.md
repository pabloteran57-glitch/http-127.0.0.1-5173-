# Estabilización del núcleo 0.2.20

## Alcance

Cierre de una etapa de software, no declaración de producto final ni liberación de beta profesional. No cambia el catálogo de 39 entradas, las 26 mallas propias aproximadas, los 22 circuitos ni las siete plantillas. Tampoco migra bibliotecas o añade nube. Registro estructurado: `data/core-acceptance.json`.

## Correcciones

- La revisión diferencia faltantes de selección de comprobaciones con equipo real, tanto en el editor como en el plan. Una regla desconocida o una pieza sin soporte sigue siendo un pendiente; nunca se convierte en aprobación física.
- Las inspecciones previas se filtran por selección y contexto. Un rig estático no recibe la prueba de motores o extracción de gimbal; las piezas elegidas en reserva conservan sus advertencias.
- Un cambio de biblioteca en otra pestaña genera un aviso sin reemplazar el borrador. El guardado conserva sus verificaciones de concurrencia y bloqueo. Revisar una biblioteca sin cambios no duplica los borradores abiertos.
- Si el navegador interrumpe el contexto 3D, la página conserva selección, conexiones y guía. El usuario puede reiniciar sólo el visor; el montaje automático se pausa. No se fuerza activación del worker ni recarga de la página.

## Protocolo

Reproducir, corregir, ejecutar regresiones, recorrer la interfaz, comparar y publicar el mismo paquete. `scripts/test-core-acceptance.mjs` incorpora 18 comprobaciones, incluidas 1500 subselecciones en cuatro contextos, conservación de piezas, filtrado, fuentes condicionadas, aislamiento, errores de almacenamiento y ciclo de vida del contexto. Se ejecuta con `test:planner` además de las pruebas existentes.

Las pruebas del visor usan un laboratorio exclusivo de desarrollo: fallo deliberado de carga y evento de interrupción sintético. No son ensayos de fallo GPU o hardware. El evento se escucha en el canvas, no en un ancestro: [referencia oficial MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event).

## Evidencia

Resultados registrados en `data/core-acceptance.json`, no en registros de usuarios de beta:

- Escritorio, navegador integrado 1280 ×720: nueve elecciones a mano con monitor y RX; guardar, renombrar y recargar conserva las nueve. Historial y borrador recuperados como copias. Perfil nuevo sin rigs o borradores del perfil inicial.
- Dos pestañas: el segundo guardado en conflicto fue rechazado. El aviso mantuvo el borrador abierto; actualizar conservó el remoto y una copia local. Repetir la actualización mantuvo dos tarjetas, sin crear una tercera.
- Edge 390 ×844: once elecciones de rig vertical desde cero, monitor lateral/serie L y RX visibles; reproducción a 2× terminó en la octava etapa y no entró en extracción opcional. No requiere controles de gimbal para el monitor NATO de un rig a mano.
- Edge 320 ×568 y 568 ×320: editor directo, búsqueda vacía recuperable, núcleos estático y al hombro con monitor/RX y guía propia de nueve etapas más retirada opcional. Siete plantillas recorridas manualmente. Sin desbordamiento horizontal del documento en los tamaños comprobados.
- Quitar 2906B conservó Indie 7 en la selección como montaje pendiente, sin monitor flotante en el 3D. Se mantuvieron cámara, óptica, jaula, RX y batería nativa.
- Laboratorio de desarrollo: reintento tras fallo de módulo y tras evento de contexto perdido correcto, sin recarga ni cambio de las siete piezas de plantilla.
- Ayuda confirmó preparación de recursos propios sin conexión. Regresiones de worker, perfiles, almacenamiento y revisión por unidad conservadas. No se declara prueba de desconexión física.

El override del navegador integrado no modificó su viewport: no se contabiliza como prueba móvil. Las medidas móviles anteriores se comprobaron en Edge leyendo el viewport efectivo. Son emulaciones, no teléfonos físicos.

Capturas y registros permanecen fuera del repositorio público bajo `research/model-incoming/core-0220/`. No se observaron errores de consola en los recorridos públicos consultados; los errores deliberados del laboratorio se distinguen de fallos de la aplicación.

Se corrigió durante el recorrido una referencia de SEL35F18F que aparecía con el zoom: ahora las fuentes de óptica y batería pertenecen a sus bloques elegidos. Regresión positiva/negativa incluida.

## Límites

Siguen pendientes ensayos físicos de retención, carga, señal, alimentación y holguras; mediciones en dispositivos de referencia; aceptación observada con usuarios; derechos de recursos exactos de terceros y requisitos operativos de beta/financiación. La separación visual de estados no declara listo para producción un montaje. Los perfiles son locales, sin autenticación ni sincronización.
