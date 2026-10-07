# Plan de distribución física

Canónico: `data/layout-manifest.json`. X derecha de cámara; Y arriba; Z lente hacia delante. Origen: centro nominal de envolvente FX3, no datum de fabricación. **Todas las poses son aproximadas.**

Plan de ingeniería, no montaje certificado. Medidas publicadas no prueban forma exacta, enganche de tornillos, equilibrio, rigidez, holguras ni compatibilidad de toda la pila. Fotos y geometría aproximada no son CAD calibrado.

Varillas: 15 mm de diámetro, 203.2 mm de largo, 60 mm entre centros según el manual 1674. No barras ficticias de 410 mm. 3203B: abrazadera al borde superior documentada en la página 5 del manual, placa bajo las varillas; barrido del giro horizontal pendiente.

## Cadenas alternativas de monitor

### NATO lateral RS / 3026B

Ruta `gimbal`; posiciones ilustrativas, no asiento verificado.



### NATO superior 4770 / 2906B

Ruta `cage`; posiciones ilustrativas, no asiento verificado.

- Indie 7: posición -18 / 161.35 / 6 mm; soporte Soporte NATO de monitor 2906B; carga moving.
- Batería Sony NP-F970/PRO: posición 8 / 179.35 / 52.75 mm; soporte heredado; carga moving.

### XLR-H1 / 4830 / 2906B

Ruta `xlr`; posiciones ilustrativas, no asiento verificado.

- Soporte NATO de monitor 2906B: posición 0 / 134.4 / -25 mm; soporte Extensión y riel XLR 4830; carga heredada.
- Indie 7: posición 0 / 220.6 / -25 mm; soporte Soporte NATO de monitor 2906B; carga moving.
- Batería Sony NP-F970/PRO: posición 26 / 238.6 / 21.75 mm; soporte heredado; carga moving.

En gimbal conservar 3026B lateral fijo. A mano/estática usar 2906B sobre NATO 4770 sin XLR, o kit 4830 sobre XLR-H1 si el asa está elegida. No ocupar simultáneamente el riel superior 4770 y la interfaz XLR. Cada pieza se añade sólo por elección del usuario. NP-F970/PRO elegida alimenta el monitor en su placa nativa incluida, sin cable al barril.

## Sony FX3

