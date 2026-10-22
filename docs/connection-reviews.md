# Revisión de conexiones

Fuente: `data/connection-reviews.json`, revisión `connection-review-2026-10-21-4`. Valores eléctricos canónicos en cables y puertos, con fuente por campo. 22 de 22 circuitos con revisión ampliada.

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

## vid-fx30-to-smallhd

Modelos vinculados: HDMI Kondor Blue / KB-FHDMI-12; Sony FX30 / ILME-FX30; Indie 7 / MON-INDIE-7. Puertos: `fx30-hdmi-out` -> `indie7-hdmi-in`.

Antes de conectar: Configurar salida de monitor no RAW y 1080p como punto de partida; verificar señal, formato, firmware y bucle de inclinación antes de usar. No es un par ensayado por Takegrid.

- **Interfaces y límites publicados:** Extremos documentados de forma independiente. Intersección candidata, no prueba de este par ni modo universal.
- **Señal y holgura del conjunto real:** Formato, firmware, señal recibida, retención HDMI e inclinación con cable no ensayados.

- [Sony](https://helpguide.sony.net/ilc/2220/v1/en/print.pdf): Sides, página 44 de copia descargada; HDMI Output Settings (movie), Output Resolution y RAW Output.. Sony documenta salida HDMI-A y selección de resolución no RAW; no acredita recepción en este monitor.
- [SmallHD](https://guide.smallhd.com/a/1634747-indie-7-quick-start-guide): POWER AND CONNECT / INPUT-OUTPUT.. SmallHD publica HDMI hasta 4Kp30; no es grabador RAW ni una prueba 4K60.
- [Kondor Blue](https://kondorblue.com/products/12-to-24-coiled-braided-hdmi-cable-for-camera-mounted-monitors): TECH SPECS, KB-FHDMI-12.. Dos HDMI-A macho, HDMI 2.0 / 18 Gbps; extensión 12–24 pulgadas.

## audio-rx-to-fx30

Modelos vinculados: Mic 2; Sony FX30 / ILME-FX30. Puertos: `mic2-rx-out` -> `fx30-mic-in`.

Antes de conectar: Conectar OUT a MIC mediante TRS incluido y ajustar ganancia sin saturar. Revisar una toma con el ejemplar real; confirmar modo de grabación, niveles y retención del RX.

- **OUT y MIC documentados:** Interfaces revisadas para estos modelos; no asegura valores de ganancia, ruido ni compatibilidad de cualquier modo.
- **Niveles, canales y grabación real:** Sin ensayo de niveles, monitorización, toma reproducida, firmware o retención con monitor inclinado.

- [Sony](https://helpguide.sony.net/ilc/2220/v1/en/print.pdf): Sides, página 44 de copia descargada: llamada 5 MIC; Audio Recording y Audio Rec Level.. MIC externo priorizado sobre micrófono interno y asa. No confundir salida de auriculares con entrada.
- [DJI](https://dl.djicdn.com/downloads/DJI_Mic_2/20240426/UM/DJI_Mic_2_User_Manual_V1.2_EN.pdf): v1.2 páginas 8 y 13: OUT TRS, zapata integrada y cable de cámara incluido.. RX transmite audio analógico a entrada de micrófono mediante TRS; alimentación interna, sin adaptador Sony MI.

## vid-fx3-to-smallhd

Modelos vinculados: HDMI Kondor Blue / KB-FHDMI-12; FX3 / ILME-FX3; Indie 7 / MON-INDIE-7. Puertos: `fx3-hdmi` -> `indie7-hdmi-in`.

Antes de conectar: Usar HDMI IN del monitor y salida no RAW compatible. Probar imagen durante grabación y la holgura del cable.

- **Interfaz documentada: FX3:** FX3 tiene HDMI tipo A y entrada MIC estéreo de 3.5 mm.
- **Interfaz documentada: Indie 7:** Indie 7 distingue HDMI IN y OUT; admite HDMI hasta 4Kp30. No se documenta aquí escalado para RavenEye.
- **Interfaz documentada: KB-FHDMI-12:** Cable HDMI-A macho a HDMI-A macho; HDMI 2.0, 18 Gbps. La señal efectiva depende de la cadena.
- **Formato y funcionamiento:** Probar resolución, frecuencia, color, grabación y salida no RAW en firmware real. El cable 4K60 no amplía el límite del monitor.

- [Sony](https://helpguide.sony.net/ilc/2210/v1/en/print.pdf): Sides y Specifications / Input-output terminals. FX3 tiene HDMI tipo A y entrada MIC estéreo de 3.5 mm.
- [SmallHD](https://guide.smallhd.com/a/1634747-indie-7-quick-start-guide): Physical Properties J/K; Power and Connect / Input-Output. Indie 7 distingue HDMI IN y OUT; admite HDMI hasta 4Kp30. No se documenta aquí escalado para RavenEye.
- [Kondor Blue](https://kondorblue.com/products/12-to-24-coiled-braided-hdmi-cable-for-camera-mounted-monitors): KB-FHDMI-12 / Tech Specs / Connector 1 y 2. Cable HDMI-A macho a HDMI-A macho; HDMI 2.0, 18 Gbps. La señal efectiva depende de la cadena.

## vid-smallhd-to-ronin-transmitter

Modelos vinculados: HDMI A-C DJI; Indie 7 / MON-INDIE-7; RavenEye. Puertos: `indie7-hdmi-out` -> `raveneye-hdmi`.

Antes de conectar: Alternativa condicional, no cadena montada aprobada. Verificar salida progresiva común sin asumir escalado del monitor.

- **Interfaz documentada: Indie 7:** Indie 7 distingue HDMI IN y OUT; admite HDMI hasta 4Kp30. No se documenta aquí escalado para RavenEye.
- **Interfaz documentada: Ronin Image Transmitter:** Ronin Image Transmitter tiene Mini HDMI y batería propia; no se añade una batería externa ficticia.
- **Interfaz documentada: HDMI A/C:** El conjunto del transmisor incluye Mini-HDMI a HDMI de 20 cm; longitud útil y holgura se comprueban en el equipo.
- **Interfaz documentada: señal progresiva:** La nota DJI distingue 1080p/720p de 1080i; no es validación del paso por SmallHD ni del distribuidor.
- **Paso real de señal:** Ensayar HDMI OUT a Mini HDMI a 1080p compatible, EDID, latencia y arranque. No simultanear con otra fuente en la misma entrada.

- [SmallHD](https://guide.smallhd.com/a/1634747-indie-7-quick-start-guide): Physical Properties J/K; Power and Connect / Input-Output. Indie 7 distingue HDMI IN y OUT; admite HDMI hasta 4Kp30. No se documenta aquí escalado para RavenEye.
- [DJI](https://www.dji.com/rs-4-pro/specs): DJI Ronin Image Transmitter / Connections y Battery. Ronin Image Transmitter tiene Mini HDMI y batería propia; no se añade una batería externa ficticia.
- [DJI](https://store.dji.com/product/ronin-raveneye-image-transmission-system): In The Box / Mini-HDMI to HDMI Cable (20 cm). El conjunto del transmisor incluye Mini-HDMI a HDMI de 20 cm; longitud útil y holgura se comprueban en el equipo.
- [DJI](https://repair.dji.com/help/content?customId=en-us03400007678&lang=en&re=US&spaceId=34): Tabla de compatibilidad / EOS-1D X / Notes. La nota DJI distingue 1080p/720p de 1080i; no es validación del paso por SmallHD ni del distribuidor.

## vid-fx3-to-startech-splitter

Modelos vinculados: Distribuidor StarTech / ST122HD4KU; FX3 / ILME-FX3. Puertos: `fx3-hdmi` -> `splitter-captive-input`.

Antes de conectar: Sólo banco: conectar a FX3 el HDMI cautivo del ST122HD4KU. No añadir un cable A-A inexistente en esa entrada.

- **Interfaz documentada: FX3:** FX3 tiene HDMI tipo A y entrada MIC estéreo de 3.5 mm.
- **Interfaz documentada: ST122HD4KU:** ST122HD4KU integra la entrada HDMI cautiva y dos salidas; HDMI 1.4 y hasta 4K30.
- **Banco y soporte pendiente:** Comprobar señal común con ambos destinos, abrazadera y soporte del distribuidor. Sin montaje dinámico verificado no habilitar en gimbal.

- [Sony](https://helpguide.sony.net/ilc/2210/v1/en/print.pdf): Sides y Specifications / Input-output terminals. FX3 tiene HDMI tipo A y entrada MIC estéreo de 3.5 mm.
- [StarTech](https://media.startech.com/cms/pdfs/st122hd4ku_datasheet.pdf): Páginas 1-3 / Features, Hardware y Connector(s). ST122HD4KU integra la entrada HDMI cautiva y dos salidas; HDMI 1.4 y hasta 4K30.

## vid-splitter-to-smallhd

Modelos vinculados: HDMI Kondor Blue / KB-FHDMI-12; Distribuidor StarTech / ST122HD4KU; Indie 7 / MON-INDIE-7. Puertos: `splitter-output1` -> `indie7-hdmi-in`.

Antes de conectar: Sólo banco: salida 1 del distribuidor a HDMI IN Indie 7. La negociación de ambos destinos sigue pendiente.

- **Interfaz documentada: ST122HD4KU:** ST122HD4KU integra la entrada HDMI cautiva y dos salidas; HDMI 1.4 y hasta 4K30.
- **Interfaz documentada: Indie 7:** Indie 7 distingue HDMI IN y OUT; admite HDMI hasta 4Kp30. No se documenta aquí escalado para RavenEye.
- **Interfaz documentada: KB-FHDMI-12:** Cable HDMI-A macho a HDMI-A macho; HDMI 2.0, 18 Gbps. La señal efectiva depende de la cadena.
- **Negociación de la cadena:** Probar los dos destinos conectados, reinicio, frecuencia y resolución comunes; no convertir la ficha del cable en compatibilidad de toda la cadena.

- [StarTech](https://media.startech.com/cms/pdfs/st122hd4ku_datasheet.pdf): Páginas 1-3 / Features, Hardware y Connector(s). ST122HD4KU integra la entrada HDMI cautiva y dos salidas; HDMI 1.4 y hasta 4K30.
- [SmallHD](https://guide.smallhd.com/a/1634747-indie-7-quick-start-guide): Physical Properties J/K; Power and Connect / Input-Output. Indie 7 distingue HDMI IN y OUT; admite HDMI hasta 4Kp30. No se documenta aquí escalado para RavenEye.
- [Kondor Blue](https://kondorblue.com/products/12-to-24-coiled-braided-hdmi-cable-for-camera-mounted-monitors): KB-FHDMI-12 / Tech Specs / Connector 1 y 2. Cable HDMI-A macho a HDMI-A macho; HDMI 2.0, 18 Gbps. La señal efectiva depende de la cadena.

## vid-splitter-to-raveneye

Modelos vinculados: HDMI A-C DJI; Distribuidor StarTech / ST122HD4KU; RavenEye. Puertos: `splitter-output2` -> `raveneye-hdmi`.

Antes de conectar: Sólo banco: salida 2 a Mini HDMI del transmisor, con señal progresiva común.

- **Interfaz documentada: ST122HD4KU:** ST122HD4KU integra la entrada HDMI cautiva y dos salidas; HDMI 1.4 y hasta 4K30.
- **Interfaz documentada: Ronin Image Transmitter:** Ronin Image Transmitter tiene Mini HDMI y batería propia; no se añade una batería externa ficticia.
- **Interfaz documentada: HDMI A/C:** El conjunto del transmisor incluye Mini-HDMI a HDMI de 20 cm; longitud útil y holgura se comprueban en el equipo.
- **Interfaz documentada: señal progresiva:** La nota DJI distingue 1080p/720p de 1080i; no es validación del paso por SmallHD ni del distribuidor.
- **Señal compartida y recorrido:** Ensayar 1080p/720p y frecuencia real con monitor y transmisor. Sin soporte y holgura no llevar este circuito a un gimbal.

- [StarTech](https://media.startech.com/cms/pdfs/st122hd4ku_datasheet.pdf): Páginas 1-3 / Features, Hardware y Connector(s). ST122HD4KU integra la entrada HDMI cautiva y dos salidas; HDMI 1.4 y hasta 4K30.
- [DJI](https://www.dji.com/rs-4-pro/specs): DJI Ronin Image Transmitter / Connections y Battery. Ronin Image Transmitter tiene Mini HDMI y batería propia; no se añade una batería externa ficticia.
- [DJI](https://store.dji.com/product/ronin-raveneye-image-transmission-system): In The Box / Mini-HDMI to HDMI Cable (20 cm). El conjunto del transmisor incluye Mini-HDMI a HDMI de 20 cm; longitud útil y holgura se comprueban en el equipo.
- [DJI](https://repair.dji.com/help/content?customId=en-us03400007678&lang=en&re=US&spaceId=34): Tabla de compatibilidad / EOS-1D X / Notes. La nota DJI distingue 1080p/720p de 1080i; no es validación del paso por SmallHD ni del distribuidor.

## pwr-ac-to-splitter

Modelos vinculados: Distribuidor StarTech / ST122HD4KU. Puertos: `startech-adapter` -> `splitter-dc`.

Antes de conectar: Usar únicamente la alimentación incluida identificada para ST122HD4KU. No D-Tap directo ni adaptadores de barril supuestos.

- **Interfaz documentada: adaptador incluido:** Incluye adaptador 5 V DC / 2 A y cable USB de alimentación. Polaridad y dimensiones de contacto no se deducen de Plug Type N.
- **Adaptador y seguridad de red:** Confirmar etiqueta 5 V/2 A, polaridad, ajuste del conector y versión regional del adaptador antes de energizar. No se verifican por una malla.

- [StarTech](https://media.startech.com/cms/pdfs/st122hd4ku_datasheet.pdf): Página 2 / Power; páginas 3-4 / Included in Package. Incluye adaptador 5 V DC / 2 A y cable USB de alimentación. Polaridad y dimensiones de contacto no se deducen de Plug Type N.

## focus-rs4-to-lidar

Modelos vinculados: Focus Pro LiDAR; RS 4 Pro. Puertos: `rs4-lidar` -> `lidar-data`.

Antes de conectar: Mantener condicional: distinguir el puerto de datos LiDAR del de firmware; seguir el diagrama y cable DJI exactos.

- **Interfaz documentada: RS 4 Pro:** RS 4 Pro separa USB-C de transmisión/LiDAR, RSS y motor de enfoque. No son intercambiables por su forma.
- **Interfaz documentada: Focus Pro LiDAR:** El LiDAR distingue USB-C Power/USB para firmware de Power/CVBS/CAN para datos.
- **Asignación, calibración y óptica:** Comprobar cable/puerto en manual exacto, firmware, soporte y calibración con óptica manual admitida. No activar con el FE 16-35 GM autofocus ni con hub Transmission ausente.

- [DJI](https://www.dji.com/rs-4-pro/specs): Peripheral / Accessory Port. RS 4 Pro separa USB-C de transmisión/LiDAR, RSS y motor de enfoque. No son intercambiables por su forma.
- [DJI](https://www.dji.com/focus-pro/specs): LiDAR / Accessory Port. El LiDAR distingue USB-C Power/USB para firmware de Power/CVBS/CAN para datos.

## focus-rs4-to-motor

Modelos vinculados: Motor Focus Pro; RS 4 Pro. Puertos: `rs4-focus` -> `motor-usbc`.

Antes de conectar: Mantener condicional: usar el puerto de motor, nunca RSS. La forma USB-C no prueba cable ni alimentación.

- **Interfaz documentada: RS 4 Pro:** RS 4 Pro separa USB-C de transmisión/LiDAR, RSS y motor de enfoque. No son intercambiables por su forma.
- **Interfaz documentada: Focus Pro Motor:** La ficha específica describe Focus Pro Motor; no establece aquí el pinout del cable ni prueba engrane con el objetivo elegido.
- **Cable, engrane y calibración:** Verificar cable original, asignación, soporte 15 mm, engrane, topes y calibración con la óptica concreta. No introducir un segundo motor o adaptador implícito.

- [DJI](https://www.dji.com/rs-4-pro/specs): Peripheral / Accessory Port. RS 4 Pro separa USB-C de transmisión/LiDAR, RSS y motor de enfoque. No son intercambiables por su forma.
- [DJI](https://www.dji.com/focus-pro/specs): Motor / Power Supply Voltage y Mechanical Properties. La ficha específica describe Focus Pro Motor; no establece aquí el pinout del cable ni prueba engrane con el objetivo elegido.

## audio-rx-to-fx3

Modelos vinculados: Mic 2; FX3 / ILME-FX3. Puertos: `mic2-rx-out` -> `fx3-mic`.

Antes de conectar: OUT del RX a MIC del cuerpo. Esta conexión desactiva el audio del asa XLR; no es una mezcla simultánea.

- **Interfaz documentada: Mic 2:** OUT TRS del RX y entrada TRS del TX son funciones distintas; la conexión a cámara usa el cable de audio incluido.
- **Interfaz documentada: FX3:** FX3 tiene HDMI tipo A y entrada MIC estéreo de 3.5 mm.
- **Niveles y prueba grabada:** Revisar ganancia, canales y escucha de una toma real; asegurar TRS sin tensión. No conectar a la salida de auriculares del RX.

- [DJI](https://dl.djicdn.com/downloads/DJI_Mic_2/20240426/UM/DJI_Mic_2_User_Manual_V1.2_EN.pdf): Páginas 5, 8 y 13 / Overview y Using with a Camera. OUT TRS del RX y entrada TRS del TX son funciones distintas; la conexión a cámara usa el cable de audio incluido.
- [Sony](https://helpguide.sony.net/ilc/2210/v1/en/print.pdf): Sides y Specifications / Input-output terminals. FX3 tiene HDMI tipo A y entrada MIC estéreo de 3.5 mm.

## audio-rx-to-xlrhandle

Modelos vinculados: Mic 2; XLR-H1 / XLR-H1. Puertos: `mic2-rx-out` -> `xlrh1-input3`.

Antes de conectar: OUT del RX a INPUT3 estéreo del asa. Elegir INPUT SELECT y formato/canales antes de comprobar la toma.

- **Interfaz documentada: Mic 2:** OUT TRS del RX y entrada TRS del TX son funciones distintas; la conexión a cámara usa el cable de audio incluido.
- **Interfaz documentada: XLR-H1:** INPUT3 es mini-jack estéreo; el selector determina CH1/2 o CH3/4 en grabación de cuatro canales. No es una entrada XLR.
- **Canales y escucha:** INPUT3 no siempre es CH3/4: con IN3 puede alimentar CH1/2. Comprobar modo de cuatro canales, selector y niveles; no conectar también MIC del cuerpo ni aplicar phantom al RX.

- [DJI](https://dl.djicdn.com/downloads/DJI_Mic_2/20240426/UM/DJI_Mic_2_User_Manual_V1.2_EN.pdf): Páginas 5, 8 y 13 / Overview y Using with a Camera. OUT TRS del RX y entrada TRS del TX son funciones distintas; la conexión a cámara usa el cable de audio incluido.
- [Sony](https://helpguide.sony.net/ilc/2210/v1/en/print.pdf): XLR handle unit; Recording audio using the XLR adaptor / INPUT SELECT. INPUT3 es mini-jack estéreo; el selector determina CH1/2 o CH3/4 en grabación de cuatro canales. No es una entrada XLR.

## audio-lav-to-tx

Modelos vinculados: Micrófono de solapa DJI; Mic 2. Puertos: `lav-mic` -> `mic2-tx-in`.

Antes de conectar: Lavalier al TRS del TX sobre el participante, no sobre el rig ni en OUT del RX.

- **Interfaz documentada: Lavalier Mic:** DJI incluye Lavalier Mic entre accesorios compatibles con Mic 2.
- **Interfaz documentada: Mic 2:** OUT TRS del RX y entrada TRS del TX son funciones distintas; la conexión a cámara usa el cable de audio incluido.
- **Retención y sonido:** Comprobar inserción, fijación a ropa y roces. No conectar alimentación phantom de 24/48 V al TX; el recorrido sobre la persona no está modelado.

- [DJI](https://store.dji.com/product/dji-lavalier-mic): Compatibility / DJI Mic 2. DJI incluye Lavalier Mic entre accesorios compatibles con Mic 2.
- [DJI](https://dl.djicdn.com/downloads/DJI_Mic_2/20240426/UM/DJI_Mic_2_User_Manual_V1.2_EN.pdf): Páginas 5, 8 y 13 / Overview y Using with a Camera. OUT TRS del RX y entrada TRS del TX son funciones distintas; la conexión a cámara usa el cable de audio incluido.

## pwr-bg70-to-rs4

Modelos vinculados: BG70; RS 4 Pro. Puertos: `bg70-contacts` -> `rs4-grip-contacts`.

Antes de conectar: BG70 se acopla mediante la interfaz de empuñadura del fabricante. No se dibuja un cable de potencia externo.

- **Interfaz documentada: BG70:** DJI lista BG70 para alimentar RS 4 Pro; no equivale a alimentar el gimbal por USB-C.
- **Cierre y estado real:** Comprobar bloqueo del grip, contactos limpios y carga según DJI; autonomía y retención bajo movimiento no ensayadas. No extrapolar a salida USB-C del grip.

- [DJI](https://store.dji.com/product/dji-rs-bg70-high-capacity-battery-grip): Compatibility; Overview. DJI lista BG70 para alimentar RS 4 Pro; no equivale a alimentar el gimbal por USB-C.

## pwr-raveneye-internal

Modelos vinculados: RavenEye. Puertos: `raveneye-battery` -> `raveneye-internal`.

Antes de conectar: Batería interna del transmisor en banco. No abrir, cablear contactos internos ni inferir un conector accesible.

- **Interfaz documentada: Ronin Image Transmitter:** Ronin Image Transmitter tiene Mini HDMI y batería propia; no se añade una batería externa ficticia.
- **Carga y autonomía:** Cargar según fabricante y probar duración/transmisión real. Este vínculo interno no representa un cable externo ni autoriza montaje en rig.

- [DJI](https://www.dji.com/rs-4-pro/specs): DJI Ronin Image Transmitter / Connections y Battery. Ronin Image Transmitter tiene Mini HDMI y batería propia; no se añade una batería externa ficticia.

## pwr-vmount-to-plate-contacts

Modelos vinculados: Placa V-mount / 3203B; VB99 Pro / 4292. Puertos: `vb99-vmount` -> `plate-vmount`.

Antes de conectar: Acoplar sólo tras verificar batería, placa y retén; nominal no equivale a rango de salida bajo carga.

- **Interfaz documentada: 3203B:** Placa 3203B para batería V-mount; entrada publicada 11.0-16.8 V. No se infiere rango efectivo de salida.
- **Interfaz documentada: VB99 Pro:** Documento específico VB99 Pro; nominal no demuestra rango completo bajo carga ni retención de la pareja.
- **Rango completo y retención:** Confirmar rango real VB99 Pro frente a entrada 3203B, corriente conjunta y retención. Ensayar contactos y bloqueo con el equipo apoyado; no inferir pinout o continuidad desde el aspecto.

- [SmallRig](https://static.smallrig.com/mall/img/public/1714289722871_.pdf): Página 4 / Specifications; página 6 / Battery installation. Placa 3203B para batería V-mount; entrada publicada 11.0-16.8 V. No se infiere rango efectivo de salida.
- [SmallRig](https://static.smallrig.com/mall/img/public/1730100759046_.pdf): Product Specifications / modelo y capacidad nominal. Documento específico VB99 Pro; nominal no demuestra rango completo bajo carga ni retención de la pareja.


## Alcance pendiente

Los otros 0 circuitos conservan especificaciones y riesgos, pero no se califican como compatibles por defecto. Las revisiones no añaden piezas, no cambian las siete plantillas y no modifican las selecciones guardadas. Cadenas mecánicas universales, revisión del resto del catálogo y ensayos físicos siguen pendientes.
