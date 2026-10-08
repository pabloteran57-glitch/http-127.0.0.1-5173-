# Mapa de cables y alimentación

Canónicos: `data/cables-manifest.json` y `data/ports-manifest.json`. 22 circuitos, 41 puertos. Identidad de conectores documentada; coordenadas 3D y curvas aproximadas.

## Arquitectura

- BG70 -> contactos empuñadura -> RS 4 Pro, no cable externo ni segunda batería BG30.
- VB99 D-Tap -> 4253B regulado -> NP-FZ100 adaptador de batería -> FX3.
- VB99 contactos V-mount -> 3203B -> D-Tap -> SmallHD conector de barril 5.5 mm externo -> Indie 7 DC I.
- Alternativa propia: NP-F970/PRO -> contactos de placa serie L incluida -> Indie 7. Una batería elegida, sin cable; 7.2 V nominales y ~300 g. Nunca al barril DC de mínimo 10 V. Cargador externo requerido; el monitor no carga baterías.
- RS RSS -> USB-C control -> FX3 USB-C.
- Gimbal candidato: única FX3 HDMI A -> Indie 7 HDMI IN J.
- Doble salida solicitada, en banco: FX3 HDMI -> entrada cautiva StarTech -> salida 1 A-A a Indie 7 / salida 2 A-C a RavenEye. Adaptador StarTech incluido de 5 V / 2 A. No distribuidor sin fuente ni montaje invisible.
- RavenEye en banco con batería interna; no reclamar control gimbal/ActiveTrack por sólo tener vídeo.

**Corrección eléctrica:** Cable CBL-PWR-DTAP-BAR-36: exterior 5.5 mm y centro positivo publicados, interior del cable por confirmar. Fuente independiente SmallHD, tabla técnica Power: entrada del Indie 7 de 2.0 mm interior / 5.5 mm exterior y centro positivo, DC 10–34 V; terminales batería 6.0–16.8 V. El ID histórico del cable no es prueba de conector. 4253B: entrada 9.6–20 V / mínimo 2 A, salida 8.0–8.4 V / máximo continuo 2 A. Todas las cargas y ajustes reales siguen pendientes.

Revisión por circuito y fuentes: [comprobaciones de conexiones](connection-reviews.md). 8 enlaces revisados documentalmente; los demás no se dan por compatibles por tener puertos identificados.

## Colores

- Alimentación: `#efb365`
- Vídeo: `#89cfc8`
- Control: `#a8c68c`
- focus_lidar: `#d4a5ff`
- caution: `#eb8b72`

## Recorridos

### ctrl-rs4-to-fx3-usbc

- Producto/fuente: Control USB-C DJI.
- Origen: Puerto RSS del RS 4 Pro; puerto `rs4-rss`.
- Destino: USB-C de FX3; puerto `fx3-usbc`.
- Conector A: USB-C macho; conector B: USB-C macho.
- Tipo: Datos/control; estándar/tensión: DJI documenta control USB-C de FX3 con RS 4 Pro; matriz publicada con firmware FX3 V1.00. Comprobar ajustes y firmware del equipo real..
- Longitud estimada: Cable DJI de 30 cm; alcance útil estimado de 250-350 mm por comprobar, no longitud para cortar.
- Ruta candidata: Sujeción en el lado izquierdo de la jaula y bucle suave de inclinación hacia RSS. Configurar el modo USB de cámara compatible con DJI.
- Alivio de tensión: Sujetar ambos extremos sin cargar los conectores; probar holgura y radio mínimo de curvatura.
- Riesgos: La forma USB-C no demuestra compatibilidad de protocolo DJI.; Comprobar tensión en cada ángulo permitido de inclinación y rotación.
- Obligatorio/opcional: Obligatorio; estado: Candidato; visualización: Cable.
- Cruce de movimiento: De puerto del gimbal a cámara; geometría: Esquema, no CAD de puertos.


### pwr-vmount-to-fx3-dummy

- Producto/fuente: Adaptador NP-FZ100.
- Origen: D-Tap de VB99 Pro; puerto `vb99-dtap`.
- Destino: Compartimento FX3 mediante 4253B; puerto `fx3-battery`.
- Conector A: D-Tap macho; conector B: Adaptador NP-FZ100 regulado.
- Tipo: Alimentación; estándar/tensión: Manual 4253B: entrada de 9.6-20 V y mínimo de 2 A; salida regulada de 8.0-8.4 V, máximo continuo de 2 A..
- Longitud estimada: Espiral de fábrica: extensión de producto publicada de 580 mm; hasta 2 m ±50 mm según manual. Medir holgura útil.
- Ruta candidata: Ambos extremos se mueven con la cámara. Sujetar sobrante en varilla/jaula trasera y utilizar la salida de puerta sin pellizcar.
- Alivio de tensión: Sujetar ambos extremos sin cargar los conectores; probar holgura y radio mínimo de curvatura.
- Riesgos: Nunca D-Tap directo a cámara.; Apagar antes de retirar el adaptador; verificar salida del regulador y cierre de puerta.
- Obligatorio/opcional: Obligatorio; estado: Candidato; visualización: Cable.
- Cruce de movimiento: Dentro del mismo subconjunto; geometría: Esquema, no CAD de puertos.