- Posición candidata XYZ: 0 / 0 / 0 mm; rotación XYZ: 0 / 0 / 0 grados.
- Envolvente XYZ: 129.7 / 77.8 / 84.5 mm; estado: Medidas exteriores publicadas. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: Carga móvil; soporte candidato: Jaula HawkLock.
- Colocación: Cuerpo centrado, horizontal por defecto; conexiones del lado izquierdo despejadas.
- Orientación: Eje del objetivo +Z; conexiones en -X.
- Montaje: Fijación antitorsión a la jaula; base debajo.
- Motivo: Reducir el desplazamiento respecto a los ejes de balance de inclinación y rotación.
- Rechazado: Gran desplazamiento lateral: reduce la holgura del brazo.
- [Referencia de medidas](https://helpguide.sony.net/ilc/2210/v1/en/contents/TP1000886922.html)

## 16-35 mm GM

- Posición candidata XYZ: 0 / 0 / 103.05 mm; rotación XYZ: 0 / 0 / 0 grados.
- Envolvente XYZ: 88.5 / 88.5 / 121.6 mm; estado: Medidas exteriores publicadas. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: Carga móvil; soporte candidato: FX3.
- Colocación: Parte posterior del objetivo junto al frente nominal del cuerpo; referencia de montura/sensor aproximada.
- Orientación: Eje óptico +Z.
- Montaje: Montura Sony E.
- Motivo: Mantener objetivo y cuerpo coaxiales.
- Rechazado: Subir el objetivo en modo vertical no representa una rotación real de la cámara.
- [Referencia de medidas](https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel1635gm)

## Jaula HawkLock 4770

- Posición candidata XYZ: 0 / 0 / 0 mm; rotación XYZ: 0 / 0 / 0 grados.
- Envolvente XYZ: 160 / 101.2 / 66.2 mm; estado: Medidas exteriores publicadas. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: Carga móvil; soporte candidato: Base 1674.
- Colocación: Alrededor del cuerpo, con acceso a las conexiones izquierdas.
- Orientación: Misma orientación que la cámara.
- Montaje: Jaula en U, dos tornillos de cámara 1/4-20 y abrazadera HDMI izquierda. Riel NATO superior desmontable y zapata inclinada en esquina superior izquierda, manual página 4, llamada 5.
- Motivo: Sujeción del cable y núcleo antitorsión.
- Rechazado: Herrajes superiores adicionales en gimbal: altura innecesaria.
- [Referencia de medidas](https://static.smallrig.com/mall/img/public/1725874097334_.pdf)

## Base 1674

- Posición candidata XYZ: 0 / -65 / 0 mm; rotación XYZ: 0 / 0 / 0 grados.
- Envolvente XYZ: 80 / 26 / 80 mm; estado: Medidas exteriores publicadas. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: Carga móvil; soporte candidato: RS 4 Pro.
- Colocación: Inmediatamente debajo de la jaula.
- Orientación: Abrazaderas de varillas paralelas al eje óptico.
- Montaje: Tornillo bajo la jaula; comprobar retención y longitud efectiva de rosca.
- Motivo: Soporte bajo del conjunto.
- Rechazado: No se ha verificado que HawkLock libere por sí solo una base 1674 atornillada.
- [Referencia de medidas](https://static.smallrig.com/mall/img/public/vcqnxceuxol-1747621696364_.pdf)

## Varillas de 15 mm / 8 pulgadas

- Posición candidata XYZ: 0 / -66 / -4 mm; rotación XYZ: 0 / 0 / 0 grados.
- Envolvente XYZ: 75 / 15 / 203.2 mm; estado: Medidas exteriores publicadas. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: Carga móvil; soporte candidato: Base 1674.
- Colocación: Varillas cortas con prioridad trasera para base y batería; no garantizan soporte frontal del parasol.
- Orientación: Paralelas a +Z; 203.2 mm de largo y 15 mm de diámetro.
- Montaje: Abrazaderas dobles 1674 y 3203B; separación nominal LWS, conjunto real por medir.
- Motivo: No usar barras ficticias de 410 mm.
- Rechazado: Afirmar que el par de 8 pulgadas alcanza a la vez parasol frontal y batería trasera sin medir.
- [Referencia de medidas](https://www.smallrig.com/15mm-Carbon-Fiber-Rods-Pair.html)

## Parasol Star-Trail VND

- Posición candidata XYZ: 0 / 0 / 180 mm; rotación XYZ: 0 / 0 / 0 grados.
- Envolvente XYZ: 156 / 116 / 32 mm; estado: Medidas aproximadas. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: Carga móvil; soporte candidato: 16-35 mm GM.
- Colocación: Coaxial al frente del objetivo, con bandera plegada a un ángulo seguro.
- Orientación: Parasol hacia delante; envolvente de holgura no certificada.
- Montaje: Aro incluido 82-95 mm; montaje al objetivo candidato, soporte de varillas condicionado.
- Motivo: Conservar el kit solicitado sin alargar arbitrariamente las varillas.
- Rechazado: Bandera alta o soporte frontal forzado sin alcance suficiente de varillas.
- [Referencia de medidas](https://www.smallrig.com/global/SmallRig-Multifunctional-Modular-Matte-Box-95mm-VND-Kit-3645.html)

## Placa V-mount 3203B

- Posición candidata XYZ: 0 / -138.35 / -70 mm; rotación XYZ: 0 / 0 / 0 grados.
- Envolvente XYZ: 108 / 168.7 / 33 mm; estado: Medidas exteriores publicadas. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: Carga móvil; soporte candidato: Varillas de 8 pulgadas.
- Colocación: Bajo las varillas traseras, cerca de la jaula; abrazadera superior documentada en manual oficial, página 5. Posición aproximada.
- Orientación: Placa bajo el plano de varillas y cara V-mount hacia atrás (-Z). Medir desplazamiento de abrazadera y reparto dimensional. La ubicación visual de abrazadera y orificios dentro de la envolvente publicada es aproximada, no una cota exacta.
- Montaje: Abrazadera doble de 15 mm incluida atornillada al borde superior, manual oficial página 5, diagrama izquierdo; placa bajo varillas y batería sobre la cara posterior.
- Motivo: Evitar batería elevada o palanca trasera excesiva.
- Rechazado: Abrazadera inferior eleva la placa sobre varillas. Posición muy trasera añade inercia. Holgura del motor de giro no certificada.
- [Referencia de medidas](https://www.smallrig.com/jp/Advanced-V-Mount-Battery-Mount-Plate-with-Dual-15mm-Rod-Clamp-3203B.html)

## VB99 Pro

- Posición candidata XYZ: 0 / -149.35 / -114.1 mm; rotación XYZ: 0 / 0 / 0 grados.
- Envolvente XYZ: 73.2 / 107.2 / 55.2 mm; estado: Medidas exteriores publicadas. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: Carga móvil; soporte candidato: Placa V-mount.
- Colocación: Bloqueada directamente en la placa baja trasera; centro nominal de envolvente a 114.1 mm detrás del origen del cuerpo. Posición candidata próxima, no CG medido ni prueba de barrido de motores.
- Orientación: Cara de batería vertical y salidas accesibles.
- Montaje: Bloqueo V-mount en 3203B.
- Motivo: Mantener la batería bajo las varillas con abrazadera superior documentada, no sobre el eje de rotación.
- Rechazado: Batería elevada detrás del asa superior.
- [Referencia de medidas](https://static.smallrig.com/mall/img/public/1730100759046_.pdf)

## DJI RS 4 Pro

- Posición candidata XYZ: 0 / -155 / -25 mm; rotación XYZ: 0 / 0 / 0 grados.
- Envolvente XYZ: 201.9 / 415 / 267.8 mm; estado: Medidas aproximadas. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: Carga fija; soporte candidato: raíz/sujeción externa no modelada.
- Colocación: Representación estructural aproximada del gimbal; 201.9 de ancho × 415 de alto × 267.8 de fondo describen el conjunto estándar, NO los ejes internos ni el rig con BG70.
- Orientación: Las formas de brazos y ejes son aproximaciones visuales.
- Montaje: Placas de liberación rápida DJI; compatibilidad de la pila de bases pendiente de prueba física.
- Motivo: Zonas de motores y manos como comprobaciones medibles antes de uso.
- Rechazado: Tratar la carga nominal como garantía de encaje.
- [Referencia de medidas](https://www.dji.com/rs-4-pro/specs)

## Empuñadura BG70

- Posición candidata XYZ: 0 / -265 / -25 mm; rotación XYZ: 0 / 0 / 0 grados.
- Envolvente XYZ: 43 / 165 / 43 mm; estado: Medidas aproximadas. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: Carga fija; soporte candidato: RS 4 Pro.
- Colocación: Debajo del cuerpo RS; conservar libre la zona de agarre.
- Orientación: Vertical, debajo de la carcasa de giro horizontal.
- Montaje: Interfaz de empuñadura DJI; sustituye BG30.
- Motivo: Alimentación principal del gimbal independiente de V-mount.
- Rechazado: Contar BG30 y BG70 como dos empuñaduras instaladas.
- [Referencia de medidas](https://store.dji.com/product/dji-rs-bg70-high-capacity-battery-grip)

## Soporte NATO 3026B

- Posición candidata XYZ: -119 / -134 / -25 mm; rotación XYZ: 0 / 0 / 0 grados.
- Envolvente XYZ: 152.6 / 38 / 54.8 mm; estado: Medidas exteriores publicadas. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: Carga fija; soporte candidato: RS 4 Pro.
- Colocación: Soporte lateral corto fuera de la cámara; coordenadas de riel/cabezal por medir. Cadena candidata conservada en rigs propios verticales: el NATO lateral fijo no gira con la plataforma de cámara. Medir holguras y manos en ambos encuadres.
- Orientación: Soporte nativo de 152.6 mm hacia la izquierda del operador, sin brazo extra. Articulación y tornillo con coordenadas aproximadas.
- Montaje: Abrazadera NATO en riel lateral fijo RS; cabezal nativo inclinable con tornillo 1/4-20. Inclinación publicada de 170 grados; verificar orientación con la rosca real del Indie 7.
- Motivo: Monitor fuera de la carga móvil de cámara.
- Rechazado: Monitor sobre cámara o brazo largo inventado.
- [Referencia de medidas](https://static.smallrig.com/mall/img/public/m1twezvd88j-1751250182064_.pdf)

## SmallHD Indie 7

- Posición candidata XYZ: -185 / -205 / -25 mm; rotación XYZ: 0 / 0 / 180 grados.
- Envolvente XYZ: 180.1 / 118.6 / 33.5 mm; estado: Medidas exteriores publicadas. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: Carga fija; soporte candidato: Soporte lateral 3026B.
- Colocación: Fuera de cámara, a la izquierda del operador. Posición candidata, no prueba de holgura de todos los ejes.
- Orientación: Monitor bajo el cabezal nativo 3026B, invertido para que la rosca inferior 1/4-20 mire hacia arriba, según ejemplos del fabricante. Verificar inversión de imagen y lectura.
- Montaje: Rosca inferior 1/4-20 del Indie 7 al tornillo del cabezal 3026B orientado hacia abajo; no se inventa una rosca superior.
- Motivo: Monitor fuera de cámara móvil, con visualización directa.
- Rechazado: Monitor flotante sin soporte o bloqueando la empuñadura.
- [Referencia de medidas](https://www.bhphotovideo.com/c/product/1593398-REG/smallhd_mon_indie_7_indie_7_touchscreen_on_camera.html)

## DJI Mic 2 / receptor RX

- Posición candidata XYZ: -64.247 / 58.191 / 8 mm; rotación XYZ: 0 / 0 / -25 grados.
- Envolvente XYZ: 54.2 / 22.49 / 28.36 mm; estado: Medidas exteriores publicadas. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: Carga móvil; soporte candidato: Jaula HawkLock.
- Colocación: Esquina superior izquierda de la jaula. Sólo RX; TX, lavalier y estuche permanecen fuera de cámara. Posición aproximada desde el punto candidato de zapata.
- Orientación: Pantalla hacia el operador y hacia arriba, paralela a la zapata inclinada. Ángulo -25 grados ilustrativo, no medición del fabricante. En vertical gira con la jaula y mantiene el vínculo de soporte.
- Montaje: Zapata integrada DMR02 en zapata inclinada 4770, sin brazo ni adaptador adicional. Interfaces documentadas; asiento y retención reales por comprobar.
- Motivo: Representar el audio elegido usando una interfaz existente documentada. Se cuentan 28 g publicados del RX, nunca el kit completo.
- Rechazado: RX flotante, transmisores/estuche en cámara, adaptador MI no elegido, zapata tratada como alimentación y ángulo presentado como cota exacta.
- [Referencia de medidas](https://www.dji.com/mic-2/specs)

## Sony XLR-H1

- Posición candidata XYZ: 0 / 83 / 6 mm; rotación XYZ: 0 / 0 / 0 grados.
- Envolvente XYZ: 65 / 78 / 128 mm; estado: Medidas aproximadas. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: Carga móvil; soporte candidato: FX3.
- Colocación: Sólo cámara a mano o configuración estática por defecto.
- Orientación: Asa longitudinal sobre cámara.
- Montaje: Zapata MI y tornillos Sony; comprobar retirada del riel superior de jaula.
- Motivo: Manejo de audio sin masa superior adicional en gimbal.
- Rechazado: Asa superior activa por defecto en gimbal.
- [Referencia de medidas](https://electronics.sony.com/imaging/imaging-accessories/imaging-compact-camera-accessories/p/xlrh1)

## 2906B

- Posición candidata XYZ: -18 / 75.15 / 6 mm; rotación XYZ: 0 / 0 / 0 grados.
- Envolvente XYZ: 52.6 / 53.8 / 36 mm; estado: Medidas exteriores publicadas. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: Carga móvil; soporte candidato: Jaula HawkLock.
- Colocación: Posición candidata aproximada; comprobar asiento, manos y acceso a conexiones.
- Orientación: Orientación de visualización aproximada, no transformación de montaje medida.
- Montaje: Abrazadera NATO sobre riel superior 4770 sin XLR, o riel del kit 4830 sobre XLR-H1. Tornillo superior 1/4-20 a rosca inferior del Indie 7.
- Motivo: Monitor sobre núcleo a mano o estático; no sustituye 3026B lateral en gimbal.
- Rechazado: Montaje flotante, adaptación no elegida y extrapolación de cotas de tornillos.
- [Referencia de medidas](https://static.smallrig.com/mall/img/public/0g141qmktenu-1751249917074_.pdf)

## 4830

- Posición candidata XYZ: 0 / 92 / -42 mm; rotación XYZ: 0 / 0 / 0 grados.
- Envolvente XYZ: 55.8 / 77.5 / 124.8 mm; estado: Medidas exteriores publicadas. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: Carga móvil; soporte candidato: XLR-H1.
- Colocación: Posición candidata aproximada; comprobar asiento, manos y acceso a conexiones.
- Orientación: Orientación de visualización aproximada, no transformación de montaje medida.
- Montaje: Extensión, pieza de bloqueo y riel NATO nativos sobre XLR-H1; seguir montaje del manual página 8. Retirar riel superior desmontable de 4770 antes de instalar XLR.
- Motivo: Proporcionar riel de monitor cuando el asa Sony ocupa el techo de cámara.
- Rechazado: Montaje flotante, adaptación no elegida y extrapolación de cotas de tornillos.
- [Referencia de medidas](https://static.smallrig.com/mall/img/public/1725874097334_.pdf)

## NP-F970/PRO

- Posición candidata XYZ: -211 / -223 / 21.75 mm; rotación XYZ: 0 / 0 / 180 grados.
- Envolvente XYZ: 38.4 / 70.8 / 60 mm; estado: Medidas aproximadas. Una envolvente publicada no verifica los detalles internos.
- Dominio de carga: Carga fija; soporte candidato: Indie 7.
- Colocación: Posición candidata aproximada; comprobar asiento, manos y acceso a conexiones.
- Orientación: Orientación de visualización aproximada, no transformación de montaje medida.
- Montaje: Un paquete serie L en una de las dos bahías de la placa nativa incluida del Indie 7. Sin adaptador D-Tap ni cable a barril.
- Motivo: Alimentación autónoma del monitor, también en gimbal vertical.
- Rechazado: Montaje flotante, adaptación no elegida y extrapolación de cotas de tornillos.
- [Referencia de medidas](https://www.sony.jp/products/catalog/SPC_NP-F970_PRO.pdf)


## Componentes sin montaje 3D habilitado

- Distribuidor StarTech: banco con fuente incluida; soporte dinámico no verificado. 620 mm es producto con cable cautivo, no largo del cuerpo.
- RavenEye: banco, HDMI Mini-C; batería interna. No montaje ni ActiveTrack operativos prometidos.
- LiDAR/motor: inventario condicional; calibración de SEL1635GM y fijación/barrido pendientes.
- Interfaz Focus Pro a Transmission: estacionada; falta el sistema DJI Transmission. No se sustituye por una interfaz de otro modelo.
- Mic 2: sólo RX de 28 g modelado en la zapata inclinada 4770 como candidato. Estuche/TX fuera de cámara. La selección sin jaula permanece pendiente; no se añade el soporte sin autorización.

## Distribución de masa

- Documental / solo: 3.25 kg de piezas móviles modeladas.
- Comercial / contenido de marca: 3.22 kg de piezas móviles modeladas.
- A mano / extracción: 1.85 kg de piezas móviles modeladas.
- Esencial / menor presupuesto: 1.55 kg de piezas móviles modeladas.
- Vertical / 9:16: 1.55 kg de piezas móviles modeladas.
- Entrevista corporativa: 1.85 kg de piezas móviles modeladas.
- Cine / narrativa: 3.25 kg de piezas móviles modeladas.

Incluye masas de planificación aproximadas, especialmente varillas y parasol, y 28 g publicados del RX Mic 2 cuando está activo. Excluye cables, TX, estuche, tarjetas y tornillos adicionales. Monitor lateral fijo fuera de carga móvil en gimbal; monitor sobre jaula/asa y batería elegida incluidos en el núcleo a mano/estático. No sumar BG30 estándar al BG70 ni el Combo entero a sus subcomponentes. Peso total llevado y centro de gravedad reales no medidos.

3026B: límite publicado 1.5 kg; monitor 737 g de planificación conservadora, más NP-F970/PRO ~300 g si se elige. SmallHD publica masa inferior discrepante; pesar equipo real. La comparación escalar no prueba rigidez, par ni seguridad dinámica.

## Pruebas de liberación

### Receptor Mic 2 y zapata HawkLock

Verificar asiento y retención del RX en la zapata inclinada 4770, acceso a MIC/HDMI, pantalla y holgura en todos los ejes con motores apagados. Pesar el cable TRS y rebalancear con RX instalado; no inferir holgura por los 28 g publicados.

Estado: Prueba física pendiente.

### Batería y recorrido de motores

Abrazadera superior 3203B documentada en manual, página 5. Placa bajo varillas cerca del motor de giro. Con motores apagados, medir la holgura mínima en extremos de inclinación/rotación. No operar hasta superar la prueba.

Estado: Prueba física pendiente.

### Espacio para las manos

Gimbal: ajustar monitor en 3026B, sin obstaculizar empuñadura. A mano/estático: medir acceso al asa y mandos con 2906B, incluyendo 4830 si hay XLR-H1. Usar guantes sin tocar pantalla, batería ni soporte; no se da por validado por la pose.

Estado: Prueba física pendiente.

### Cables entre partes móviles y fijas

En gimbal HDMI y D-Tap cruzan de móvil a fijo y requieren bucles medidos; batería serie L no añade cable de potencia. A mano/estático ambos extremos HDMI/D-Tap siguen el núcleo y deben dejar holgura para monitor y agarre. No se promete giro ilimitado.

Estado: Prueba física pendiente.

### Interfaz de extracción

1674 está atornillada. HawkLock no garantiza extracción de cámara por sí sola a través de la pila. Desconectar todos los cables que cruzan partes móviles/fijas, liberar la placa DJI y retirar las varillas si hace falta.

Estado: Prueba física pendiente.

### Doble salida HDMI

StarTech y RavenEye quedan en reserva para gimbal. Circuito completo de banco hasta verificar soporte, alimentación de 5 V y negociación EDID.

Estado: Condicionado.

### Calibración LiDAR y objetivo

No se ha demostrado calibración del motor con SEL1635GM. Sensor/motor Focus Pro y hub Transmission se conservan en inventario, sin simularlos operativos.

Estado: Condicionado.
