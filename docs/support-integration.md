# Agarres y primer rig al hombro

Bloque 0.2.18, 18 de octubre de 2026. Dos altas aditivas candidatas, no ensayo físico. Conserva los siete perfiles originales, bibliotecas, unidades y guardado local. Autoridades: partes, distribución, reglas, guía y cables; `support-integration.json` registra el alcance, no sustituye sus especificaciones.

## 1. Manifiesto

| Pieza | Cota publicada | Masa nominal | Planificación | Fuente |
|---|---|---|---|---|
| SmallRig 4346 | 68.5 ×80 ×105 mm | 208 ±5 g | 213 g | [Manual, pp. 3–5](https://static.smallrig.com/mall/img/public/6hzivt5lbfr-1751252249527_.pdf) |
| SmallRig 2896C | 510 ×300 ×180 mm | 1260 ±5 g | 1265 g | [Manual, pp. 2–6](https://static.smallrig.com/mall/img/public/1718071886940_.pdf) |

4346 incluye su adaptador. 2896C incluye placa/base, apoyo, conector, dos agarres, dos barras longitudinales de 400 mm, una transversal de 300 mm, dos tapones, tornillos y llaves. La cámara y jaula no están incluidas. No añadir 1674 ni varillas de ocho pulgadas a esta cadena ni duplicar masas del kit. Herramienta plana para el tornillo de placa aportada por usuario.

## 2. Distribución

- 4346: localización lateral 1/4-20 documentada en 4770, no NATO ni ARRI 3/8 lateral. Candidata a mano/estática horizontal; FX30 sólo a mano. Pose lateral única aproximada; comprobar pines, profundidad, apriete, pantalla, puertos y mano. No habilita giro ni recorrido vertical libre.
- 2896C: placa debajo de jaula, barras hacia delante/atrás, apoyo atrás y agarres delante. Primer alcance horizontal FX3/16-35 GM/4770/NP-FZ100. El monitor opcional usa NATO 4770/2906B, no brazo de gimbal. RX ocupa zapata de jaula separada.
- La pareja jaula/accesorio es inferencia de interfaces con citas separadas de cada miembro, no una certificación de pareja del fabricante.
- No se da por verificada separación LWS, altura de eje, longitud de tornillo, postura, centro de gravedad, línea de visión o retención. Si monitor o agarre interfiere con rostro, mano, pantalla o cables, no usar esa pose. No se corrige añadiendo una extensión invisible.
- Rechazados en el alcance de hombro: base corta adicional, V-mount, XLR, gimbal, otras ópticas/cuerpos y extracción en un clic. Las elecciones ajenas permanecen pendientes, no se borran.

## 3. Cables Y Alimentación

No se crean conectores o circuitos del kit. FX3/NP-FZ100 usa contactos internos. Monitor elegido usa HDMI A desde la única salida FX3 y NP-F970/PRO en su placa serie L; no barril DC. RX usa OUT TRS a MIC FX3, no INPUT3 de un asa ausente. Conserva identidad de unidad, revisión de circuito y puertos actuales.

El tendido es esquemático y aproximado. Medir holgura local y mantenerlo fuera de cara, manos, abrazaderas y pantallas. No certificar longitud por la curva del visor. Sin monitor o RX elegidos, sus circuitos y etapas no aparecen.

## 4. Guía

Al hombro tiene perfil propio de hasta diez etapas: núcleo, jaula, kit completo, monitor, batería de monitor, RX, HDMI, audio, ajuste/comprobación y retirada opcional. No hereda balance de motores o extracción de gimbal. Las etapas de accesorios no elegidos se omiten.

Montar con el conjunto apoyado. Instalar accesorios en barras antes de cerrar extremos; verificar cada abrazadera, tornillo y tapón. Para retirar cámara, apoyar, apagar, liberar cables que impidan retirada y desatornillar sujetando cámara/jaula. No es liberación rápida. La animación agrupa el kit; no simula orden de apriete ni trayectorias físicas de sus subpiezas.

## 5. Visor E Interfaz

Dos mallas y miniaturas propias aproximadas cotejadas en cinco vistas contra los manuales. Sin imágenes o CAD ajenos, sin IA ni permisos de fabricante inventados. 4346: envolvente visual aproximada 80 ×105.10 ×68.50 mm. 2896C: 300 ×180.05 ×498 mm, frente a 510 mm longitudinales publicados; diferencia de 12 mm conservada explícitamente, no ocultada con escala no uniforme.

Elegir «Al hombro» en Montaje del rig. Una propuesta enumera las piezas faltantes del núcleo y sólo las incorpora al pulsar «Elegir estas piezas». No sustituye elecciones en conflicto. 4346 está en Jaulas y accesorios; 2896C en Soportes y estabilización. Desde la jaula también se ofrecen cadenas compatibles con el alcance. Kit, agarre, monitor y RX se pueden seleccionar en 3D.

Presupuesto público ampliado explícitamente de 7.5 a 8 MB por estas dos mallas, no por mejora de FPS. Mantiene auditoría de recursos propios, carga bajo demanda y sin recargas forzadas.

## 6. Variantes Y Verificación

Tres ejemplos reutilizables en `support-integration.json`: FX3 a mano con empuñadura/monitor/audio, FX30 a mano con empuñadura y FX3 al hombro con monitor/audio. No añaden plantillas ni modifican rigs guardados. Cuatro candidatos de apoyo restantes permanecen en investigación.

`test-support-integration.mjs`: 20 comprobaciones, incluidas 1024 subselecciones del rig al hombro. Validan selección explícita, exclusiones, guía, reproducción, circuitos, masa del kit una vez y recuperación local. No son montajes físicos ni usuarios observados.

Revisión local de la compilación pública: creación desde cero, propuesta de cinco piezas sin adición previa, diez elecciones con monitor/RX visibles y cuatro circuitos correctos; guardado y recarga conservan las diez. Reproducción a 2× llega a etapa 9/9 y deja retirada fuera como opcional. Sin monitor, los controles de software omiten sus etapas y cables. En móvil 390 ×844, editor y página de 390 px sin desbordamiento horizontal; 4346 sola permanece pendiente, ofrece dos soportes identificados y, tras confirmación, aparece con su núcleo de cinco elecciones. Ningún error de consola observado en ese recorrido. Capturas privadas en `research/model-incoming/support-0218/`.

Se corrigió el cambio normal de tarea en escritorio para volver al inicio del panel, y se protege el foco de montaje cuando queda oculto. Una tecla PageDown seguida inmediatamente por cambio de tarea puede terminar su desplazamiento nativo después de la navegación en la prueba sintética; no se afirma cancelación de todas las animaciones del navegador ni prueba en teléfono real. La compilación pública completa y la auditoría pasaron; se mantienen advertencias de módulos grandes, sin afirmar una mejora medida de FPS. Publicación se confirma por separado en [alojamiento](additional-hosting.md).

El plan completo sigue pendiente de soporte estático completo, otras cadenas, duplicados instalados por asiento, dispositivos de referencia, ensayos físicos, usuarios observados, soporte/privacidad y preparación de financiación. No hay beta profesional certificada.