### pwr-plate-to-smallhd

- Producto/fuente: D-Tap a DC SmallHD.
- Origen: Salida D-Tap de 3203B; puerto `plate-dtap`.
- Destino: Entrada DC del Indie 7; puerto `indie7-dc`.
- Conector A: D-Tap macho; conector B: Barril SmallHD macho, exterior 5.5 mm; centro positivo; interior pendiente.
- Tipo: Alimentación; estándar/tensión: D-Tap a tensión de batería; Indie 7 admite 10-34 V DC y entrada nominal de 2 A. El cable no regula..
- Longitud estimada: Cable de fábrica de 914.4 mm; alcance necesario aproximado.
- Ruta candidata: De placa móvil trasera a monitor lateral fijo: sujetar en jaula, dejar bucles de servicio medidos en los ejes y retener sobrante en soporte de monitor, fuera de las manos.
- Alivio de tensión: Sujetar ambos extremos sin cargar los conectores; probar holgura y radio mínimo de curvatura.
- Riesgos: Cable y entrada documentan centro positivo por separado; entrada Indie 7: 2.0 mm interior / 5.5 mm exterior. Interior del cable y ajuste físico todavía por verificar; medir tensión bajo carga antes de conectar.; Cruza de móvil a fijo: no admite giro/rotación ilimitados.; No unir batería móvil y monitor fijo con un cable tenso.
- Obligatorio/opcional: Obligatorio; estado: Candidato; visualización: Cable.
- Cruce de movimiento: De móvil a fijo; geometría: Esquema, no CAD de puertos.
- Recorrido cage: Desde D-Tap de placa sobre varillas hasta monitor sobre jaula 4770. Ambos extremos pertenecen al núcleo; recoger sobrante lejos del asa, pantalla y liberación de la batería. Cruce: same_camera_core. Curva ilustrativa, no ruta física medida.
- Recorrido xlr: Desde D-Tap de placa sobre varillas hasta monitor sobre kit 4830 del XLR-H1. Ambos extremos pertenecen al núcleo; recoger sobrante lejos del asa, pantalla y liberación de la batería. Cruce: same_camera_core. Curva ilustrativa, no ruta física medida.

### vid-fx3-to-smallhd

- Producto/fuente: HDMI Kondor Blue.
- Origen: Única salida HDMI de FX3; puerto `fx3-hdmi`.
- Destino: Entrada HDMI del Indie 7; puerto `indie7-hdmi-in`.
- Conector A: HDMI tipo A macho; conector B: HDMI tipo A macho.
- Tipo: Vídeo; estándar/tensión: Cable HDMI 2.0 / 18 Gbps; monitor hasta 4Kp30. Usar 1080p si se retransmite..
- Longitud estimada: Espiral de 304.8-609.6 mm; no equivale necesariamente a holgura útil.
- Ruta candidata: Desde abrazadera HDMI izquierda a monitor fijo mediante bucles flexibles medidos. Comprobar fuerza de espiral con motores apagados.
- Alivio de tensión: Sujetar ambos extremos sin cargar los conectores; probar holgura y radio mínimo de curvatura.
- Riesgos: No representa una segunda salida HDMI de cámara.; La fuerza de la espiral puede alterar el balance.; No asumir compatibilidad con 4K60 o visualización RAW.
- Obligatorio/opcional: Obligatorio; estado: Candidato; visualización: Cable.
- Cruce de movimiento: De móvil a fijo; geometría: Esquema, no CAD de puertos.
- Recorrido cage: Desde HDMI izquierdo de FX3, retenido en la abrazadera de jaula, hacia el monitor sobre NATO 4770. Ambos extremos siguen el núcleo; dejar bucle para inclinación del monitor y acceso a conectores, sin cruzar el agarre. Cruce: same_camera_core. Curva ilustrativa, no ruta física medida.
- Recorrido xlr: Desde HDMI izquierdo de FX3, retenido en la abrazadera de jaula, hacia el monitor sobre riel 4830 del XLR-H1. Ambos extremos siguen el núcleo; dejar bucle para inclinación del monitor y acceso a conectores, sin cruzar el agarre. Cruce: same_camera_core. Curva ilustrativa, no ruta física medida.

### vid-smallhd-to-ronin-transmitter

- Producto/fuente: HDMI A-C DJI.
- Origen: Salida HDMI del Indie 7; puerto `indie7-hdmi-out`.
- Destino: Entrada Mini HDMI del Ronin Image Transmitter; puerto `raveneye-hdmi`.
- Conector A: HDMI tipo A macho; conector B: Mini HDMI tipo C macho.
- Tipo: Vídeo; estándar/tensión: Alternativa de paso de señal: fuente progresiva 1080p compatible; no asumir conversión de resolución..
- Longitud estimada: Cable de fábrica de 200 mm; sólo alcanza si los aparatos están juntos.
- Ruta candidata: Alternativa de banco tras probar EDID; no sustituye el circuito principal con distribuidor ni inventa soporte de transmisor al monitor.
- Alivio de tensión: Sujetar ambos extremos sin cargar los conectores; probar holgura y radio mínimo de curvatura.
- Riesgos: Probar formato y frecuencia de imagen.; Alternativa, no topología solicitada con distribuidor.; Montaje del transmisor y uso simultáneo de puertos RS sin verificar.
- Obligatorio/opcional: Opcional; estado: Condicionado; visualización: Cable.
- Cruce de movimiento: Dentro del mismo subconjunto; geometría: Esquema, no CAD de puertos.


