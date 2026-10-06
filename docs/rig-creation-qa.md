# Creación de rigs 0.2.2

## Incidencia y orden técnico

Caso comunicado: rig propio vertical con gimbal y monitor, monitor ausente. La regla `vertical_excluded_part_ids` excluía el soporte fijo 3026B y el Indie 7 junto con la pila móvil de varillas/V-mount.

Manifiesto: se mantienen 27 identidades, masas y dimensiones existentes. Distribución: el manual DJI describe el cambio de la plataforma de cámara, y el 3026B la abrazadera lateral NATO del RS 4 Pro. Se conserva esa cadena candidata fija, no se crea un adaptador ni se afirma ensayo físico del conjunto. Cables: HDMI elegido puede conectar ambos extremos; la alimentación del monitor queda pendiente sin cadena activa. Guía: monitor en etapa seis, vídeo en nueve y revisión de alimentación en once. Sólo después se modifica el editor y la presentación. Las siete plantillas y sus listas permanecen intactas.

Fuentes: [DJI RS 4 / RS 4 Pro](https://dl.djicdn.com/downloads/DJI_RS_4_Pro/UM/DJI_RS_4_User_Manual__v1.0__EN.pdf), [3026B](https://static.smallrig.com/mall/img/public/m1twezvd88j-1751250182064_.pdf). La conservación del montaje lateral al girar la plataforma es una inferencia de interfaces documentadas, no compatibilidad física certificada. La alimentación, el pasador antitorsión, manos, rigidez y los bucles reales siguen por comprobar.

## Flujo

1. Define tu uso: nombre, contexto y encuadre, sin añadir piezas.
2. Elige piezas: catálogo abierto por defecto, tarjetas por categoría/búsqueda, función de cada elemento y referencia oficial.
3. Revisa tu rig: selección exacta, estados, causas y adición explícita de soportes disponibles. No se sugieren cadenas parciales excluidas por contexto.

La bandeja de Rig incluye todas las elecciones en su orden, aunque sean cables, aplicaciones o pendientes sin modelo. Una elección pendiente abre la ficha y no aparece flotando en el gimbal. Guardado local e historial no se cambian.

## Referencias visuales

Las fotos revisadas se muestran en la versión local. La pública enlaza al medio oficial revisado cuando es una fotografía identificada, a la referencia oficial cuando es un manual, o al producto cuando no hay referencia visual revisada. Una tabla eléctrica no se presenta como fotografía. Pictogramas propios de categoría están marcados como esquemas, no fotos ni geometría exacta de cada modelo. No satisfacen todavía el objetivo de fotografías reales incrustadas para cada producto público: permisos o fotografías propias siguen pendientes.

Se consultaron [condiciones SmallRig](https://www.smallrig.com/contentpage/terms.html) y [condiciones DJI](https://www.dji.com/terms?from=footer&site=pro); no se encontró autorización para redistribuir estos medios en Takegrid. No se sustituyen referencias del fabricante por fotografías generadas.

## Pruebas

88 pruebas automáticas: 55 planificador/persistencia, 26 evidencia/visibilidad y siete worker simulado; además de 300 selecciones y 300 guías reproducibles. Casos nuevos: vertical con monitor y sin fuente implícita, quitar NATO, selección completa sin geometría, recuentos que particionan las elecciones, sugerencias por contexto, montaje acumulativo, retorno a horizontal y recuperación del rig. `npm run build` y `npm run build:public` finalizados correctamente, incluidos TypeScript y validación. Salida pública: 12 archivos propios, 1,54 MB sin comprimir; referencias y capturas excluidas. Persiste la advertencia de paquetes grandes de Vite: no se afirma una mejora de FPS ni una comparación con dispositivos físicos.

La vista local anunció `http://127.0.0.1:5173/`; el navegador de prueba agotó el tiempo de conexión. No se registra como prueba visual local aprobada. La revisión interactiva se realizó sobre [Takegrid pública](https://takegrid.netlify.app/), versión 0.2.2, el 6 de octubre de 2026.

| Caso público | Resultado observado |
| --- | --- |
| Crear desde cero | Tres pasos, contexto/encuadre sin añadir productos; elección explícita de cada pieza. |
| Monitor sin soporte | Permanece elegido, abre su ficha y muestra el soporte faltante; no flota en el modelo. |
| Añadir soporte | El botón muestra 3026B y añade sólo esa elección solicitada. |
| Vertical con monitor | Con la cadena lateral seleccionada, aparecen Indie 7 y 3026B; no se añade V-mount ni energía ficticia. |
| Selección completa | Nueve elegidos: siete con modelo y dos cables en la lista; ninguno desaparece. |
| Guardar y volver | Confirmación local, recarga de la pestaña de prueba y apertura desde otra pestaña del mismo origen conservan las nueve elecciones. No demuestra sincronización entre dispositivos. |
| Montaje | Monitor en su etapa, HDMI y control en sus etapas; reproducción 2× termina en revisión final, sin extracción automática. |
| Conexiones | Tres enlaces aplicables: HDMI FX3/Indie 7, USB-C RS 4 Pro/FX3 y acople BG70/RS 4 Pro; alimentación del monitor pendiente. Extremos A/B visibles. |
| Mi equipo | Nueve elecciones; catálogo de 27 sólo al elegir su ámbito. |
| Reabrir editor | Vuelve a Elige piezas, catálogo accesible, búsqueda por Indie y filtro de categoría móvil funcionales. |
| Escritorio/móvil simulados | 1280×900, 390×844 y 320×780; sin desbordamiento horizontal del documento ni del editor. No son dispositivos físicos. |
| Navegación | Barra superior adhesiva en escritorio y barra inferior en móvil. Una captura de página completa con desplazamiento produjo un artefacto; la posición real se comprobó en DOM y captura de ventana, sin cambiar CSS innecesariamente. |
| Ayuda | Versión 0.2.2 y límites de prototipo visibles. Registro de consola consultado sin errores ni avisos durante la prueba. |

Perfil de prueba separado: `Vertical / monitor lateral`. Elecciones exactas, en orden: `sony-fx3`, `sony-fe-16-35-gm`, `smallrig-4770`, `dji-rs4-pro-combo`, `dji-rs-bg70`, `smallhd-indie-7`, `smallrig-3026b`, `kondor-blue-hdmi-aa`, `dji-r-usbc-control`. No se sustituyen planes existentes. NP-FZ100 interna, energía del monitor y barrido vertical permanecen pendientes.

Commit funcional publicado: `1db1313b28028f22167734762844502cef6ffa0b`. Recursos de entrada comprobados: `/assets/index---Q5iE2Z.js` y `/assets/index-BvQsBlFb.css`; visor `/assets/RigViewer-BgQ1Dg_Y.js`. Ayuda, selección, recarga y montaje se comprobaron en ese despliegue, no únicamente con una compilación local.

Capturas propias de QA conservadas localmente, excluidas del despliegue: `public/previews/takegrid-creacion-022.png`, `public/previews/takegrid-creacion-movil-022.png` y `public/previews/takegrid-rig-vertical-022.png`. No contienen fotografías redistribuidas del fabricante ni constituyen mediciones mecánicas.

## Plan pendiente

La fase 1 continúa abierta hasta observar aceptación y medir dispositivos físicos. Fase 2: tres de diecisiete circuitos tienen revisión ampliada; quedan demás interfaces y alta completa. Lote de diez productos en cuarentena, sin activar. Cuentas/nube aplazadas por el usuario. Protocolos de beta y financiación preparados, sin participantes, ensayos o presupuesto cotizado inventados. No declarar todas las fases completas por una compilación.

`node scripts/check-beta-readiness.mjs --strict` devuelve código 1 deliberadamente: cero participantes observados, sin tasa calculable de finalización, dispositivos físicos y ensayos pendientes; lote no liberado, privacidad, soporte y presupuesto/elegibilidad sin evidencia suficiente. No es un fallo de compilación: impide confundir una demo pública con una beta profesional lista para financiación.
