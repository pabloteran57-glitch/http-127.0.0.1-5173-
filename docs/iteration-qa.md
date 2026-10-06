# Verificación de la iteración 0.2.0

Fecha: 2026-10-05. Compilación pública local; perfiles QA independientes. No se modificaron los tres planes previos del navegador ni las pestañas públicas originales. El catálogo activo, las poses y los conectores no cambiaron.

## Software

- Reglas de selección y exclusión de cableado trasladadas a datos; regresiones de las siete plantillas, 300 selecciones y 300 guías.
- 46 pruebas de planificador/persistencia/medición y siete del worker con caché/red simuladas. No equivalen a ensayos físicos ni usuarios observados. La limpieza después de guardar conserva un borrador modificado durante el guardado asíncrono.
- Historial y biblioteca se escriben juntos, con límite de cinco versiones. Datos corruptos, cuota, identificación cruzada y guardado obsoleto se rechazan.
- Biblioteca v2 separada de la v1 histórica; prueba de conservación de elecciones y archivo anterior. El navegador real cargó los tres planes previos sin modificarlos.
- Diez registros investigados aislados del catálogo; se validan identidad y algunas cotas/masas oficiales, no una cadena de montaje liberada.

## Navegador local

IAB sobre Windows; Chromium subyacente, versión exacta, GPU y hardware no identificados. No es un dispositivo de referencia aprobado.

1. Crear QA compacto desde cero, a mano: FX3, SEL1635GM, 4770 y VB99 Pro. Mi equipo contiene exactamente cuatro; batería pendiente, sólo tres geometrías.
2. Guardar, quitar VB99 Pro y renombrar: tres piezas. Mis rigs muestra la versión anterior de cuatro elementos en el historial.
3. Segunda pestaña con instantánea anterior: el guardado se rechaza; mantiene selección de cuatro. Revisar cambios abre versión confirmada de tres y conserva borrador de cuatro como copia.
4. Reapertura de la primera pestaña conserva tres elecciones y guía pertinente de cuatro etapas (referencias 1, 2, 11, 12).
5. Pestaña nueva encuentra dos borradores de la sesión de conflicto. Recuperar como copia abre cuatro elecciones, mantiene VB99 pendiente y conserva el original.
6. Ayuda abre correctamente; preparación sin conexión confirma recursos propios. No hubo recarga forzada. Desconexión física e instalación móvil aún pendientes.
7. Montaje del perfil de tres piezas: reproducción 2× termina en 4/4, revisión final, sin incorporar accesorios excluidos ni marcar verificaciones físicas.
8. Anchos de 390 y 320 px: biblioteca y recuperación sin desbordamiento horizontal del documento. En 320 px el ancho útil es 305 px por la barra de desplazamiento. Revisión visual de ayuda y biblioteca; no equivale a ensayo en teléfono físico.
9. Registros de consola de las cinco pestañas de prueba (núcleo, conflicto, recuperación, laboratorio y móvil): sin errores ni advertencias capturados. No es una garantía frente a otras GPUs o navegadores.

## Mediciones

Laboratorio de la misma versión, Comercial, 1265 × 720, DPR 1. Una muestra por condición; faltan tres repeticiones por condición y comparación en dispositivos de referencia.

| Actividad | Política | Duración (ms) | Callbacks | Mediana (ms) | p95 (ms) | Intervalos >33 ms |
|---|---|---:|---:|---:|---:|---:|
| Reposo | Bajo demanda | 8004 | 2 | 13.5 | 13.5 | 0 |
| Reposo | Continuo | 8013 | 481 | 16.7 | 17.9 | 0 |
| Órbita de vista | Bajo demanda | 8012 | 481 | 16.7 | 17.4 | 0 |
| Órbita de vista | Continuo | 8016 | 481 | 16.7 | 17.2 | 0 |

Los intervalos miden llamadas JavaScript de R3F, no tiempos GPU ni FPS presentados. El reposo bajo demanda deja de solicitar renders; dos llamadas no permiten caracterizar fluidez. Una muestra tampoco caracteriza consumo ni seguridad mecánica. La órbita mueve la cámara del visor, no el rig real. No se afirma porcentaje de mejora contra una versión anterior.

## Pendientes de liberación

La cohorte real, dispositivos de referencia, ensayos de rig, tablas del lote, derechos de representación, privacidad jurídica, canal/responsable de soporte y presupuesto siguen pendientes. Cuentas y nube aplazadas por el usuario. `check:beta` debe informar esas carencias, no aprobar por registros vacíos.

La compilación conserva el aviso de tamaño del módulo 3D. No se oculta elevando artificialmente el umbral de Vite.

Compilaciones local y pública correctas: 53 pruebas automatizadas y 600 casos reproducibles. La pública contiene 12 archivos propios, aproximadamente 1.45 MB sin comprimir; no redistribuye referencias. La comprobación estricta de preparación devuelve código 1 deliberadamente porque la beta y la financiación aún tienen puertas pendientes, incluidas privacidad y soporte.

## Publicación comprobada

[Takegrid](https://takegrid.netlify.app/) sirve la compilación 0.2.0 del commit funcional `9f5b0e539b759eca77c0dba0fd9fe9fb4f665795`. Se contrastaron los nombres de JS/CSS con el paquete local validado y el encabezado de versión en Ayuda. La consola de esa pestaña no registra errores ni advertencias. Captura de evidencia local: `public/previews/takegrid-02-publicado.jpg`; no forma parte del paquete público.