### vid-fx3-to-startech-splitter

- Producto/fuente: Distribuidor StarTech.
- Origen: Salida HDMI de FX3; puerto `fx3-hdmi`.
- Destino: Cable de entrada cautivo ST122HD4KU; puerto `splitter-captive-input`.
- Conector A: HDMI tipo A macho del cable cautivo; conector B: Cable cautivo integrado en el distribuidor.
- Tipo: Vídeo; estándar/tensión: HDMI 1.4; circuito de doble salida en banco a 1080p progresivo..
- Longitud estimada: 620 mm publicados incluyen cuerpo y cable; alcance real del cable sin confirmar.
- Ruta candidata: Distribuidor sujeto en banco; cable integrado directo a cámara. No añadir entrada hembra inexistente ni otro cable A-A.
- Alivio de tensión: Sujetar ambos extremos sin cargar los conectores; probar holgura y radio mínimo de curvatura.
- Riesgos: No usar simultáneamente el cable directo cámara-monitor.; Sin soporte verificado en rig: sólo banco.
- Obligatorio/opcional: Opcional; estado: Sólo banco; visualización: Cable.
- Cruce de movimiento: Dentro del mismo subconjunto; geometría: Esquema, no CAD de puertos.


### vid-splitter-to-smallhd

- Producto/fuente: HDMI Kondor Blue.
- Origen: Salida 1 del ST122HD4KU; puerto `splitter-output1`.
- Destino: Entrada HDMI del Indie 7; puerto `indie7-hdmi-in`.
- Conector A: HDMI tipo A macho; conector B: HDMI tipo A macho.
- Tipo: Vídeo; estándar/tensión: Señal progresiva 1080p compartida; probar negociación EDID..
- Longitud estimada: Kondor Blue de 304.8-609.6 mm; comprobar alcance estático.
- Ruta candidata: En banco, salida 1 del distribuidor al monitor; no se aprueba cruce de ejes móviles.
- Alivio de tensión: Sujetar ambos extremos sin cargar los conectores; probar holgura y radio mínimo de curvatura.
- Riesgos: Monitor y RavenEye deben aceptar la misma señal de cámara.; No hay conversión de resolución verificada en el distribuidor.
- Obligatorio/opcional: Opcional; estado: Sólo banco; visualización: Cable.
- Cruce de movimiento: Dentro del mismo subconjunto; geometría: Esquema, no CAD de puertos.


### vid-splitter-to-raveneye

- Producto/fuente: HDMI A-C DJI.
- Origen: Salida 2 del ST122HD4KU; puerto `splitter-output2`.
- Destino: Entrada Mini HDMI de Ronin Image Transmitter; puerto `raveneye-hdmi`.
- Conector A: HDMI tipo A macho; conector B: Mini HDMI tipo C macho.
- Tipo: Vídeo; estándar/tensión: 1080p o 720p progresivos y frecuencia compatible, no entrelazada..
- Longitud estimada: Cable de fábrica de 200 mm; colocar juntos en banco.
- Ruta candidata: Salida 2 del distribuidor a RavenEye en banco; verificar soporte de aparatos antes de uso móvil.
- Alivio de tensión: Sujetar ambos extremos sin cargar los conectores; probar holgura y radio mínimo de curvatura.
- Riesgos: Comprobar EDID, pérdida de señal y reconexión.; No enviar 4K a RavenEye.
- Obligatorio/opcional: Opcional; estado: Sólo banco; visualización: Cable.
- Cruce de movimiento: Dentro del mismo subconjunto; geometría: Esquema, no CAD de puertos.


### pwr-ac-to-splitter

- Producto/fuente: Distribuidor StarTech.
- Origen: Adaptador de corriente StarTech incluido; puerto `startech-adapter`.
- Destino: Entrada de alimentación ST122HD4KU; puerto `splitter-dc`.
- Conector A: Enchufe regional del adaptador incluido; conector B: Conector DC del fabricante; medidas exactas pendientes.
- Tipo: Alimentación; estándar/tensión: Adaptador incluido de 5 V DC / 2 A; nunca D-Tap directo..
- Longitud estimada: Fuente incluida; medir alcance hacia la toma del banco.
- Ruta candidata: Adaptador y cable incluidos en banco, separados del rig móvil. USB alternativo no activo hasta probar carga y conector.
- Alivio de tensión: Sujetar ambos extremos sin cargar los conectores; probar holgura y radio mínimo de curvatura.
- Riesgos: Una tensión incorrecta puede dañar el distribuidor.; La etiqueta USB de 5 V no valida una alimentación desde el gimbal.
- Obligatorio/opcional: Opcional; estado: Sólo banco; visualización: Cable.
- Cruce de movimiento: Dentro del mismo subconjunto; geometría: Esquema, no CAD de puertos.


### focus-rs4-to-lidar

