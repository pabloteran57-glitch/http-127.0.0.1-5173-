# FX30: verificación de monitor y audio

Versión de trabajo: 0.2.12. Fecha de revisión: 7 de octubre de 2026, Ecuador. Fase 3 del plan; no libera beta.

## Orden Y Evidencia

1. Manifiesto: productos existentes con identidad propia; FX30, SmallRig 4770/2906B, Indie 7, NP-F970/PRO y RX DMR02. No se promociona otro producto por analogía.
2. Distribución: riel NATO y zapata de 4770 documentados para FX30; 2906B en NATO y monitor en rosca inferior. Sin brazo de gimbal ni asa XLR implícita. Diagramas locales SmallRig revisados; retención, ventilación, manos y asiento reales pendientes.
3. Conexiones: `vid-fx30-to-smallhd` y `audio-rx-to-fx30` tienen modelos, puertos y comprobaciones propias. Guías Sony, DJI y SmallHD contrastadas; anclajes HDMI/MIC ilustrativos aproximados. No se presume formato recibido, nivel de audio o firmware por identidad de conector.
4. Guía: cinco etapas del núcleo; ocho con monitor; diez con monitor y RX. Bloques y curvas sólo aparecen tras introducir piezas seleccionadas. El soporte solo no enseña una pantalla ajena.
5. Interfaz: completado propone 2906B/HDMI/serie L, no RS 4 Pro. Añadir desde jaula es una acción explícita. Guardado, historial y poses mantienen lista exacta; cambio de contexto conserva pendientes. Textos de cableado y límites no describen piezas ajenas.
6. Ejemplos: esencial, monitor NATO y documental con RX en `data/fx30-accessories-review.json`; no se alteran las siete plantillas ni rigs guardados.

## Regresiones

`scripts/test-fx30-accessories.mjs`: 26 comprobaciones, incluidas 512 subselecciones de las nueve piezas. Revisan extremos, pasos, ausencia de piezas implícitas, soporte retirado, contactos, articulación, evidencia exacta, biblioteca e historial. Regresiones anteriores conservadas y actualizadas sólo al ampliar explícitamente el alcance FX30.

Subtotal ilustrativo completo: 2376 g de piezas móviles modeladas, con sólo 28 g del RX y masas conservadoras canónicas. No incluye HDMI/TRS, tarjeta, tornillos adicionales ni diferencias de kit retirado. No es peso medido, CG, holgura ni seguridad dinámica.

Compilación pública completada: `npm run build:public`, 329 comprobaciones (170 de planificación, 58 de modelos y 101 de catálogo), TypeScript y Vite correctos. Publicación permitida: 56 archivos, aproximadamente 6,34 MB. La advertencia de tamaño de los dos paquetes grandes de JavaScript sigue presente; no es una medición de fluidez.

## Recorrido De Interfaz

Prueba local en Edge sobre `http://127.0.0.1:4174/`, compilación pública 0.2.12:

- Crear desde cero y escoger cuatro piezas del núcleo: lista exacta y cinco etapas pertinentes.
- Seleccionar HawkLock y añadir explícitamente monitor, 2906B, HDMI y NP-F970/PRO; añadir RX por separado. Nueve elecciones, sin gimbal ni asa XLR añadidos.
- Conexiones: cuatro enlaces, HDMI FX30 a Indie 7 y TRS Mic 2 a MIC FX30 seleccionables y resaltados; contactos de ambas baterías sin cable ficticio.
- Guardar `QA 0.2.12 · FX30 monitor y audio`, ajustar inclinación a 2° y giro a 1°, guardar y recargar: nueve elecciones y ambos ajustes recuperados.
- Reproducir las diez etapas, llegar al final, reiniciar y pausar. La reproducción no marca comprobaciones físicas como realizadas.
- Retirar sólo 2906B: monitor, HDMI y NP-F970/PRO permanecen elegidos pendientes; RX sigue representado. Completar monitor añade sólo el soporte faltante y devuelve nueve elecciones.
- Viewport de 390 × 844: editor con selección directa y completado, selector móvil de circuito; ancho de documento y contenido coincidentes, sin desbordamiento horizontal observado. El viewport se restableció al finalizar. No es prueba en teléfono físico, táctil o de rendimiento GPU.

Capturas locales de evidencia en `research/model-incoming/qa-0212/`, excluidas de Git y de la web. Registro de consola de la pestaña consultado al terminar, sin errores o advertencias registrados en ese recorrido; no demuestra ausencia de fallos en otros dispositivos. Software no sustituye ensayo físico o aceptación observada.

## Pendientes Reales

Retención, batería, ventilación, tornillos, agarre, señal recibida, toma de audio, firmware y dispositivos reales. Piloto sólo a mano/horizontal; gimbal, vertical, asa XLR y fuentes externas requieren revisión propia. Siete candidatos aún en investigación. Cuentas/nube aplazadas. Beta cerrada/pública y financiación mantienen criterios externos.
