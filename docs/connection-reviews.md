# Revisión de conexiones

Fuente: `data/connection-reviews.json`, revisión `connection-review-2026-10-06-1`. Valores eléctricos canónicos en cables y puertos, con fuente por campo. 3 de 17 circuitos con revisión ampliada.

Revisión documental limitada a modelos, puertos y revisión vinculados. No es autorización para energizar ni ensayo físico. Fuentes de valores eléctricos en cables-manifest y ports-manifest; ausencia de rango, pinout o protocolo mantiene el resultado pendiente.

## Criterio de evaluación

- Identidad exacta: catálogo, producto, modelo, puertos, conectores, señal y revisión eléctrica deben coincidir. Un cambio invalida la evidencia anterior.
- Evidencia: fuente oficial vinculada a esos productos, URL conservada, afirmación y localizador. Una URL HTTPS aislada o la forma del conector no prueba protocolo.
- Alimentación: toda la salida debe estar contenida en la entrada. Solapamiento parcial bloquea; nominal o rango ausente siguen pendientes.
- Polaridad: ambos extremos deben estar documentados. Centro positivo del cable no verifica el pinout del monitor.
- Firmware, carga compartida, ajuste y holguras siguen requiriendo comprobaciones del equipo real. El motor documental no certifica un montaje.

## ctrl-rs4-to-fx3-usbc

Modelos vinculados: RS 4 Pro; FX3 / ILME-FX3; Control USB-C DJI. Puertos: `rs4-rss` -> `fx3-usbc`.

Antes de conectar: Comprueba los ajustes USB y prueba grabación y AF con el firmware instalado. La matriz DJI publicada indica FX3 V1.00; no implica que debas cambiar a esa versión.

- **Control para este par:** La matriz específica de DJI documenta grabación y AF por USB-C; no se deduce de la forma del conector.
- **Firmware y ajustes reales:** Comprobar la versión instalada y los ajustes de cámara; probar grabación y AF. No se ha ensayado tu equipo.
- **Movimiento y holgura:** Verificar bucle RSS-cámara en los ejes permitidos con motores apagados. Coordenadas y curva 3D aproximadas.

- [DJI](https://www.dji.com/global/support/compatibility/rs-4-pro/fx3): FX3 + DJI RS 4 Pro; columna USB-C; filas Start/Stop Recording Video, Trigger Auto Focus y Camera Firmware. DJI documenta grabación y AF por USB-C para este par, con FX3 V1.00 como firmware publicado en la matriz.

## pwr-vmount-to-fx3-dummy

Modelos vinculados: VB99 Pro / 4292; Adaptador NP-FZ100 / 4253B; FX3 / ILME-FX3. Puertos: `vb99-dtap` -> `fx3-battery`.

Antes de conectar: No conectes D-Tap directo a la FX3. Verifica la entrada y la salida del 4253B, la corriente disponible, el ajuste y la puerta antes de energizar.

- **Regulador 4253B:** Entrada 9.6-20 V / mínimo 2 A; salida 8.0-8.4 V / máximo continuo 2 A documentadas para 4253B.
- **Rango completo de la fuente:** La salida nominal de la batería no prueba su rango completo bajo carga. Falta confirmar que toda la salida queda dentro de 9.6-20 V.
- **Carga y ajuste del adaptador:** Confirmar corriente disponible con los demás accesorios, salida regulada, ajuste NP-FZ100 y salida de puerta sin pellizcar. No hay ensayo de carga del conjunto.

- [SmallRig](https://static.smallrig.com/mall/img/public/1706163303324_.pdf): Página 3, Specifications: D-Tap Input, Output Voltage y Output Current. 4253B: entrada 9.6-20 V con mínimo 2 A; salida 8.0-8.4 V con máximo continuo 2 A. El umbral de protección no es corriente continua admisible.
- [SmallRig](https://static.smallrig.com/mall/img/public/1730100759046_.pdf): Página 14, Product Specifications (inglés); D-Tap Output y total Rated Discharging Power. La tabla publica salida nominal D-Tap 14.8 V y potencia total de 100 W. No se registra aquí un rango completo verificado bajo carga ni se reparte esa potencia entre accesorios.

## pwr-plate-to-smallhd

Modelos vinculados: Placa V-mount / 3203B; Indie 7 / MON-INDIE-7; D-Tap a DC SmallHD / CBL-PWR-DTAP-BAR-36. Puertos: `plate-dtap` -> `indie7-dc`.

Antes de conectar: Antes de energizar, confirma que el pinout de entrada del Indie 7 coincide con el centro positivo del cable, comprueba ajuste del barril y mide la salida de la placa bajo carga.

- **Entrada del Indie 7:** 10-34 V DC y 2 A de entrada publicados. Los 2 A no son una medición de consumo del rig.
- **Cable SmallHD exacto:** CBL-PWR-DTAP-BAR-36: exterior 5.5 mm y centro positivo documentados.
- **Coincidencia de polaridad:** El cable tiene centro positivo; falta confirmar el pinout de entrada del monitor. No asumir coincidencia.
- **Rango de la salida D-Tap:** El manual de la placa publica el rango de entrada D-Tap, no un rango completo de salida. Confirmar la salida efectiva de este conjunto bajo carga.
- **Ajuste y recorrido:** Diámetro interior, retención, carga compartida y bucles entre cámara móvil y monitor fijo pendientes de verificación física.

- [SmallHD](https://smallhd.com/products/dtap-barrel-36in): SKU CBL-PWR-DTAP-BAR-36; Tech Specs > Cable > Pinout; diámetro de producto 5.5 mm. Cable con centro positivo publicado y exterior de barril 5.5 mm. No establece el pinout de entrada del monitor ni el diámetro interior.
- [SmallHD](https://guide.smallhd.com/a/1634747-indie-7-quick-start-guide): Indie 7 Quick Start Guide > Connectors > I: Barrel connector for power. Entrada Indie 7 de 10-34 V DC y 2 A publicados; no se identifican diámetro interior ni pinout en esta guía.
- [SmallRig](https://static.smallrig.com/mall/img/public/1714289722871_.pdf): Página 4, Specifications: D-Tap Input Voltage y Battery Rated Capacity. La tabla publica entrada D-Tap de 11.0-16.8 V; 14.8 V aparece en capacidad nominal de batería, no como rango de salida D-Tap. La salida efectiva queda pendiente.


## Alcance pendiente

Los otros 14 circuitos conservan especificaciones y riesgos, pero no se califican como compatibles por defecto. Las revisiones no añaden piezas, no cambian las siete plantillas y no modifican las selecciones guardadas. Cadenas mecánicas universales, revisión del resto del catálogo y ensayos físicos siguen pendientes.