- Producto/fuente: Focus Pro LiDAR.
- Origen: Puerto de transmisión/LiDAR RS 4 Pro; puerto `rs4-lidar`.
- Destino: Focus Pro LiDAR; puerto `lidar-data`.
- Conector A: Cable USB-C especificado por DJI; conector B: USB-C macho.
- Tipo: Datos/control; estándar/tensión: Alimentación/datos de accesorio DJI; seguir asignación de cable y puerto del manual..
- Longitud estimada: Cable de fábrica; longitud exacta por confirmar.
- Ruta candidata: Ruta superior delantera condicionada, con campo del objetivo despejado. No sustituir por USB genérico.
- Alivio de tensión: Sujetar ambos extremos sin cargar los conectores; probar holgura y radio mínimo de curvatura.
- Riesgos: El uso del mismo puerto RS por LiDAR y RavenEye necesita una topología aprobada.; No se demostró calibración de enfoque con SEL1635GM.
- Obligatorio/opcional: Opcional; estado: Condicionado; visualización: Cable.
- Cruce de movimiento: De puerto del gimbal a cámara; geometría: Esquema, no CAD de puertos.


### focus-rs4-to-motor

- Producto/fuente: Motor Focus Pro.
- Origen: Puerto de motor de enfoque RS; puerto `rs4-focus`.
- Destino: Focus Pro Motor; puerto `motor-usbc`.
- Conector A: Cable USB-C de motor DJI; conector B: USB-C macho.
- Tipo: Datos/control; estándar/tensión: Control/alimentación de motor DJI..
- Longitud estimada: Cable de fábrica; longitud exacta por confirmar.
- Ruta candidata: Ruta por varilla derecha condicionada a engrane y calibración; evitar el frente del objetivo.
- Alivio de tensión: Sujetar ambos extremos sin cargar los conectores; probar holgura y radio mínimo de curvatura.
- Riesgos: No afirmar calibración del enfoque electrónico sin pruebas.; Comprobar de nuevo después de mover varillas.
- Obligatorio/opcional: Opcional; estado: Condicionado; visualización: Cable.
- Cruce de movimiento: De puerto del gimbal a cámara; geometría: Esquema, no CAD de puertos.


### audio-rx-to-fx3

- Producto/fuente: Mic 2.
- Origen: Salida de 3.5 mm del receptor Mic 2; puerto `mic2-rx-out`.
- Destino: Entrada de micrófono de 3.5 mm de FX3; puerto `fx3-mic`.
- Conector A: TRS de 3.5 mm macho; conector B: TRS de 3.5 mm macho.
- Tipo: Datos/control; estándar/tensión: Audio analógico a nivel de micrófono de cámara..
- Longitud estimada: Cable de audio incluido; longitud exacta por confirmar.
- Ruta candidata: RX en zapata inclinada HawkLock 4770 -> OUT TRS -> MIC FX3, con el cable de cámara incluido. Bucle local sobre el lateral izquierdo; no cruza hacia la base fija del gimbal. Coordenadas y curva aproximadas; comprobar puertas, pinzamiento y barrido.
- Alivio de tensión: Sujetar ambos extremos sin cargar los conectores; probar holgura y radio mínimo de curvatura.
- Riesgos: Usar TRS para cámara, no TRRS de teléfono.; Verificar ganancia, modo estéreo/seguridad y medidor de grabación.; La masa del kit no es la del receptor; pesar por separado.
- Obligatorio/opcional: Obligatorio; estado: Candidato; visualización: Cable.
- Cruce de movimiento: Dentro del mismo subconjunto; geometría: Esquema, no CAD de puertos.


### audio-rx-to-xlrhandle

- Producto/fuente: Mic 2.
- Origen: Salida de 3.5 mm del receptor Mic 2; puerto `mic2-rx-out`.
- Destino: Entrada de 3.5 mm del XLR-H1; puerto `xlrh1-input3`.
- Conector A: TRS de 3.5 mm macho; conector B: TRS de 3.5 mm macho.
- Tipo: Datos/control; estándar/tensión: Audio analógico al asa Sony; confirmar canales 3/4..
- Longitud estimada: Cable de audio incluido; longitud exacta por confirmar.
- Ruta candidata: En estático o a mano: RX en zapata inclinada 4770 -> OUT TRS -> INPUT3 del XLR-H1, no a la entrada del cuerpo. Bucle local y acceso al asa por comprobar físicamente.
- Alivio de tensión: Sujetar ambos extremos sin cargar los conectores; probar holgura y radio mínimo de curvatura.
- Riesgos: No asumir grabación simultánea de entrada del cuerpo y del asa MI.; Comprobar asignación de canales y ganancia.
- Obligatorio/opcional: Obligatorio; estado: Candidato; visualización: Cable.
- Cruce de movimiento: Dentro del mismo subconjunto; geometría: Esquema, no CAD de puertos.


### audio-lav-to-tx

