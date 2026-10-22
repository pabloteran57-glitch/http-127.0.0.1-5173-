# Dependencias y verificación de conjuntos 0.2.21

## Dos Etapas Encadenadas

1. Asistente de dependencias: cada pieza conserva recordatorios de soporte, vídeo y energía aun si queda pendiente. Propuestas enumeradas y revalidadas; alternativas explícitas, sin retirar elecciones o promover repuestos. Trípode con cambio de contexto explícito y placa/tornillos del kit identificados como incluidos. [Contrato](dependency-advisor.md).
2. Verificación de conjuntos: seis comprobaciones integradas en Conexiones, y matriz reproducible del catálogo actual. Montaje FX30 corregido para que su HDMI tenga referencia de cable en la etapa correspondiente. No aparecen circuitos sin origen y extremos. [Resultados generados](setup-matrix-qa.md).

## Orden Técnico

No se incorporan productos, puertos, rutas físicas ni nuevas compatibilidades. Los 39 registros, 26 mallas aproximadas, 22 circuitos y siete plantillas se conservan. Distribución y tornillería siguen sus autoridades; las necesidades se derivan de reglas y los contenidos de kit de `bundle_includes`. La protección de montaje modifica sólo la secuencia lógica y su validación, no promete una trayectoria real.

El AD-01 incluye placa y tornillos. La cadena revisada actual sigue acotada; una combinación distinta se etiqueta pendiente de revisión, no físicamente imposible ni solucionable comprando una placa inventada.

## Verificación y Cierre

Matriz: 21 comprobaciones, 8507 casos y 1274 propuestas revalidadas, con las 39 piezas y escenarios positivos de los 14 circuitos candidatos; otros ocho permanecen en banco/condicional. La prueba detectó y corrigió el origen de cable omitido del montaje FX30. El selector de conexiones precede a la ficha y no fuerza scroll: la ficha de distinta altura ya no mueve las opciones al elegir.

Construcción completa comprobada con Node 24.14.1 instalado. El runtime integrado 24.19 falló nativamente durante un bucle y durante empaquetado; esa salida no se publica. `--no-opt` sólo afecta la matriz local. No se cambia el navegador ni se atribuye una mejora de FPS. Advertencia de dos módulos superiores a 500 kB conservada.

Prueba de interfaz en Edge, 390 ×844: crear FX3 y 3751B inicialmente a mano, mostrar contenido del kit, cambiar contexto explícitamente y elegir las tres piezas faltantes. Núcleo final de cinco piezas; no se añadió otra placa. Monitor pendiente conservó sus tres necesidades de soporte/vídeo/energía. La propuesta serie L y el HDMI completaron el monitor; RX elegido aparte. Guardar/recargar conservó diez elecciones y cuatro enlaces.

Los cuatro enlaces se seleccionaron en móvil y cada ficha mostró los extremos correspondientes: FX3/Indie 7, Mic 2/FX3, NP-F970/PRO/Indie 7 y NP-FZ100/FX3. La prueba de cambios rápidos detectó el selector debajo de una ficha de altura variable; corregido y repetido con los cuatro resultados correctos. Montaje estático finalizó en etapa 9/9 sin retirada automática. Ensamble/despiece conservaron las nueve piezas con geometría y la elección del cable en la lista.

FX30 a mano con nueve elecciones: etapa 8 muestra HDMI Kondor Blue y su circuito FX30, no una ruta FX3. Recorridas las cuatro tareas de cada una de las siete plantillas; inventario coincidió con la selección (19/17/7/9/8/6/18), sin errores de consola observados. Sin desbordamiento de documento a 390 ×844 o 320 ×568. Son viewports emulados, no teléfonos físicos. Escritorio restaurado a su tamaño habitual; captura privada del trípode completo y su kit en `research/model-incoming/qa-0221/tripode-completo-escritorio.png`.

Las propuestas no confirman compras, retención, compatibilidad universal o alimentación real. No se atribuyen a usuarios ni equipos físicos los casos automatizados. La aprobación de beta profesional sigue separada de este cierre de software. Publicación y huellas se registran sólo después de la confirmación remota.
