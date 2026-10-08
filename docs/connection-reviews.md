# Revisión de conexiones

Fuente: `data/connection-reviews.json`, revisión `connection-review-2026-10-07-2`. Valores eléctricos canónicos en cables y puertos, con fuente por campo. 6 de 20 circuitos con revisión ampliada.

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

Antes de conectar: Polaridad de entrada y cable documentadas por fuentes independientes. Antes de energizar, verificar ajuste físico del barril, tensión de la placa bajo carga y recorrido del cable.

- **Entrada del Indie 7:** 10-34 V DC y 2 A de entrada publicados. Los 2 A no son una medición de consumo del rig.
- **Cable SmallHD exacto:** CBL-PWR-DTAP-BAR-36: exterior 5.5 mm y centro positivo documentados.
- **Coincidencia de polaridad:** Cable y entrada del monitor publican centro positivo en fuentes independientes. No deducido del ID histórico del cable; prueba física aún pendiente.
- **Rango de la salida D-Tap:** El manual de la placa publica el rango de entrada D-Tap, no un rango completo de salida. Confirmar la salida efectiva de este conjunto bajo carga.
- **Ajuste y recorrido:** Diámetro interior del cable, asiento, retención, carga compartida y bucles físicos por verificar. Entrada del monitor de 2.0 mm documentada, no cotas CAD.

- [SmallHD](https://smallhd.com/products/dtap-barrel-36in): SKU CBL-PWR-DTAP-BAR-36; Tech Specs > Cable > Pinout; diámetro de producto 5.5 mm. Cable con centro positivo publicado y exterior de barril 5.5 mm. No establece el pinout de entrada del monitor ni el diámetro interior.
- [SmallHD](https://guide.smallhd.com/a/1634747-indie-7-quick-start-guide): Indie 7 Quick Start Guide > Connectors > I: Barrel connector for power. Entrada Indie 7 de 10-34 V DC y 2 A publicados; no se identifican diámetro interior ni pinout en esta guía.
- [SmallRig](https://static.smallrig.com/mall/img/public/1714289722871_.pdf): Página 4, Specifications: D-Tap Input Voltage y Battery Rated Capacity. La tabla publica entrada D-Tap de 11.0-16.8 V; 14.8 V aparece en capacidad nominal de batería, no como rango de salida D-Tap. La salida efectiva queda pendiente.
- [SmallHD](https://smallhd.com/products/indie-7): Technical Specs > Power > Connector y Voltage. Entrada de barril Indie 7: 2.0 mm interior, 5.5 mm exterior y centro positivo. Entrada DC 10–34 V; batería en terminales 6.0–16.8 V.

## pwr-npf-to-smallhd-contacts

Modelos vinculados: Batería Sony NP-F970/PRO / NP-F970/PRO; Indie 7 / MON-INDIE-7. Puertos: `npf970-contacts` -> `indie7-l-series`.

Antes de conectar: Una NP-F970/PRO en la placa serie L incluida del Indie 7, no en el barril DC. Verificar retención, contactos limpios y funcionamiento con la batería real cargada; cargador específico externo requerido.

- **Batería y masa por modelo:** NP-F970/PRO documenta 7.2 V nominales y aproximadamente 300 g. No se adopta el peso de otro producto denominado NP-F970.
- **Entrada nativa serie L:** Placa serie L incluida en Indie 7, rango 6.0-16.8 V por contactos. Es una entrada distinta del barril DC de mínimo 10 V.
- **Rango real y funcionamiento:** La ficha Sony publica tensión nominal, no el rango completo de descarga de esta revisión. Comprobar batería real, retención, contactos, consumo y autonomía; no es un ensayo de compatibilidad del par.

- [Sony](https://www.sony.jp/products/catalog/SPC_NP-F970_PRO.pdf): Página 1, especificaciones principales y advertencia de cargador. NP-F970/PRO: 7.2 V nominales, 45 Wh, dimensiones aproximadas y masa de aproximadamente 300 g; requiere cargador específico.
- [SmallHD](https://smallhd.com/products/indie-7): In the Box: Sony L Series Battery Bracket; Technical Specs, Power: Battery Charging, Input Voltage Battery. Placa serie L incluida, contactos de batería admiten 6.0-16.8 V; el monitor no carga baterías.

## pwr-npfz100-to-fx3-contacts

Modelos vinculados: Sony NP-FZ100 / NP-FZ100; FX3 / ILME-FX3. Puertos: `npfz100-contacts` -> `fx3-native-battery`.

Antes de conectar: Elegir batería nativa previamente cargada o adaptador 4253B, nunca ambos. Seguir la guía FX3 y comprobar retención, cubierta y ventilación con el ejemplar real.

- **Batería nativa FX3 documentada:** Pareja propia documentada por Sony; no se reutiliza la revisión FX30 ni la del adaptador.
- **Retención y ventilación reales:** Sin ensayo físico registrado del ejemplar con jaula, cubierta y fijaciones reales.

- [Sony](https://helpguide.sony.net/ilc/2210/v1/en/contents/TP1000886922.html): Power, general: Rated input; Rechargeable battery pack NP-FZ100: Rated voltage.. Sony identifica NP-FZ100 para ILME-FX3; 7.2 V nominales. Sin pinout ni rango completo.
- [Sony](https://helpguide.sony.net/ilc/2210/v1/en/print.pdf): Página impresa 82: Inserting/removing the battery pack.. Retención por palanca y cubierta bloqueada; apagar y comprobar lámpara de acceso antes de retirar.

## pilot-pwr-npfz100-fx30

Modelos vinculados: Sony NP-FZ100 / NP-FZ100; Sony FX30 / ILME-FX30. Puertos: `npfz100-contacts` -> `fx30-native-battery`.

Antes de conectar: Usar batería nativa previamente cargada y seguir Sony. Comprobar retención, cubierta, ventilación y firmware del ejemplar; conjunto no ensayado.

- **Batería nativa documentada:** La pareja nativa está identificada por Sony; no requiere D-Tap, cable ni regulador externo.
- **Retención y ventilación reales:** Asiento, cubierta y ventilación deben comprobarse con el ejemplar y jaula reales. Sin ensayo registrado.

- [Sony](https://helpguide.sony.net/ilc/2220/v1/en/print.pdf): Página 19: NP-FZ100 incluida; páginas de inserción de batería y 526: especificaciones.. Sony identifica NP-FZ100 como batería nativa para ILME-FX30; no documenta aquí pinout ni rango.


## Alcance pendiente

Los otros 14 circuitos conservan especificaciones y riesgos, pero no se califican como compatibles por defecto. Las revisiones no añaden piezas, no cambian las siete plantillas y no modifican las selecciones guardadas. Cadenas mecánicas universales, revisión del resto del catálogo y ensayos físicos siguen pendientes.
