# Trípode, varillas y V-mount 0.2.23

## Diagnóstico

La captura de 17 elecciones no correspondía al núcleo básico ensayado en la corrección anterior. Tres reglas se interferían: el alcance del trípode excluía 1674/V-mount/XLR, el alcance XLR excluía el trípode inferior, y el conjunto estático imponía NP-FZ100 aunque se hubiera elegido 4253B. No era una colisión física detectada ni faltaba comprar otra placa.

## Manifiesto Y Distribución

El [manual oficial 1674](https://static.smallrig.com/mall/img/public/vcqnxceuxol-1747621696364_.pdf), páginas 2-3, documenta conexión a trípode y dos roscas inferiores 1/4-20 y una 3/8-16. El manual 3751B, páginas 18-19, documenta placa, tornillos y seguro. Se revisó la unión por interfaces separadas; no existe ensayo físico del conjunto ni profundidad de rosca medida.

Cadena directa: cabezal AD-01 → placa incluida → jaula 4770. Con varillas: cabezal → placa incluida → 1674 → jaula/cámara. La batería permanece baja en 3203B sobre varillas, siguiendo el montaje superior del manual 3203B página 5. El riel superior 4770 se retira al usar XLR-H1; el monitor se fija mediante 4830/2906B.

No se altera ninguna malla. Los perfiles directo/con base son excluyentes. Para el dibujo con base se baja la envolvente del trípode 26 mm, altura publicada de 1674: ajuste ilustrativo, no cota de asiento verificada. Cabezal, palanca, batería, extremos de varillas, profundidad de tornillo y antitorsión requieren inspección real. El parasol no se dibuja sostenido por barras cortas sin medir alcance frontal.

## Alimentación Y Montaje

Se conservan las 17 elecciones: FX3, XLR-H1, 16-35 GM, 4770, 1674, varillas, 3645, Indie 7, VB99 Pro, 3203B, 4253B, RX Mic 2, HDMI, cable SmallHD D-Tap/DC, 2906B, 4830 y 3751B. No se añaden batería nativa, duplicador ni otra placa.

Cinco circuitos existentes: VB99/placa por contactos, D-Tap propio VB99 a FX3 mediante 4253B regulado, D-Tap de placa a Indie 7, HDMI FX3 a Indie 7 y TRS RX a INPUT3 de XLR-H1. No se usan las dos cargas sobre una sola salida D-Tap ni MIC del cuerpo en paralelo con el asa. Ajuste físico del barril SmallHD y operación real de circuitos siguen pendientes según sus revisiones.

Guía con base: cámara/óptica, jaula/XLR, base/varillas, parasol, placa/batería, trípode, monitor, RX, HDMI, energía, audio y comprobación final. Retirada es opcional, fuera de reproducción. Los perfiles básicos y las siete plantillas se conservan.

## Verificación

20 regresiones nuevas reproducen la selección exacta, fuentes alternativas (también V-mount sólo para monitor y serie L para monitor), soportes por unidad, cinco circuitos, las doce etapas, despiece, omisiones y recuperación sin piezas implícitas. Las pruebas heredadas se ajustan sólo donde cambió el alcance documental; siguen bloqueados FX30, gimbal, vertical y accesorios fuera de esta revisión. La matriz general pasa a 8525 casos por el nuevo ejemplo y sus omisiones, con 1365 propuestas revalidadas; conserva siete plantillas, 14 circuitos candidatos y ocho en banco/condicional.

Compilación pública completa, pruebas de planificador/catálogo/modelos, TypeScript y auditoría correctos: 68 archivos autorizados y 26 mallas propias aproximadas. Permanecen dos módulos JavaScript de más de 500 kB como advertencia, no error.

En navegador se crearon las 17 elecciones desde el editor, se guardaron y se recuperaron tras recargar. Trípode en visor, cero faltantes de selección y tres comprobaciones físicas separadas. Cinco circuitos correctos, reproducción de doce etapas hasta parada automática, reinicio y avance manual comprobados. Retirada no se reproduce automáticamente. Ensamble, despiece y encuadre completo revisados. Inspección de escritorio y ventanas 390 x 844 y 320 x 740; sin errores de consola observados. No es ensayo de teléfono físico ni medida de GPU/FPS. Evidencia estructurada en `data/static-vmount-review.json`; capturas privadas excluidas del código y del paquete.

No es certificación física ni prueba de compatibilidad universal.

## Publicación

[Takegrid 0.2.23](https://takegrid-rigs.pabloteran57.chatgpt.site/), versión guardada 20, despliegue `succeeded` el 22 de octubre a las 11:32 de Ecuador. Inicio y módulo de entrada HTTP 200, SHA-256 público idéntico al compilado; Ayuda muestra 0.2.23 en una pestaña nueva sin modificar la biblioteca del usuario. Identificadores y huellas en `data/static-vmount-review.json` y `docs/additional-hosting.md`.

No se fuerza recarga o activación de service worker sobre pestañas existentes. Si una revisión anterior dejó unidades como repuestos, esta corrección no las promueve ni elimina silenciosamente: el usuario conserva la decisión de asignarlas al rig desde Elegidas. Se preservan las siete plantillas, perfiles y bibliotecas locales.