- Producto/fuente: Micrófono de solapa DJI.
- Origen: DJI Lavalier Mic; puerto `lav-mic`.
- Destino: Entrada de micrófono del transmisor Mic 2; puerto `mic2-tx-in`.
- Conector A: Cable integrado del micrófono; conector B: TRS de 3.5 mm macho.
- Tipo: Datos/control; estándar/tensión: Micrófono de solapa analógico, colocado en el participante..
- Longitud estimada: Cable de fábrica; longitud por confirmar.
- Ruta candidata: Ropa a transmisor, con sujeción de cable en la ropa; no conecta al rig. Enlace transmisor-receptor inalámbrico.
- Alivio de tensión: Sujetar ambos extremos sin cargar los conectores; probar holgura y radio mínimo de curvatura.
- Riesgos: Mantener cable del participante fuera del modelo de rig.; Grabar respaldo y sincronizar cuando haga falta.
- Obligatorio/opcional: Obligatorio; estado: Candidato; visualización: Cable.
- Cruce de movimiento: Dentro del mismo subconjunto; geometría: Esquema, no CAD de puertos.


### pwr-bg70-to-rs4

- Producto/fuente: BG70.
- Origen: Contactos eléctricos de BG70; puerto `bg70-contacts`.
- Destino: Interfaz de empuñadura RS 4 Pro; puerto `rs4-grip-contacts`.
- Conector A: Contactos de la empuñadura DJI; conector B: Contactos de la empuñadura DJI.
- Tipo: Alimentación; estándar/tensión: Alimentación integrada del fabricante, sin cable externo..
- Longitud estimada: Sin cable externo.
- Ruta candidata: Empuñadura colocada directamente bajo el cuerpo RS, sustituyendo la estándar.
- Alivio de tensión: Sin cable externo: comprobar bloqueo y contactos.
- Riesgos: No contar ambas empuñaduras instaladas.; Confirmar bloqueo antes de levantar.
- Obligatorio/opcional: Obligatorio; estado: Candidato; visualización: Contactos sin cable.
- Cruce de movimiento: Dentro del mismo subconjunto; geometría: Esquema, no CAD de puertos.


### pwr-raveneye-internal

- Producto/fuente: RavenEye.
- Origen: Batería interna Ronin Image Transmitter; puerto `raveneye-battery`.
- Destino: Ronin Image Transmitter; puerto `raveneye-internal`.
- Conector A: Batería interna; conector B: Circuito interno.
- Tipo: Alimentación; estándar/tensión: Batería interna para vídeo en banco; probar autonomía..
- Longitud estimada: Sin cable externo durante la prueba de vídeo en banco.
- Ruta candidata: Cargar antes de usar en banco. Comunicación/alimentación RS siguen siendo una función separada y condicionada.
- Alivio de tensión: Sin cable externo: no aplica alivio de tensión en este circuito interno.
- Riesgos: El vídeo en banco no demuestra integración ActiveTrack.; No inventar duplicador de puerto RS ni usar el hub LiDAR sin su sistema.
- Obligatorio/opcional: Opcional; estado: Sólo banco; visualización: Circuito interno.
- Cruce de movimiento: Dentro del mismo subconjunto; geometría: Esquema, no CAD de puertos.


### pwr-vmount-to-plate-contacts

- Producto/fuente: Placa V-mount.
- Origen: Contactos V-mount de VB99 Pro; puerto `vb99-vmount`.
- Destino: Contactos V-mount de 3203B; puerto `plate-vmount`.
- Conector A: Contactos de la batería V-mount; conector B: Contactos de la placa V-mount.
- Tipo: Alimentación; estándar/tensión: Batería de 14.54 V nominales; entrada de placa 11.0-16.8 V según manual..
- Longitud estimada: Sin cable.
- Ruta candidata: Interfaz V-mount directa y bloqueada; contactos ocultos con la batería asentada.
- Alivio de tensión: Sin cable externo: comprobar bloqueo y contactos.
- Riesgos: Apagar antes de retirar la batería. Comprobar limpieza de contactos.
- Obligatorio/opcional: Obligatorio; estado: Candidato; visualización: Contactos sin cable.
- Cruce de movimiento: Dentro del mismo subconjunto; geometría: internal_mating_interface.


### pwr-npf-to-smallhd-contacts

- Producto/fuente: Batería Sony NP-F970/PRO.
- Origen: Sony NP-F970/PRO elegida; puerto `npf970-contacts`.
- Destino: Placa serie L nativa del Indie 7; puerto `indie7-l-series`.
- Conector A: Contactos serie L de batería; conector B: Contactos de placa serie L.
- Tipo: Alimentación; estándar/tensión: 7.2 V nominales; terminales SmallHD 6.0–16.8 V, combinación candidata pendiente de ensayo..
- Longitud estimada: Sin cable externo: contactos directos de bahía.
- Ruta candidata: Batería en una bahía posterior del monitor; contacto directo, no línea que atraviesa gimbal.
- Alivio de tensión: No hay cable: comprobar seguro y asiento de batería.
- Riesgos: No conectar esta batería al barril DC de mínimo 10 V.; Monitor no carga baterías; requiere cargador externo específico.; Una batería de ~300 g; retención, corriente disponible y autonomía reales por probar.
- Obligatorio/opcional: Opcional; estado: Candidato; visualización: Contactos sin cable.
- Cruce de movimiento: local_to_monitor; geometría: contacts_only_not_port_CAD.


### pwr-npfz100-to-fx3-contacts

