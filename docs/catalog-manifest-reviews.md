# Revisiones del manifiesto piloto

Fuente: `data/catalog-intake.json`. Revisión 2026-10-07. 3 revisiones parciales, sin productos activados ni instrucciones físicas liberadas. Los otros candidatos conservan su fecha y alcance anteriores.

## Sony FX30

Revisión: 2026-10-07.

| Campos en investigación | Fuente y localizador | Método |
|---|---|---|
| `dimensions`, `weight_g`, `additional_mass`, `mount` | [Sony](https://www.sony.com/electronics/support/camcorders-and-video-cameras-interchangeable-lens-camcorders/ilme-fx30/specifications): Size & Weight; General / LENS MOUNT | Página oficial consultada |
| `interfaces` | [Sony](https://www.sony.com/electronics/support/camcorders-and-video-cameras-interchangeable-lens-camcorders/ilme-fx30/specifications): Interface / USB, HDMI OUTPUT, MULTI INTERFACE SHOE | Página oficial consultada |
| `interfaces.3`, `interfaces.4` | [Sony](https://helpguide.sony.net/ilc/2220/v1/en/print.pdf): Página 525 (índice PDF 524), especificaciones: micrófono y auriculares | Sección textual del PDF oficial; no medición de figura |
| `native_battery_model`, `bundled_handle` | [Sony](https://helpguide.sony.net/ilc/2220/v1/en/print.pdf): Página 19 (índice PDF 18), contenido y tabla ILME-FX30 / ILME-FX30B | Sección textual del PDF oficial; no medición de figura |

Pendiente:

- Posiciones, roscas y salientes medidos
- Compatibilidad SEL20F18G por función y firmware
- Distribución propia y masa sin duplicar batería
- Materiales y geometría autorizada
- Guía, circuitos y ensayos físicos

## Sony FE 20mm F1.8 G

Revisión: 2026-10-07.

| Campos en investigación | Fuente y localizador | Método |
|---|---|---|
| `dimensions`, `weight_g`, `mount`, `filter_diameter_mm` | [Sony](https://www.sony.com/electronics/support/lenses-e-mount-lenses/sel20f18g/specifications): Size & Weight; Mount; Filter Diameter (mm) | Página oficial consultada |

Pendiente:

- Tabla de compatibilidad exacta y limitaciones
- Parasol, salientes y holguras de jaula
- Montaje sin heredar geometría SEL1635GM
- Guía, derechos y pruebas del conjunto

## Sony NP-FZ100 Rechargeable Battery Pack

Revisión: 2026-10-07.

| Campos en investigación | Fuente y localizador | Método |
|---|---|---|
| `dimensions`, `weight_g`, `nominal_voltage_v`, `energy_wh` | [Sony](https://www.sony.com/en-cm/electronics/interchangeable-lens-cameras-batteries-chargers/np-fz100): Specifications: dimensions, weight, capacity | Texto oficial indexado; acceso directo falló y sigue pendiente |
| `nominal_voltage_v` | [Sony](https://helpguide.sony.net/ilc/2220/v1/en/print.pdf): Página 526 (índice PDF 525), NP-FZ100 / Rated voltage | Sección textual del PDF oficial; no medición de figura |

Pendiente:

- Confirmar ficha regional directa; acceso web intermitente
- Contactos y retención; tensión nominal no es rango
- Puerta y masa en el montaje específico
- Carga y guía sin piezas implícitas

## Límites

No se copian puertos, mallas ni poses de FX3. La montura declarada no prueba funciones, firmware o holgura con jaula. NP-FZ100 es batería nativa de FX30 documentada; tensión nominal no equivale a rango completo ni pinout. Las diferencias ILME-FX30 / ILME-FX30B de contenido incluido se conservan sin añadir piezas al usuario. El catálogo instalable mantiene 30 entradas.
