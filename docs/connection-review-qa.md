# Verificación de conexiones 0.2.1

## Alcance

Tres revisiones documentales iniciales, sin piezas nuevas: RS 4 Pro -> FX3 por control USB-C, VB99 Pro -> 4253B y 3203B -> Indie 7. Se conservan 27 piezas, 17 circuitos, 13 etapas, siete plantillas y cuatro tareas. Catálogo y biblioteca mantienen su revisión; no se migran ni añaden elecciones.

Primero se actualizaron fuentes y campos canónicos; después guía, motor e interfaz. No se cambiaron poses ni geometría, que siguen aproximadas. La revisión no equivale a una cadena físicamente probada.

## Pruebas de software

- 46 pruebas de planificador/persistencia y 300 selecciones + 300 guías reproducibles.
- 21 pruebas de evidencia: modelos/nombres exactos, puertos, conectores, fuente con alcance, catálogo, firmware, valores ausentes, rangos completos, polaridad, entrada/salida y ausencia de mutaciones.
- Siete pruebas simuladas del worker; no certifican desconexión o instalación en un dispositivo físico.
- Compilaciones local y pública comprobadas. TypeScript y validación de manifiestos incluidos.
- Paquete público sin medios de fabricantes, capturas de investigación ni credenciales. El bloque 3D de aproximadamente 928 kB sin comprimir conserva la advertencia de tamaño; no se atribuye una mejora de GPU a este cambio.

## Verificación de interfaz

La vista previa local anunció 127.0.0.1:4174, pero el navegador de comprobación agotó el tiempo de conexión. Esto no se registra como prueba visual aprobada. Revisión de la interfaz pública de esta versión pendiente de completar tras el despliegue.

## Límites

Cuatro datos documentados y siete comprobaciones pendientes en las tres revisiones iniciales. Los otros catorce circuitos muestran revisión ampliada pendiente. No se transforma una tensión nominal en rango ni el centro positivo del cable en pinout del monitor. La matriz DJI publicada identifica FX3 V1.00, no el firmware instalado del usuario.

El motor muestra incompatibilidad de rango/polaridad cuando hay datos documentados contradictorios; no elimina automáticamente piezas ni circuitos del plan. Las pruebas con valores sintéticos nunca alimentan el catálogo. La autenticación del contenido de fuentes y los ensayos reales siguen siendo revisión técnica humana.

Corrección documental del 6 de octubre de 2026: la página 4 del manual 3203B identifica entrada D-Tap 11.0-16.8 V y 14.8 V en capacidad nominal de batería. Se retiró la atribución de 14.8 V a la salida de la placa; no se sustituye por un rango de salida inferido. La biblioteca mantiene su revisión y no pierde selecciones.

La fase de ingeniería extensible continúa abierta: ampliar las revisiones de interfaces, cadenas mecánicas y alta completa, antes de liberar el lote de catálogo. Cuentas y nube siguen aplazadas por decisión del usuario. No se ha reclutado una beta ni generado evidencia de usuarios.