- Producto/fuente: Sony NP-FZ100.
- Origen: NP-FZ100 elegida; puerto `npfz100-contacts`.
- Destino: Compartimento nativo FX3; puerto `fx3-native-battery`.
- Conector A: Contactos nativos NP-FZ100; conector B: Alojamiento nativo NP-FZ100.
- Tipo: Alimentación; estándar/tensión: NP-FZ100 nativa documentada para FX3; 7.2 V nominales. Rango y pinout no publicados..
- Longitud estimada: No aplica: sin cable externo.
- Ruta candidata: Contacto directo interno; sin curva externa ni anclajes de cable inventados.
- Alivio de tensión: Sin cable. Comprobar palanca, cubierta bloqueada y acceso real con jaula.
- Riesgos: Apagar y comprobar lámpara de acceso antes de retirar batería.; No instalar junto con 4253B; ocupa el mismo compartimento.; Retención, ventilación y acceso con jaula requieren comprobación física.; 7.2 V nominales no definen pinout, rango de descarga ni autonomía.
- Obligatorio/opcional: Opcional; estado: Candidato; visualización: Contactos sin cable.
- Cruce de movimiento: internal_to_camera; geometría: contacts_only_no_external_route.


### pilot-pwr-npfz100-fx30

- Producto/fuente: Sony NP-FZ100.
- Origen: NP-FZ100 elegida; puerto `npfz100-contacts`.
- Destino: Compartimento nativo FX30; puerto `fx30-native-battery`.
- Conector A: Contactos nativos NP-FZ100; conector B: Alojamiento nativo NP-FZ100.
- Tipo: Alimentación; estándar/tensión: NP-FZ100 nativa documentada para FX30; 7.2 V nominales. Rango y pinout no publicados..
- Longitud estimada: No aplica: sin cable externo.
- Ruta candidata: Contacto directo interno en el alojamiento de batería; no dibujar una curva externa.
- Alivio de tensión: Sin cable. Comprobar palanca, cubierta y acceso con jaula según Sony.
- Riesgos: Apagar y comprobar la lámpara de acceso antes de retirar batería.; Comprobar retención, ventilación y acceso con la jaula instalada.; No convertir tensión nominal en rango ni usar esta ficha para un adaptador de batería.
- Obligatorio/opcional: Opcional; estado: Candidato; visualización: Contactos sin cable.
- Cruce de movimiento: internal_to_camera; geometría: contacts_only_no_external_route.


### vid-fx30-to-smallhd

- Producto/fuente: HDMI Kondor Blue.
- Origen: Única salida HDMI-A de FX30; puerto `fx30-hdmi-out`.
- Destino: Entrada HDMI del Indie 7; puerto `indie7-hdmi-in`.
- Conector A: HDMI tipo A macho; conector B: HDMI tipo A macho.
- Tipo: Vídeo; estándar/tensión: HDMI no RAW; Indie 7 hasta 4Kp30. Configurar salida 1080p y verificar frecuencia/color en el ejemplar..
- Longitud estimada: KB-FHDMI-12: 304.8–609.6 mm espiral a extendido; alcance útil y fuerza por medir.
- Ruta candidata: HDMI izquierdo de FX30 hacia monitor sobre NATO 4770/2906B. Bucle local para inclinación; no cruza una base fija ni tapa ventilación. Trazado ilustrativo, no longitud de corte.
- Alivio de tensión: Usar abrazadera suministrada de 4770 si asienta este conector sin forzar; proteger ambos extremos, dejar holgura para tilt y comprobar puertas/pantalla.
- Riesgos: Una sola salida HDMI de cámara: no añadir RavenEye directo en paralelo.; El cable admite más modos que el monitor; 4K60 o RAW no quedan autorizados.; Confirmar señal, firmware, color, frecuencia y tensión de espiral con el conjunto real.
- Obligatorio/opcional: Opcional; estado: Candidato; visualización: Cable.
- Cruce de movimiento: same_camera_core; geometría: Esquema, no CAD de puertos.


### audio-rx-to-fx30

- Producto/fuente: Mic 2.
- Origen: OUT TRS del RX Mic 2 DMR02; puerto `mic2-rx-out`.
- Destino: Entrada MIC de FX30; puerto `fx30-mic-in`.
- Conector A: TRS de 3.5 mm macho; conector B: TRS de 3.5 mm macho.
- Tipo: Datos/control; estándar/tensión: Audio analógico de cámara por TRS; nivel y ganancia reales por comprobar..
- Longitud estimada: Cable de cámara incluido en Mic 2; longitud exacta no publicada en las fuentes revisadas.
- Ruta candidata: RX sobre zapata 4770 → OUT TRS → MIC de FX30. Bucle local fuera de ventilación, puertas y HDMI. Coordenadas y curva aproximadas, sin cruzar gimbal.
- Alivio de tensión: Holgura suave en ambos conectores; no pinzar en puertas, pantalla o soporte de monitor. No fijar al participante.
- Riesgos: No confundir OUT con monitor de auriculares del RX ni MIC con auriculares de cámara.; Usar TRS, no TRRS. Ajustar niveles mirando medidores y revisar una grabación real.; La FX30 prioriza MIC externo sobre micrófono interno/asa; no son fuentes simultáneas.; TX y estuche fuera del rig. Audio S&Q y respaldo de TX no equivalen a audio grabado por cámara.
- Obligatorio/opcional: Opcional; estado: Candidato; visualización: Cable.
- Cruce de movimiento: same_camera_core; geometría: Esquema, no CAD de puertos.



