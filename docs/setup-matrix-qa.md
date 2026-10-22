# Matriz de conjuntos 0.2.22

Generado desde data/setup-verification.json. Estado: verified_software_only. Cobertura finita de software; no todas las 2^39 selecciones ni ensayos físicos.

21 comprobaciones; 8507 casos y 1296 propuestas explícitas conservan elecciones. 39 piezas, 14 circuitos candidatos con escenarios positivos y 8 de banco/condicionales sin activar. Huella de entradas: 28b97399bee711ead909b93e74a7376fd519f2662a64c06102b676f975edc93a.

## Cobertura

Cada producto solo y cada pareja en cuatro contextos y dos orientaciones; siete plantillas y ejemplos declarados, omitiendo cada miembro; 2048 subselecciones reproducibles. Se comprueban soportes, propiedad/ocupación de puertos por unidad, fuente de cable, montaje acumulativo, cobertura de circuitos y poses ensambladas/despiece finitas. No se exploran todas las combinaciones.

| Plantilla | Elegidas | Necesidades detectadas | Etapas derivadas |
| --- | --- | --- | --- |
| documentary-one-man-film | 19 | 0 | 13 |
| commercial-solo-gimbal | 17 | 0 | 13 |
| handheld-quick-release | 7 | 1 | 4 |
| lower-budget-stripped-down | 9 | 1 | 8 |
| vertical-916-creator-mode | 8 | 1 | 8 |
| corporate-interview | 6 | 1 | 4 |
| cinema-narrative | 18 | 0 | 13 |

Las plantillas no se modifican para ocultar faltantes. Una necesidad detectada no equivale a fallo de software: señala una elección que el usuario debe completar o una cadena aún no revisada. Revisión documental de los 22 circuitos con pruebas previas por modelo/puerto, no conexión real.

## Corrección detectada

La guía FX30 mostraba HDMI sin introducir la referencia de cable en su etapa. El frame 8 ahora declara Kondor Blue y el motor exige fuente y ambos extremos antes de mostrar un circuito. Auditoría incluye prueba negativa de esta omisión, puerto de otro modelo, revisión bloqueada y envolvente inválida.

## Reproducir

Ejecutar npm run test:planner y npm run build:public. La matriz se ejecuta con node --no-opt: el runtime local Node 24.19 produjo un fallo nativo del optimizador en una primera ejecución del bucle; no se modifica el navegador ni se usa la prueba como medición de rendimiento. Regenerar evidencia sólo tras revisar diferencias: node --no-opt scripts/test-setup-matrix.mjs --write.

- Sin teléfono o rig físico
- Sin encaje, retención, equilibrio, carga, señal o autonomía medidos
- Matrices de casos no prueban compatibilidad universal
- Placas y tornillos incluidos no son otras unidades de catálogo

Interfaz y publicación se documentan aparte en [cierre 0.2.21](continuation-0221.md).
