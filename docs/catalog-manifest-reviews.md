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
| `dimensions`, `weight_g`, `additional_mass`, `interfaces.0`, `interfaces.1`, `interfaces.2`, `native_battery_model`, `sensor_mm` | [Sony](https://www.sony.jp/pro-cam/products/ILME-FX30/spec.html): 質量 / 外形寸法 / インターフェース / 電源 / 撮像素子: cuerpo solo 562 g; HDMI Type A x1; sensor APS-C 23.3 x 15.5 mm | Página oficial consultada |

Pendiente:

- Coordenadas de roscas, salientes y holguras medidas; rosca inferior identificada por Sony
- Firmware del ejemplar registrado: la tabla Sony no fija una versión para SEL20F18G
- Materiales y poses de conjunto pendientes; malla propia aproximada revisada sólo para inspección aislada
- Ensamblaje físico del piloto y regresiones de interfaz pendientes; ficha relacional y guía documental en catalog-pilot.json

## Sony FE 20mm F1.8 G

Revisión: 2026-10-07.

| Campos en investigación | Fuente y localizador | Método |
|---|---|---|
| `dimensions`, `weight_g`, `mount`, `filter_diameter_mm` | [Sony](https://www.sony.com/electronics/support/lenses-e-mount-lenses/sel20f18g/specifications): Size & Weight; Mount; Filter Diameter (mm) | Página oficial consultada |
| `dimensions`, `weight_g`, `weight_approximate`, `mount`, `filter_diameter_mm` | [Sony](https://www.sony.jp/ichigan/products/SEL20F18G/): 主な仕様: montura E, D 73.5 x L 84.7 mm, masa 約 373 g, filtro 67 mm | Página oficial revisada en navegador |

Pendiente:

- Parasol, salientes y holguras de jaula sin medición
- Malla propia revisada para inspección aislada sin heredar SEL1635GM; pose de conjunto pendiente
- Firmware del ejemplar y pruebas del conjunto; par exacto ya documentado por Sony

## Sony NP-FZ100 Rechargeable Battery Pack

Revisión: 2026-10-07.

| Campos en investigación | Fuente y localizador | Método |
|---|---|---|
| `dimensions`, `weight_g`, `nominal_voltage_v`, `energy_wh` | [Sony](https://www.sony.com/en-cm/electronics/interchangeable-lens-cameras-batteries-chargers/np-fz100): Specifications: dimensions, weight, capacity | Texto oficial indexado; acceso directo falló en esa revisión |
| `nominal_voltage_v` | [Sony](https://helpguide.sony.net/ilc/2220/v1/en/print.pdf): Página 526 (índice PDF 525), NP-FZ100 / Rated voltage | Sección textual del PDF oficial; no medición de figura |
| `dimensions`, `weight_g`, `nominal_voltage_v`, `energy_wh` | [Sony](https://electronics.sony.com/imaging/imaging-accessories/interchangeable-lens-camera-accessories/p/npfz100?sku=npfz100): About This Item: dimensiones y masa aproximadas; 7.2 V / 16.4 Wh / 2280 mAh | Página oficial consultada |

Pendiente:

- Pinout y rango de descarga no publicados en las fuentes revisadas; tensión nominal no es rango
- Puerta y retención con la jaula en el ejemplar real
- No se incluye cargador ni se afirma autonomía; la guía documental usa batería previamente cargada

## Límites

No se copian puertos, mallas ni poses de FX3. El par exacto FX30/SEL20F18G tiene [confirmación Sony](https://support.d-imaging.sony.co.jp/www/cscs/lens_body/detail.php?area=jp&lang=es&prdct_name=ILME-FX30&rel_prdct_name=SEL20F18G); la tabla no especifica firmware ni certifica holguras. NP-FZ100 es batería nativa de FX30 documentada; tensión nominal no equivale a rango completo ni pinout. Las diferencias ILME-FX30 / ILME-FX30B de contenido incluido se conservan sin añadir piezas al usuario. La [ficha del conjunto](catalog-pilot-blueprint.md) define distribución relacional, alimentación y guía documental. El catálogo instalable mantiene 30 entradas.
