# Corrección del flujo de trípode 0.2.22

## Causa Reproducida

Al elegir 3751B en un plan todavía a mano, el alcance estático se aplicaba a toda la selección antes del cambio de contexto. FX3 con FE 35mm F1.8 perdía la óptica activa, aunque el trípode siguiera pendiente. La condición ahora exige contexto estático: no se aprueban más productos ni otra interfaz.

El acceso desde la jaula mostraba el trípode como bloqueado por contexto, oculto entre diagnósticos; no ofrecía preparar el modo correspondiente. Se añade una acción explícita que cambia a estático horizontal y abre el editor, conservando todas las unidades y sin añadir equipo.

## FX3 Y Jaula

FX3 + HawkLock 4770, en estático horizontal, puede añadir únicamente AD-01 3751B con su placa y tornillo incluidos. Óptica y batería no son adaptadores de trípode: sus avisos de preparación para rodar permanecen separados. No se instala batería, lente ni placa adicional de manera implícita.

El editor muestra preparación del trípode tanto en Catálogo como en Elegidas. Diferencia modo incorrecto, soporte candidato, conjunto de referencia incompleto y piezas fuera del alcance documental. Estas últimas no se declaran físicamente imposibles; se conservan pendientes o pasan a repuestos sólo tras marcar confirmación y ejecutar la acción. Se preservan IDs, etiquetas, número de unidades, selección restante e historial de guardado.

## Límites Mecánicos

No se cambian piezas, dimensiones, masas, puertos, circuitos, poses ni las siete plantillas. Se conserva la cadena estática FX3/4770 y el conjunto completo de referencia FX3/16-35 GM/4770/NP-FZ100. Otros cuerpos, ópticas y accesorios no heredan compatibilidad. Compartir una rosca no certifica profundidad, retención o estabilidad; no se inventa adaptador ni equivalencia con QR RS4.

Autoridades: `static-support-integration.json`, `planner-rules.json`, `parts-manifest.json` y manuales enlazados. [Producto oficial 3751B](https://www.smallrig.com/smallrig-heavy-duty-fluid-head-tripod-ad-01-3751b.html?sku=3751B).

## Pruebas

`test-tripod-flow.mjs` añade 13 regresiones: FX3/jaula sin batería u óptica, contexto, extras, confirmación caducada, límites, repuestos, todas las piezas individuales como extra, guía, despiece, cuatro circuitos y recuperación serializada. La matriz general mantiene 8507 casos y 21 comprobaciones; tras revisar diferencias, las propuestas explícitas pasan de 1274 a 1296 porque el trípode pendiente ya no bloquea contextos ajenos. Las plantillas y su selección no cambian.

Compilación pública completa correcta con Node instalado 24.14.1. Mantiene 68 recursos propios y 26 mallas aproximadas; sin medios del fabricante o notas privadas. Se conserva advertencia de dos módulos mayores de 500 kB; no se atribuyen mejoras de FPS.

Interfaz Edge a 390 ×844: crear FX3 y jaula a mano, elegir la jaula, preparar trípode desde accesorios, añadir únicamente AD-01 y verificar las tres piezas en visor. Después completar óptica/batería nativa, guardar y recuperar las cinco elecciones. Monitor NATO/serie L y receptor Mic 2 añadidos desde jaula; diez elecciones, cuatro enlaces con extremos A/B correctos y reproducción final 9/9, sin retirada opcional automática. Se añadió una FE 35mm como extra: no se sustituyó por inferencia; sólo pasó a repuesto tras marcar confirmación y ejecutar la acción. Guardar/recargar conservó once unidades, un repuesto y diez elecciones sin faltantes detectados.

La confirmación actualizada se repitió sobre el paquete final: botón de pasar a repuestos desactivado antes de marcar la casilla; guardar/recargar conserva las unidades. Editor revisado también a 320 ×568. Evidencia privada: `research/model-incoming/qa-0222/editor-tripode-movil.png`. El viewport se restauró; son pruebas emuladas, no teléfonos reales.

Una repetición de la compilación se interrumpió con fallo nativo del proceso local durante la matriz (`-1073741819`). Se conserva `build-0222-final.log`; matriz aislada repetida correctamente y compilación completa posterior con salida 0 en `research/model-incoming/build-0222-final-retry.log`. No se omitieron pruebas ni se publicó una salida incompleta. La opción local `--no-opt` no afecta al navegador ni mide FPS.

Los ensayos físicos siguen pendientes. No se afirma funcionamiento perfecto ni cobertura de todas las combinaciones posibles. La biblioteca de producción del usuario se leyó para diagnóstico, pero no se modificó ni se usó para las pruebas de escritura.

## Publicación Confirmada

[Takegrid 0.2.22](https://takegrid-rigs.pabloteran57.chatgpt.site/) confirmó `succeeded` a las `2026-10-22T13:53:22.016381+00:00`, 22 de octubre a las 08:53 de Ecuador. Versión 19 del proveedor; despliegue `appgdep_6ada154974a08191b905051f9de4fefe`. Fuente respaldada `da8c0f04836b995af79a299ebf164466abc5cfa8`; estática `d71fbf30d66fa2642bb67d8d1db07cd28f020019`.

68 recursos propios, 8 330 517 bytes, cotejados entre compilación y fuente estática. HTTP 200, entrada `/assets/index-gX8bSrZV.js` coincidente por SHA-256 y Ayuda pública mostró 0.2.22; sin errores de consola observados. [Huellas y recuperación](additional-hosting.md), [registro estructurado](../data/tripod-flow-review.json). Sin cambio de acceso público, facturación, nube, biblioteca o recarga forzada de pestañas del usuario.
