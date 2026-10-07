# Lote piloto de catálogo

Fuente canónica de investigación: `data/catalog-intake.json`. Revisión 2026-10-07. **Diez candidatos; ninguno activado.** No se incluyen imágenes sin permiso ni formas heredadas.

## Manifiesto inicial

| Producto | Modelo | Masa publicada (g) | Cotas publicadas (mm) | Fuente |
|---|---|---:|---|---|
| Sony FE 16-35mm F2.8 GM II | SEL1635GM2 | 547 | D 87.8 × L 111.5 | [Sony](https://www.sony.co.uk/electronics/support/lenses-e-mount-lenses/sel1635gm2/specifications) |
| Sony FE 24-70mm F2.8 GM II | SEL2470GM2 | 695 | D 87.8 × L 119.9 | [Sony](https://www.sony.com/electronics/support/lenses-e-mount-lenses/sel2470gm2/specifications) |
| Sony FE 24-105mm F4 G OSS | SEL24105G | 663 | D 83.4 × L 113.3 | [Sony](https://www.sony.co.uk/electronics/interchangeable-lenses/sel24105g/specifications) |
| Sony FE 35mm F1.8 | SEL35F18F | 280 | D 65.6 × L 73 | [Sony](https://www.sony.com/electronics/support/lenses-e-mount-lenses/sel35f18f/specifications) |
| Sony FE 20mm F1.8 G | SEL20F18G | ~ 373 | D 73.5 × L 84.7 | [Sony](https://www.sony.com/electronics/support/lenses-e-mount-lenses/sel20f18g/specifications) |
| Sony FE 24mm F1.4 GM | SEL24F14GM | 445 | D 75.4 × L 92.4 | [Sony](https://www.sony.com/electronics/support/lenses-e-mount-lenses/sel24f14gm/specifications) |
| Sony FE 50mm F1.4 GM | SEL50F14GM | 516 | D 80.6 × L 96 | [Sony](https://www.sony.com/electronics/support/lenses-e-mount-lenses/sel50f14gm/specifications) |
| Sony FE 85mm F1.8 | SEL85F18 | 371 | D 78 × L 82 | [Sony](https://www.sony.com/electronics/support/lenses-e-mount-lenses/sel85f18/specifications) |
| Sony FX30 | ILME-FX30 | ~ 562 | ~ W 129.7 × H 77.8 × D 84.5 | [Sony](https://www.sony.com/electronics/support/camcorders-and-video-cameras-interchangeable-lens-camcorders/ilme-fx30/specifications) |
| Sony NP-FZ100 Rechargeable Battery Pack | NP-FZ100 | ~ 83 | ~ W 38.7 × H 22.7 × D 51.7 | [Sony](https://www.sony.co.uk/electronics/interchangeable-lens-cameras-batteries-chargers/np-fz100) |

## Límites y liberación

- No se hereda la forma del SEL1635GM original a un objetivo distinto
- Las cotas D × L no incluyen una trayectoria de zoom ni parasol medido
- Montura Sony E no demuestra holgura con jaula, gimbal o matte box
- Material exacto pendiente; no se asigna un compuesto por apariencia
- Fotografías consultables en su fuente; sin permiso de redistribución verificado

1. Fuentes por campo y revisión exacta.
2. Compatibilidad de cámara y objetivo con limitaciones de firmware.
3. Cadena de soporte y sujeción.
4. Puertos, tensión, polaridad y señal.
5. Guía aplicable sin piezas implícitas.
6. Geometría aproximada atribuida o CAD con licencia y escala.
7. Regresiones y ensayo físico antes de afirmar validación.

## Conjuntos candidatos

- `fx3-light-prime`: sony-fx3, smallrig-4770, sony-fe-35-f18, sony-np-fz100. Priorizar un núcleo compacto sin monitor ni V-mount. Verificar tablas Sony, alojamiento de batería, jaula y guía antes de activar.
- `fx30-handheld-prime`: sony-fx30, smallrig-4770, sony-fe-20-f18-g, sony-np-fz100. Segundo cuerpo candidato. 4770 menciona FX3/FX30, pero no se copia el rig de FX3 ni su control, señales o masa.

FX30/SEL20F18G: [ficha técnica del conjunto](catalog-pilot-blueprint.md) con pares oficiales, distribución relacional, alimentación nativa y cinco etapas documentales. Geometría e integración pendientes; los demás conjuntos no reciben esa verificación por analogía. Este lote no modifica las 30 entradas del catálogo actual.
