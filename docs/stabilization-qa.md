# Estabilización: selección y montaje

Revisión: 5 de octubre de 2026. Fase 1, correcciones funcionales verificadas; medición sostenida y aceptación con usuarios pendientes. No se amplió el catálogo ni se modificaron cotas, pesos, puertos, soportes o trayectorias mecánicas.

## Evidencia de software

| Caso | Resultado observado |
| --- | --- |
| Crear cámara, óptica, jaula y VB99 Pro sin soporte | Mi equipo: cuatro elecciones; tres activas y batería pendiente. No muestra el catálogo completo. |
| Buscar Indie en esa selección | Cero coincidencias; no mezcla equipos ajenos. Catálogo explícito: 27 entradas. |
| Montaje del núcleo mínimo | Etapas canónicas 1, 2, 11 y 12; sin monitor, varillas ni batería instalada ficticia. |
| Reproducir a 2×, pausar y continuar | Avanza por la guía relevante y termina en revisión final; no marca lectura ni extrae el rig automáticamente. |
| Reinicio y teclado del deslizador | Regreso al núcleo y avance manual coherente. |
| Guardar y recargar | Las cuatro elecciones, incluida la batería pendiente, se recuperan dentro de la app. |
| Siete plantillas | Documental, Comercial y Cine: 12 etapas y extracción opcional. A mano y Entrevista: cuatro. Esencial y Vertical: siete y extracción opcional. |
| Quitar 1674 de una copia Comercial | Conserva 16 elecciones. Varillas, placa, batería, dummy y cable de energía del monitor quedan pendientes; no hay etapas 3 ni 5 de instalación. Montaje vuelve al núcleo. |
| Soporte lateral, etapa 6 | Gimbal y BG70 son contexto translúcido; no indican acople de cámara. |
| Alimentación, etapa 11 | Seleccionar VB99 Pro a FX3 resalta la conexión y etiquetas de extremos A/B. Los anclajes y bucles siguen siendo aproximados. |
| Reproducción desde alimentación en Comercial | Se detiene en etapa 12, con extracción opcional sin activar. |
| 320×740 y 390×844 | Sin desbordamiento del documento respecto al ancho útil. Controles principales de reproducción de 44 px. |
| Consola de la pestaña local de prueba | Sin errores ni advertencias capturados en la sesión observada. |

Pruebas realizadas en pestañas separadas; no se editaron ni recargaron borradores del usuario en la web pública. Los registros de QA locales no se incorporan al catálogo ni al despliegue.

## Compilación y regresiones

- `npm run test:planner`: 29 pruebas, 300 selecciones y 300 guías reproducibles.
- `npm run build`: validación, TypeScript y compilación local correctos.
- `npm run build:public`: mismos controles y auditoría de recursos correctos. Ocho archivos propios, aproximadamente 1,43 MB sin compresión.
- No incluye fotografías, manuales, capturas de investigación ni credenciales. En montaje público no hay imágenes de `/references/`.
- Advertencia vigente: módulo 3D diferido de aproximadamente 926 kB, 252 kB comprimido. No se ocultó la advertencia ni se cambió el umbral para aparentar optimización.

## Medición limitada

Navegador integrado de Codex, Windows, vista de escritorio. Versión exacta del motor y hardware GPU no registrados; no es un dispositivo de referencia certificado. Compilación pública local, perfil Comercial guardado de una prueba anterior, sin modificar sus elecciones.

| Muestra | Preparación hasta dos fotogramas de escena |
| --- | --- |
| Entrada inicial a montaje, etapa 1 | 2080 ms |
| Cambio manual a etapa 2 | 43 ms |
| Cambio manual a etapa 6 | 286 ms |

El reloj empieza al activar el montaje o cambiar de etapa, no mientras el panel está oculto. Son muestras únicas de preparación, incluyen trabajo de React/visor y pueden incluir carga diferida. No representan finalización GPU, FPS, latencia táctil, consumo energético ni percentiles. No existe medición anterior equivalente para afirmar un porcentaje de mejora.

Se eliminaron asignaciones de vectores por fotograma y el renderizado continuo en reposo. Se estabilizó el encuadre con el conjunto completo y se espera la preparación antes de temporizar. Esas son correcciones comprobables de implementación, no una promesa de fluidez universal.

## Pendientes para cerrar la fase

1. Medir fotogramas y latencia de interacción durante órbita y reproducción en dispositivos físicos de referencia, con repeticiones y estados de carga documentados.
2. Comparar con una versión anterior bajo condiciones iguales y fijar objetivos de rendimiento sustentados.
3. Recorrer el flujo con usuarios 1AC y solo filmmakers y registrar errores sin asistencia.

No se declara cerrada toda la fase 1 ni se inicia la expansión del catálogo. Los ensayos de software no validan holguras, equilibrio, regulación, polaridad ni montaje físico.