## Puertos identificados

- `fx3-hdmi`: Salida HDMI / HDMI tipo A hembra; anclaje visual XYZ -65/-3/15 mm aproximado; [fuente](https://helpguide.sony.net/ilc/2210/v1/en/contents/TP1000886922.html).
- `fx3-usbc`: USB-C / control / USB-C hembra; anclaje visual XYZ -65/-21/-8 mm aproximado; [fuente](https://helpguide.sony.net/ilc/2210/v1/en/contents/TP1000886922.html).
- `fx3-mic`: Entrada de micrófono / TRS de 3.5 mm hembra; anclaje visual XYZ -65/20/-3 mm aproximado; [fuente](https://helpguide.sony.net/ilc/2210/v1/en/contents/TP1000886922.html).
- `fx3-battery`: Batería / 4253B / Compartimento NP-FZ100; anclaje visual XYZ 45/-39/-4 mm aproximado; [fuente](https://helpguide.sony.net/ilc/2210/v1/en/contents/TP1000886922.html).
- `rs4-rss`: RSS / control de cámara / USB-C hembra; anclaje visual XYZ 45/90/30 mm aproximado; [fuente](https://www.dji.com/rs-4-pro/specs).
- `rs4-lidar`: Transmisión de vídeo / LiDAR / USB-C hembra; sin pose habilitada; [fuente](https://www.dji.com/rs-4-pro/specs).
- `rs4-focus`: Motor de enfoque / USB-C hembra; sin pose habilitada; [fuente](https://www.dji.com/rs-4-pro/specs).
- `rs4-grip-contacts`: Interfaz de empuñadura / Contactos de empuñadura DJI; sin pose habilitada; [fuente](https://www.dji.com/rs-4-pro/specs).
- `bg70-contacts`: Alimentación de empuñadura / Contactos de empuñadura DJI; sin pose habilitada; [fuente](https://store.dji.com/product/dji-rs-bg70-high-capacity-battery-grip).
- `vb99-dtap`: Salida D-Tap / D-Tap hembra; anclaje visual XYZ -36.6/32/-5 mm aproximado; [fuente](https://www.smallrig.com/smallrig-VB99-Pro-mini-V-Mount-Battery-4292.html?sku=4292).
- `vb99-vmount`: Alimentación V-mount / Contactos V-mount; sin pose habilitada; [fuente](https://www.smallrig.com/smallrig-VB99-Pro-mini-V-Mount-Battery-4292.html?sku=4292).
- `plate-vmount`: Entrada V-mount / Contactos V-mount; sin pose habilitada; [fuente](https://www.smallrig.com/jp/Advanced-V-Mount-Battery-Mount-Plate-with-Dual-15mm-Rod-Clamp-3203B.html).
- `plate-dtap`: Salida D-Tap / D-Tap hembra; anclaje visual XYZ -54/-48/0 mm aproximado; [fuente](https://static.smallrig.com/mall/img/public/1714289722871_.pdf).
- `indie7-hdmi-in`: J / entrada HDMI / HDMI tipo A hembra; anclaje visual XYZ 70/-49/16.75 mm aproximado; [fuente](https://guide.smallhd.com/a/1634747-indie-7-quick-start-guide).
- `indie7-hdmi-out`: K / salida HDMI / HDMI tipo A hembra; anclaje visual XYZ 48/-49/16.75 mm aproximado; [fuente](https://guide.smallhd.com/a/1634747-indie-7-quick-start-guide).
- `indie7-dc`: I / entrada DC / Barril DC del fabricante; cable de 5.5 mm de diámetro exterior; anclaje visual XYZ -28/-55/16.75 mm aproximado; [fuente](https://smallhd.com/products/indie-7).
- `splitter-captive-input`: Entrada HDMI de cable cautivo / Cable integrado con HDMI tipo A macho; sin pose habilitada; [fuente](https://media.startech.com/cms/pdfs/st122hd4ku_datasheet.pdf).
- `splitter-output1`: Salida HDMI 1 / HDMI tipo A hembra; sin pose habilitada; [fuente](https://media.startech.com/cms/pdfs/st122hd4ku_datasheet.pdf).
- `splitter-output2`: Salida HDMI 2 / HDMI tipo A hembra; sin pose habilitada; [fuente](https://media.startech.com/cms/pdfs/st122hd4ku_datasheet.pdf).
- `splitter-dc`: Entrada DC de 5 V / Barril DC del fabricante, medidas pendientes; sin pose habilitada; [fuente](https://media.startech.com/cms/pdfs/st122hd4ku_datasheet.pdf).
- `startech-adapter`: Adaptador de corriente incluido / Fuente del fabricante de 5 V / 2 A; sin pose habilitada; [fuente](https://media.startech.com/cms/pdfs/st122hd4ku_datasheet.pdf).
- `raveneye-hdmi`: Entrada Mini HDMI / HDMI tipo C hembra; sin pose habilitada; [fuente](https://www.dji.com/rs-4-pro/specs).
- `raveneye-battery`: Batería interna / Interno; sin pose habilitada; [fuente](https://www.dji.com/rs-4-pro/specs).
- `raveneye-internal`: Alimentación interna / Interno; sin pose habilitada; [fuente](https://www.dji.com/rs-4-pro/specs).
- `lidar-data`: Datos / alimentación / USB-C CVBS/CAN; sin pose habilitada; [fuente](https://www.dji.com/focus-pro/specs).
- `motor-usbc`: Control / alimentación de motor / USB-C DJI; sin pose habilitada; [fuente](https://www.dji.com/focus-pro/specs).
- `mic2-rx-out`: Receptor / salida / TRS de 3.5 mm hembra; anclaje visual XYZ -27.1/0/-6 mm aproximado; [fuente](https://dl.djicdn.com/downloads/DJI_Mic_2/20240426/UM/DJI_Mic_2_User_Manual_V1.2_EN.pdf).
- `mic2-tx-in`: Transmisor / entrada de micrófono / TRS de 3.5 mm hembra; sin pose habilitada; [fuente](https://www.dji.com/mic-2/specs).
- `lav-mic`: Micrófono de solapa / Cable integrado; sin pose habilitada; [fuente](https://store.dji.com/product/dji-lavalier-mic).
- `xlrh1-input3`: Entrada 3 / TRS de 3.5 mm hembra; sin pose habilitada; [fuente](https://electronics.sony.com/imaging/imaging-accessories/imaging-compact-camera-accessories/p/xlrh1).
- `npf970-contacts`: Contactos de batería serie L / Contactos serie L de batería; anclaje visual XYZ 0/-35.4/-30 mm aproximado; [fuente](https://www.sony.jp/products/catalog/SPC_NP-F970_PRO.pdf).
- `indie7-l-series`: Placa serie L incluida / una bahía / Contactos de placa serie L; anclaje visual XYZ 26/-17.4/16.75 mm aproximado; [fuente](https://smallhd.com/products/indie-7).
- `fx30-hdmi-out`: Salida HDMI FX30 / HDMI-A; anclaje visual XYZ -65/2/-19 mm aproximado; [fuente](https://helpguide.sony.net/ilc/2220/v1/en/print.pdf).
- `fx30-usb-c`: USB-C / USB-C; sin pose habilitada; [fuente](https://www.sony.jp/pro-cam/products/ILME-FX30/spec.html).
- `fx30-multi-usb`: Multi/Micro USB / Multi/Micro USB; sin pose habilitada; [fuente](https://www.sony.jp/pro-cam/products/ILME-FX30/spec.html).
- `fx30-mic-in`: 3.5 mm stereo minijack / 3.5 mm stereo minijack; anclaje visual XYZ -65/26/-4 mm aproximado; [fuente](https://helpguide.sony.net/ilc/2220/v1/en/print.pdf).
- `fx30-headphones`: 3.5 mm stereo minijack / 3.5 mm stereo minijack; sin pose habilitada; [fuente](https://www.sony.jp/pro-cam/products/ILME-FX30/spec.html).
- `fx30-multi-interface-shoe`: Sony Multi Interface Shoe / Sony Multi Interface Shoe; sin pose habilitada; [fuente](https://www.sony.jp/pro-cam/products/ILME-FX30/spec.html).
- `fx3-native-battery`: Compartimento nativo FX3 / Alojamiento nativo NP-FZ100; sin pose habilitada; [fuente](https://helpguide.sony.net/ilc/2210/v1/en/contents/TP1000886922.html).
- `fx30-native-battery`: Compartimento nativo FX30 / Alojamiento nativo NP-FZ100; sin pose habilitada; [fuente](https://helpguide.sony.net/ilc/2220/v1/en/print.pdf).
- `npfz100-contacts`: Contactos NP-FZ100 / Contactos nativos NP-FZ100; sin pose habilitada; [fuente](https://electronics.sony.com/imaging/imaging-accessories/interchangeable-lens-camera-accessories/p/npfz100?sku=npfz100).

## Lógica ensamblada

- La alimentación mediante adaptador NP-FZ100 queda en el conjunto móvil de cámara y varillas.
- HDMI y alimentación del monitor cruzan de móvil a fijo. Medir bucles y recorrido permitido; no prometer rotación ilimitada.
- BG70 se alimenta por contactos de empuñadura. Receptor/TRS y micrófono de solapa quedan locales a cámara o participante.
- Doble HDMI reservado a banco hasta validar montaje, alimentación, EDID y movimiento.

## Lógica en despiece

- Apagar todos los aparatos antes de desconectar alimentación.
- Desconectar los cables móvil-fijo antes de liberar la placa de cámara.
- Las líneas discontinuas del despiece representan vínculos lógicos, no cables conectados que se estiran.
- Conservar varillas/batería como subconjunto, salvo que la extracción de cámara exija desatornillar la pila.

El trazado superpuesto 3D es una anotación de topología, no cable físico para cortar ni una prueba de colisión. Contactos e internos no se dibujan como cables. Aparatos sin pose siguen en el esquema 2D.
