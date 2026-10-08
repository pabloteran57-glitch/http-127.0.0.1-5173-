# Manifiesto verificado de piezas

Generado desde `data/parts-manifest.json`. Auditoría 2026-10-06. 25 productos solicitados y 2 componentes del Combo conservados, más 3 accesorios de monitor y 3 altas acotadas del piloto FX30: 33 entradas.

Plan de ingeniería, no montaje certificado. Medidas publicadas no prueban forma exacta, enganche de tornillos, equilibrio, rigidez, holguras ni compatibilidad de toda la pila. Fotos y geometría aproximada no son CAD calibrado.

## RS 4 Pro

- ID: `dji-rs4-pro-combo`
- Nombre oficial del fabricante: DJI RS 4 Pro Combo.
- Modelo: No publicado; fabricante: DJI; categoría: Kit de estabilizador.
- Medidas publicadas L/W/H: 267.8 / 201.9 / 415 mm. Aproximadas/incompletas: no.
- Nota de dimensiones: DJI: largo × ancho × alto desplegado con empuñadura ESTÁNDAR; excluye cámara y trípode. No corresponde al conjunto instalado con BG70.
- Masa publicada: 1843 g. Aproximada: sí.
- Nota de masa: Suma de componentes nominales aproximados de DJI: gimbal 1242 g + BG30 265 g + placas 110 g + trípode 226 g. NO es el peso del rig instalado con BG70.
- Fuente de masa: [DJI](https://www.dji.com/rs-4-pro/specs).
- Masa de planificación: 1843 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: USB-C de carga; USB-C RSS de control de cámara; USB-C de motor de enfoque; USB-C de transmisión de vídeo/LiDAR; Interfaces de expansión RSA/NATO; Orificio de montaje 1/4"-20; Zapata sin contactos; Bluetooth 5.1
- Montaje: Plataforma estructural principal; la cámara se fija a la placa de liberación rápida DJI y a los ejes del gimbal.
- Material: Aleación de aluminio, brazos de eje de fibra de carbono y plásticos técnicos
- Obligatorio/opcional: Obligatorio; función: Estabilización principal e interfaz de control.
- Restricciones: Carga nominal de 4.5 kg; el conjunto móvil debe mantenerse por debajo con margen para la resistencia del cableado.; Los accesorios deben conservar holgura con los motores de giro horizontal, inclinación y rotación.; El Combo incluye Ronin Image Transmitter y Focus Pro Motor.
- Confianza: Alta.
- [Fuente principal](https://www.dji.com/rs-4-pro/specs); [fuente secundaria](https://store.dji.com/product/dji-rs-4-pro-combo)

## BG70

- ID: `dji-rs-bg70`
- Nombre oficial del fabricante: DJI RS BG70 High-Capacity Battery Grip.
- Modelo: No publicado; fabricante: DJI; categoría: Alimentación del estabilizador.
- Medidas publicadas L/W/H: pendiente / pendiente / pendiente mm. Aproximadas/incompletas: sí.
- Nota de dimensiones: Las fuentes oficiales consultadas publican capacidad y tensión, pero no la envolvente física.
- Masa publicada: pendiente g. Aproximada: sí.
- Nota de masa: Las fuentes oficiales consultadas no publican la masa de esta unidad.
- Fuente de masa: [DJI](https://store.dji.com/product/dji-rs-bg70-high-capacity-battery-grip).
- Masa de planificación: pendiente g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Interfaz de empuñadura con el cuerpo RS; Salida USB-C inferior de hasta 18 W; Entrada USB-C de carga
- Montaje: Sustituye la empuñadura de batería estándar en la parte inferior del gimbal.
- Material: Plástico técnico y batería interna de ion-litio
- Obligatorio/opcional: Obligatorio; función: Alimentación principal de autonomía ampliada para el gimbal.
- Restricciones: Según DJI, permite alimentar el RS 4 Pro hasta 29 horas.; La salida USB-C inferior de 18 W sirve para accesorios ligeros; no sustituye de forma directa la alimentación V-mount prevista para cámara y monitor.
- Confianza: Media.
- [Fuente principal](https://store.dji.com/product/dji-rs-bg70-high-capacity-battery-grip)

## FX3

- ID: `sony-fx3`
- Nombre oficial del fabricante: Sony FX3 Full-Frame Cinema Line Camera.
- Modelo: ILME-FX3; fabricante: Sony; categoría: Cuerpo de cámara.
- Medidas publicadas L/W/H: 129.7 / 77.8 / 84.5 mm. Aproximadas/incompletas: sí.
- Nota de dimensiones: Sony: ancho × alto × fondo = 129.7 × 77.8 × 84.5 mm. Los nombres históricos de los campos no representan los ejes de la escena; consultar layout-manifest.json. Sony considera estas medidas aproximadas y excluye salientes.
- Masa publicada: 630 g. Aproximada: sí.
- Nota de masa: Sony US, ILME-FX3, sección de tamaño y peso: 630 g cuerpo solo; 715 g con batería/tarjeta. Corrige 640 g no sustentados por la guía enlazada, que sólo publica 715 g con batería/tarjeta. Sin asa, batería interna ni tarjeta en este valor; adaptador de batería y cable deben pesarse aparte.
- Fuente de masa: [Sony](https://www.sony.com/electronics/support/camcorders-and-video-cameras-interchangeable-lens-camcorders/ilme-fx3/specifications).
- Masa de planificación: 630 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Una salida HDMI de tamaño completo, tipo A; Un USB-C; Un Multi/Micro USB; Entrada de micrófono de 3.5 mm; Salida de auriculares de 3.5 mm; Zapata Multi Interface; Punto de montaje 1/4"-20
- Montaje: Cuerpo con jaula, fijado a la base SmallRig y después a la placa de liberación rápida DJI.
- Material: Chasis de aleación de magnesio
- Obligatorio/opcional: Obligatorio; función: Captura de imagen.
- Restricciones: Dispone de una sola salida HDMI de tamaño completo.; Las conexiones principales se concentran en el lado izquierdo de la cámara, zona crítica para ordenar el cableado.; La zapata superior Multi Interface admite el XLR-H1 u otros accesorios de zapata, pero no varios dispositivos superpuestos simultáneamente.
- Confianza: Alta.
- [Fuente principal](https://helpguide.sony.net/ilc/2210/v1/en/contents/TP1000886922.html)

## XLR-H1

- ID: `sony-xlr-h1`
- Nombre oficial del fabricante: Sony XLR-H1 Top Handle Unit.
- Modelo: XLR-H1; fabricante: Sony; categoría: Asa de audio.
- Medidas publicadas L/W/H: pendiente / pendiente / pendiente mm. Aproximadas/incompletas: sí.
- Nota de dimensiones: No se recuperó una envolvente física completa publicada por el fabricante en esta revisión.
- Masa publicada: 305 g. Aproximada: sí.
- Nota de masa: Masa de planificación; comprobar antes de aprobar la carga final del gimbal.
- Fuente de masa: [Sony](https://electronics.sony.com/imaging/imaging-accessories/imaging-compact-camera-accessories/p/xlrh1).
- Masa de planificación: 305 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Dos entradas combinadas XLR/TRS; Una entrada estéreo de 3.5 mm; Conexión Sony Multi Interface
- Montaje: Se fija a la zapata Multi Interface de la FX3 y se estabiliza con los tornillos laterales.
- Material: Aluminio y plástico técnico
- Obligatorio/opcional: Opcional; función: Entrada de audio para cámara a mano o entrevistas.
- Restricciones: Eleva el centro de gravedad sobre el eje de rotación y ocupa la zapata superior.; Dificulta una colocación superior despejada del LiDAR en el perfil principal de gimbal.
- Confianza: Media.
- [Fuente principal](https://electronics.sony.com/imaging/imaging-accessories/imaging-compact-camera-accessories/p/xlrh1)

## 16-35 mm GM

- ID: `sony-fe-16-35-gm`
- Nombre oficial del fabricante: Sony FE 16-35mm F2.8 GM.
- Modelo: SEL1635GM; fabricante: Sony; categoría: Objetivo.
- Medidas publicadas L/W/H: 121.6 / 88.5 / 88.5 mm. Aproximadas/incompletas: no.
- Nota de dimensiones: Diámetro máximo y longitud publicados por Sony para este objetivo.
- Masa publicada: 680 g. Aproximada: no.
- Nota de masa: Sólo el objetivo.
- Fuente de masa: [Sony](https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel1635gm).
- Masa de planificación: 680 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Montura Sony E; Rosca frontal de filtro de 82 mm; Selector AF/MF; Botón de retención de enfoque
- Montaje: Objetivo de montura E en la FX3; aro frontal del parasol y soporte de varillas opcional.
- Material: Aleación de magnesio, plástico técnico y grupos ópticos de vidrio
- Obligatorio/opcional: Obligatorio; función: Objetivo zoom principal.
- Restricciones: Rosca frontal de 82 mm, compatible con el aro 82-95 mm del kit SmallRig.; El peso frontal exige distribuir cuidadosamente parasol, motor de enfoque y batería V-mount al equilibrar la inclinación.
- Confianza: Alta.
- [Fuente principal](https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel1635gm)

## Jaula HawkLock

- ID: `smallrig-4770`
- Nombre oficial del fabricante: SmallRig HawkLock Quick Release Cage Kit for Sony FX3/FX30.
- Modelo: 4770; fabricante: SmallRig; categoría: Jaula de cámara.
- Medidas publicadas L/W/H: 160 / 101.2 / 66.2 mm. Aproximadas/incompletas: no.
- Nota de dimensiones: Manual oficial 4770: 160.0 × 101.2 × 66.2 mm y 208 ±5 g. Jaula abierta en U con riel superior desmontable; no es una caja maciza.
- Masa publicada: 208 g. Aproximada: no.
- Nota de masa: Masa nominal publicada, con tolerancia del fabricante; no es una medición del conjunto instalado.
- Fuente de masa: [SmallRig](https://www.smallrig.com/de/HawkLock-Quick-Release-Cage-Kit-for-Sony-FX3-FX30-4770.html).
- Masa de planificación: 208 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Base integrada de tipo Arca; Roscas 1/4"-20; Roscas de posicionamiento tipo ARRI 3/8"-16; Zapatas sin contactos; Riel NATO superior desmontable; Abrazadera de cable HDMI
- Montaje: Jaula ajustada a FX3/FX30 con varios puntos de contacto antitorsión.
- Material: Aleación de aluminio, acero inoxidable y silicona, según el manual oficial
- Obligatorio/opcional: Obligatorio; función: Protección de cámara, estructura antitorsión y sujeción del cableado.
- Restricciones: La anchura y altura añadidas deben incluirse en la comprobación de holgura del eje de rotación.; El riel NATO superior es desmontable; dejarlo fuera del perfil principal de gimbal salvo que sea necesario.
- Confianza: Media.
- [Fuente principal](https://www.smallrig.com/de/HawkLock-Quick-Release-Cage-Kit-for-Sony-FX3-FX30-4770.html); [fuente secundaria](https://www.bhphotovideo.com/c/search?q=smallrig%204770)

## Base 1674

- ID: `smallrig-1674`
- Nombre oficial del fabricante: SmallRig Baseplate with Dual 15 mm Rod Clamp.
- Modelo: 1674; fabricante: SmallRig; categoría: Base de montaje.
- Medidas publicadas L/W/H: 80 / 80 / 26 mm. Aproximadas/incompletas: no.
- Nota de dimensiones: Manual oficial: 80 × 80 × 26 mm, 171 ±5 g; orificios de varillas de 15 mm con 60 mm entre centros.
- Masa publicada: 171 g. Aproximada: no.
- Nota de masa: Masa nominal publicada, con tolerancia del fabricante; no es una medición del conjunto instalado.
- Fuente de masa: [SmallRig](https://www.smallrig.com/smallrig-baseplate-with-dual-15mm-rod-clamp-1674.html).
- Masa de planificación: 171 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Abrazadera doble para varillas de 15 mm; Ranura de montaje 1/4"-20; Ranura de montaje 3/8"-16
- Montaje: Atornillada debajo de la cámara con jaula; fija el par de varillas de 15 mm.
- Material: Aleación de aluminio y caucho, según el manual oficial
- Obligatorio/opcional: Obligatorio; función: Anclaje de las varillas para parasol y placa de batería.
- Restricciones: Comprobar la sujeción antitorsión de los tornillos hacia la placa del gimbal antes de moverlo.; La altura de las varillas define el engrane del motor de enfoque y la alineación del parasol.
- Confianza: Media.
- [Fuente principal](https://www.smallrig.com/smallrig-baseplate-with-dual-15mm-rod-clamp-1674.html)

## Varillas de 8 pulgadas

- ID: `smallrig-rods-8in`
- Nombre oficial del fabricante: SmallRig 15 mm Carbon Fiber Rods (Pair), 8 in.
- Modelo: No publicado; fabricante: SmallRig; categoría: Varillas.
- Medidas publicadas L/W/H: 203.2 / 15 / 15 mm. Aproximadas/incompletas: no.
- Nota de dimensiones: Varillas de 8 pulgadas de largo y 15 mm de diámetro; la página oficial también indica pared de 2.0 mm.
- Masa publicada: 80 g. Aproximada: sí.
- Nota de masa: La página oficial muestra actualmente el peso del paquete del par de 8 pulgadas; usarlo sólo para planificación.
- Fuente de masa: [SmallRig](https://www.smallrig.com/15mm-Carbon-Fiber-Rods-Pair.html).
- Masa de planificación: 80 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Estándar de varillas de 15 mm
- Montaje: Atraviesan las abrazaderas de la base 1674 y de la placa trasera 3203B.
- Material: Fibra de carbono
- Obligatorio/opcional: Obligatorio; función: Soporte compartido para parasol, motor de enfoque y placa V-mount.
- Restricciones: La longitud de 8 pulgadas exige repartir cuidadosamente el alcance frontal hacia el parasol y el trasero hacia la batería.; Mantener mínima la prolongación trasera para evitar un brazo de palanca excesivo.
- Confianza: Media.
- [Fuente principal](https://www.smallrig.com/15mm-Carbon-Fiber-Rods-Pair.html)

## Parasol Star-Trail

- ID: `smallrig-3645`
- Nombre oficial del fabricante: SmallRig Multifunctional Modular Matte Box (95 mm) VND Kit.
- Modelo: 3645; fabricante: SmallRig; categoría: Parasol.
- Medidas publicadas L/W/H: pendiente / 95 / pendiente mm. Aproximadas/incompletas: sí.
- Nota de dimensiones: La página oficial confirma la arquitectura de 95 mm, pero no una envolvente exterior completa del conjunto montado.
- Masa publicada: pendiente g. Aproximada: sí.
- Nota de masa: La página oficial publica actualmente el peso del paquete, no el del producto montado.
- Fuente de masa: [SmallRig](https://www.smallrig.com/global/SmallRig-Multifunctional-Modular-Matte-Box-95mm-VND-Kit-3645.html).
- Masa de planificación: 460 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Abertura de parasol de 95 mm; Aros adaptadores 67/72/77/82-95 mm; Marco de filtro magnético; Soporte doble para varillas de 15 mm
- Montaje: Aro de objetivo 82-95 mm; el soporte de varillas depende de medir su alcance. No asumir que las varillas de 8 pulgadas alcanzan a la vez el soporte frontal y la batería trasera.
- Material: Compuesto de fibra de carbono, aluminio y vidrio de filtro
- Obligatorio/opcional: Obligatorio; función: Parasol frontal y filtro ND variable.
- Restricciones: Añade peso frontal y superficie expuesta al viento al usar el gimbal.; Comprobar la bandera superior durante todo el recorrido del motor de inclinación.; Probar el conjunto VND a 16 mm para detectar viñeteo y patrones en cruz. Revisar la carga del anclaje al objetivo y el recorrido del zoom.
- Confianza: Media.
- [Fuente principal](https://www.smallrig.com/global/SmallRig-Multifunctional-Modular-Matte-Box-95mm-VND-Kit-3645.html)

## Soporte lateral 3026B

- ID: `smallrig-3026b`
- Nombre oficial del fabricante: SmallRig Monitor Mount with NATO Clamp for DJI RS Series.
- Modelo: 3026B; fabricante: SmallRig; categoría: Soporte de monitor.
- Medidas publicadas L/W/H: 152.6 / 54.8 / 38 mm. Aproximadas/incompletas: no.
- Nota de dimensiones: Medidas nominales del manual oficial 3026B; 125 ±5 g. La envolvente de uso depende del ángulo del cabezal.
- Masa publicada: 125 g. Aproximada: no.
- Nota de masa: Masa nominal publicada, con tolerancia del fabricante; no es una medición del conjunto instalado.
- Fuente de masa: [SmallRig](https://www.smallrig.com/global/smallrig-monitor-mount-with-nato-clamp-for-dji-rs-2-rsc-2-3026.html).
- Masa de planificación: 125 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Abrazadera NATO; Roscas de accesorios 1/4"-20; Zapata superior sin contactos; Zapata inferior sin contactos
- Montaje: Abrazadera directa en el riel NATO lateral del RS 4 Pro; cabezal de monitor regulable en inclinación.
- Material: Aleación de aluminio, acero inoxidable, latón y silicona; manual 3026B, página 8
- Obligatorio/opcional: Obligatorio; función: Soporte de monitor fuera de la cámara, al lado del gimbal.
- Restricciones: Monitor y accesorios deben respetar la carga admitida y dejar libre el brazo de rotación durante todo el recorrido.; Su fijación NATO proporciona un punto documentado para el monitor de este conjunto.; Manual oficial, página 7: carga máxima de 1.5 kg. Los 737 g nominales del Indie 7 quedan por debajo del límite estático; aún deben probarse rosca, par del cable y retención dinámica.
- Confianza: Alta.
- [Fuente principal](https://www.smallrig.com/global/smallrig-monitor-mount-with-nato-clamp-for-dji-rs-2-rsc-2-3026.html); [fuente secundaria](https://www.bhphotovideo.com/c/product/1767617-REG/smallrig_3026b_monitor_mount_with_nato.html/specs)

## Indie 7

- ID: `smallhd-indie-7`
- Nombre oficial del fabricante: SmallHD Indie 7 Touchscreen On-Camera Monitor.
- Modelo: MON-INDIE-7; fabricante: SmallHD; categoría: Monitor.
- Medidas publicadas L/W/H: 180.1 / 118.6 / 33.5 mm. Aproximadas/incompletas: no.
- Nota de dimensiones: B&H, modelo MON-INDIE-7: ancho × alto × fondo del cuerpo. No es la diagonal de la pantalla de siete pulgadas.
- Masa publicada: 737 g. Aproximada: no.
- Nota de masa: B&H: 26 oz / 737 g, sólo monitor, sin baterías ni soporte. Tabla SmallHD publica 18.9 oz (~536 g) de equipo y 26 oz (~737 g) de paquete: discrepancia conservada; planificación 737 g hasta pesar configuración real.
- Fuente de masa: [SmallHD](https://guide.smallhd.com/a/1634747-indie-7-quick-start-guide).
- Masa de planificación: 737 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Una entrada HDMI; Una salida HDMI; guía oficial: hasta 4Kp30; Dos conexiones 3G-SDI de entrada/salida; Entrada DC: 10–34 V; barril 2.0 mm interior / 5.5 mm exterior, centro positivo según tabla oficial SmallHD; Conector de auriculares de 3.5 mm; Placa doble de batería Sony serie L; Micro USB de servicio; Terminales batería serie L: 6.0–16.8 V; placa doble incluida; no carga baterías
- Montaje: Rosca inferior 1/4-20 al 3026B lateral de gimbal o 2906B sobre riel NATO de jaula / 4830.
- Material: Carcasa de aluminio, según la información del fabricante
- Obligatorio/opcional: Obligatorio; función: Monitor principal del operador.
- Restricciones: Su masa importa en el lateral del gimbal; acercarlo al pivote NATO, sin brazo largo.; No conectar batería 7.2 V al barril de mínimo 10 V. La batería serie L utiliza únicamente su placa nativa.
- Confianza: Media.
- [Fuente principal](https://guide.smallhd.com/a/1634747-indie-7-quick-start-guide); [fuente secundaria](https://www.bhphotovideo.com/c/product/1593398-REG/smallhd_mon_indie_7_indie_7_touchscreen_on_camera.html)

## VB99 Pro

- ID: `smallrig-vb99-pro`
- Nombre oficial del fabricante: SmallRig VB99 Pro Mini V-Mount Battery.
- Modelo: 4292; fabricante: SmallRig; categoría: Batería.
- Medidas publicadas L/W/H: 107.2 / 73.2 / 55.2 mm. Aproximadas/incompletas: no.
- Nota de dimensiones: Manual oficial 4292: 107.2 × 73.2 × 55.2 mm, 644 ±10 g; sólo la batería.
- Masa publicada: 644 g. Aproximada: no.
- Nota de masa: Masa nominal publicada, con tolerancia del fabricante; no es una medición del conjunto instalado.
- Fuente de masa: [SmallRig](https://www.smallrig.com/smallrig-VB99-Pro-mini-V-Mount-Battery-4292.html?sku=4292).
- Masa de planificación: 644 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: V-mount; Una salida D-Tap de 14.8 V; Una salida DC de barril de 8 V; Una salida DC de barril de 12 V; Un USB-C PD de entrada/salida; Un USB-C de salida; Un USB-A de salida
- Montaje: Bloqueada en la placa V-mount 3203B, sobre el tramo trasero de varillas.
- Material: Aleación de aluminio y policarbonato resistente al fuego, según el manual oficial
- Obligatorio/opcional: Obligatorio; función: Alimentación principal de cámara y accesorios.
- Restricciones: Mantener la masa baja y próxima al eje trasero de inclinación para evitar exceso de peso posterior.; No colocarla por encima del eje de rotación.
- Confianza: Media.
- [Fuente principal](https://www.smallrig.com/smallrig-VB99-Pro-mini-V-Mount-Battery-4292.html?sku=4292); [fuente secundaria](https://www.bhphotovideo.com/c/product/803417427-USE/smallrig_4292_vb99_pro_mini_v_mount.html)

## Placa V-mount

- ID: `smallrig-3203b`
- Nombre oficial del fabricante: SmallRig V-Mount Battery Adapter Plate with Dual 15 mm Rod Clamp.
- Modelo: 3203B; fabricante: SmallRig; categoría: Placa de batería.
- Medidas publicadas L/W/H: 168.7 / 108 / 33 mm. Aproximadas/incompletas: no.
- Nota de dimensiones: Página oficial de la revisión 3203B: 168.7 × 108 × 33 mm, 337 ±5 g. Incluye abrazadera doble de 15 mm; no separa las envolventes del cuerpo y de la abrazadera.
- Masa publicada: 337 g. Aproximada: sí.
- Nota de masa: La página oficial indica 337 ±5 g y el manual oficial 341 ±10 g. Se usan 351 g conservadores para planificación; pesar la revisión recibida.
- Fuente de masa: [SmallRig](https://www.smallrig.com/jp/Advanced-V-Mount-Battery-Mount-Plate-with-Dual-15mm-Rod-Clamp-3203B.html).
- Masa de planificación: 351 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Contactos de batería V-mount; Puerto D-Tap de entrada/salida; entrada publicada de 11.0-16.8 V. Salida efectiva por comprobar; DC5521: 8 V / 3 A; Dos DC5525: 12 V / 3 A cada uno; USB-C PD de entrada/salida, hasta 65 W; USB-A QC de salida, hasta 36 W; Parte posterior: seis roscas 1/4-20 y diez M4; Bordes superior/inferior: cinco roscas 1/4-20
- Montaje: Abrazadera doble incluida de 15 mm atornillada al borde superior, según el diagrama izquierdo del manual oficial, página 5; la placa cuelga bajo las varillas y la batería se fija por detrás.
- Material: Aleación de aluminio, según el fabricante
- Obligatorio/opcional: Obligatorio; función: Soporte trasero bajo de batería y distribución de alimentación.
- Restricciones: La propia placa añade masa trasera antes de instalar la batería.; Usar la salida D-Tap de la placa para SmallHD; no asumir un duplicador en la única salida D-Tap de la batería.; El manual, página 5, documenta la abrazadera en el borde SUPERIOR y la placa bajo las varillas. No se han medido las holguras con batería y motores de giro/inclinación.
- Confianza: Media.
- [Fuente principal](https://www.smallrig.com/jp/Advanced-V-Mount-Battery-Mount-Plate-with-Dual-15mm-Rod-Clamp-3203B.html)

## Adaptador NP-FZ100

- ID: `smallrig-4253b`
- Nombre oficial del fabricante: SmallRig D-Tap to Sony NP-FZ100 Dummy Battery Power Cable.
- Modelo: 4253B; fabricante: SmallRig; categoría: Cable de alimentación.
- Medidas publicadas L/W/H: 580 / 38.7 / 22.7 mm. Aproximadas/incompletas: no.
- Nota de dimensiones: Medidas del cable montado publicadas por B&H.
- Masa publicada: 71 g. Aproximada: no.
- Nota de masa: Peso de producto publicado por B&H.
- Fuente de masa: [SmallRig](https://www.smallrig.com/SmallRig-D-Tap-to-Sony-NP-FZ100-Dummy-Battery-Power-Cable-4253B.html).
- Masa de planificación: 71 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: D-Tap macho: entrada de 9.6-20 V, suministro mínimo de 2 A; Adaptador NP-FZ100 regulado: 8.0-8.4 V, máximo continuo de 2 A; Cable espiral: hasta 2 m ±50 mm extendido
- Montaje: Desde el sistema V-mount al compartimento de batería FX3, por la salida de cable de la puerta.
- Material: PVC, ABS y conductores de cobre
- Obligatorio/opcional: Obligatorio; función: Alimentación regulada principal de la cámara.
- Restricciones: Entrada de 9.6-20 V y salida regulada de 8-8.4 V hacia el adaptador de cámara.; Sujetar la holgura del cable a la salida de la puerta para no tirar del adaptador al inclinar.; La salida es de 8.0-8.4 V regulados, NO la tensión directa V-mount. El manual fija 2 A continuos; comprobar la demanda de cámara durante grabación.
- Confianza: Alta.
- [Fuente principal](https://www.smallrig.com/SmallRig-D-Tap-to-Sony-NP-FZ100-Dummy-Battery-Power-Cable-4253B.html); [fuente secundaria](https://www.bhphotovideo.com/c/product/803319395-USE/smallrig_4253b_d_tap_to_sony_np_fz100.html/specs)

## Focus Pro LiDAR

- ID: `dji-focus-pro-lidar`
- Nombre oficial del fabricante: DJI Focus Pro LiDAR.
- Modelo: No publicado; fabricante: DJI; categoría: Sensor de enfoque.
- Medidas publicadas L/W/H: 68 / 25 / 57 mm. Aproximadas/incompletas: sí.
- Nota de dimensiones: Especificaciones DJI Focus Pro; largo × ancho × alto aproximados.
- Masa publicada: 140 g. Aproximada: sí.
- Nota de masa: Masa de planificación.
- Fuente de masa: [DJI](https://www.dji.com/focus-pro/specs).
- Masa de planificación: 140 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: USB-C de actualización de firmware/alimentación; USB-C de datos/alimentación/CVBS/CAN; Zapata sin contactos; Rosca de montaje 1/4-20
- Montaje: DJI permite retirar la zapata y fijar el tornillo de 1/4 pulgada incluido a una jaula. Posición superior delantera candidata; medir la distancia entre plano del sensor y vidrio LiDAR.
- Material: Aluminio y plástico técnico
- Obligatorio/opcional: Opcional; función: Autofoco y medición de distancia del sujeto.
- Restricciones: Requiere campo de visión frontal despejado cerca del eje óptico.; Evitar un desplazamiento lateral grande si importa la precisión de enfoque.; En reserva por defecto: no se ha verificado la calibración repetible con SEL1635GM. Un aro de engranaje instalado no demuestra autofoco LiDAR operativo.
- Confianza: Media.
- [Fuente principal](https://www.dji.com/focus-pro/specs)

## Motor Focus Pro

- ID: `dji-focus-pro-motor`
- Nombre oficial del fabricante: DJI Focus Pro Motor.
- Modelo: No publicado; fabricante: DJI; categoría: Motor de enfoque.
- Medidas publicadas L/W/H: 100 / 61 / 34 mm. Aproximadas/incompletas: sí.
- Nota de dimensiones: Especificaciones DJI Focus Pro; largo × ancho × alto aproximados.
- Masa publicada: 123 g. Aproximada: sí.
- Nota de masa: Masa aproximada publicada del motor Focus Pro, no del motor Ronin anterior.
- Fuente de masa: [DJI](https://www.dji.com/focus-pro/specs).
- Masa de planificación: 123 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: USB-C de control/alimentación; Anclaje a varilla de 15 mm; Engrane con el aro del objetivo
- Montaje: Abrazadera a varilla de 15 mm y engrane con el aro del objetivo.
- Material: Aleación de aluminio
- Obligatorio/opcional: Opcional; función: Accionamiento del enfoque para asistencia LiDAR.
- Restricciones: Elegir el lado de varilla que deje libres las conexiones de cámara.; Comprobar el engrane tras cambiar objetivo o altura de varillas.; En reserva hasta probar calibración del objetivo, aro, alcance de varillas y holgura durante todo el movimiento.
- Confianza: Media.
- [Fuente principal](https://www.dji.com/focus-pro/specs); [fuente secundaria](https://www.dji.com/rs-4-pro/specs)

## Interfaz LiDAR / Transmission

- ID: `dji-lidar-transmission-hub`
- Nombre oficial del fabricante: DJI Focus Pro LiDAR to DJI Transmission Cable Hub.
- Modelo: No publicado; fabricante: DJI; categoría: Interfaz de señal.
- Medidas publicadas L/W/H: pendiente / pendiente / pendiente mm. Aproximadas/incompletas: sí.
- Nota de dimensiones: Las fuentes consultadas no permiten completar la envolvente física.
- Masa publicada: 139.3 g. Aproximada: no.
- Nota de masa: Masa publicada en la tienda oficial para el hub Focus Pro exacto; no corresponde al hub LiDAR Range Finder (RS) anterior.
- Fuente de masa: [DJI](https://store.dji.com/se/product/dji-focus-pro-lidar-dji-transmission-cable-hub?vid=168921).
- Masa de planificación: 139.3 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Conexiones específicas DJI de LiDAR/transmisión
- Montaje: Interfaz accesoria del sistema DJI Transmission.
- Material: Plástico técnico con cableado corto integrado
- Obligatorio/opcional: Opcional; función: No activo en la configuración principal actual.
- Restricciones: Requiere DJI Video Transmitter / DJI Transmission, no incluidos en el conjunto solicitado.; No confundirlo con Ronin Image Transmitter incluido en RS 4 Pro Combo.
- Confianza: Alta.
- [Fuente principal](https://store.dji.com/se/product/dji-focus-pro-lidar-dji-transmission-cable-hub?vid=168921)

## Mic 2

- ID: `dji-mic-2-kit`
- Nombre oficial del fabricante: DJI Mic 2 (2 TX + 1 RX + Charging Case).
- Modelo: No publicado; fabricante: DJI; categoría: Audio inalámbrico.
- Medidas publicadas L/W/H: pendiente / pendiente / pendiente mm. Aproximadas/incompletas: sí.
- Nota de dimensiones: Las fuentes consultadas verifican mejor la composición del sistema que las dimensiones del kit completo.
- Masa publicada: pendiente g. Aproximada: sí.
- Nota de masa: No se recuperó la masa del kit completo.
- Fuente de masa: [DJI](https://www.dji.com/mic-2).
- Masa de planificación: pendiente g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Salida TRS de 3.5 mm del receptor; USB-C de carga/datos; Micrófono integrado del transmisor; Entrada de micrófono lavalier compatible en el transmisor
- Montaje: Zapata integrada del receptor DMR02 a la zapata inclinada del HawkLock 4770: interfaces documentadas, montaje candidato. Los transmisores se sujetan al participante; estuche fuera del rig.
- Material: Plástico técnico y herrajes de clip metálicos
- Obligatorio/opcional: Opcional; función: Audio inalámbrico de diálogo y referencia para un solo operador.
- Restricciones: Preferible como sistema corporal o de zapata, no como carga permanente indiscriminada del gimbal.; Verificar retención, acceso a HDMI/MIC, lectura del RX y barrido de motores con la zapata inclinada real; posición y ángulo del visor aproximados.; El receptor utiliza su batería interna; no se presupone alimentación por la zapata sin contactos ni el adaptador Sony MI opcional.
- Confianza: Media.
- [Fuente principal](https://www.dji.com/mic-2)

## Micrófono de solapa DJI

- ID: `dji-lavalier`
- Nombre oficial del fabricante: DJI Lavalier Mic.
- Modelo: No publicado; fabricante: DJI; categoría: Micrófono de solapa.
- Medidas publicadas L/W/H: pendiente / pendiente / pendiente mm. Aproximadas/incompletas: sí.
- Nota de dimensiones: La envolvente física exacta no es necesaria para la distribución actual del rig.
- Masa publicada: pendiente g. Aproximada: sí.
- Nota de masa: No se recuperó el peso en las fuentes consultadas.
- Fuente de masa: [DJI](https://store.dji.com/product/dji-lavalier-mic).
- Masa de planificación: pendiente g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Conector TRS de 3.5 mm
- Montaje: Se sujeta a la ropa y se conecta a un transmisor DJI Mic.
- Material: Cable, clip metálico y cuerpo de micrófono de plástico
- Obligatorio/opcional: Opcional; función: Micrófono discreto del participante.
- Restricciones: No es masa permanente del rig; sí debe planificarse el cable del receptor hacia cámara cuando se utiliza en directo.
- Confianza: Alta.
- [Fuente principal](https://store.dji.com/product/dji-lavalier-mic)

## Distribuidor StarTech

- ID: `startech-st122hd4ku`
- Nombre oficial del fabricante: StarTech ST122HD4KU 1x2 UHD 4K HDMI Splitter.
- Modelo: ST122HD4KU; fabricante: StarTech; categoría: Distribuidor de vídeo.
- Medidas publicadas L/W/H: 620 / 50 / 18 mm. Aproximadas/incompletas: no.
- Nota de dimensiones: Las medidas de la ficha StarTech incluyen el cable de entrada cautivo. Los 620 mm NO son la longitud de la carcasa; su geometría sigue siendo aproximada.
- Masa publicada: 72 g. Aproximada: no.
- Nota de masa: Masa del producto publicada por el fabricante, sin adaptador de corriente.
- Fuente de masa: [StarTech](https://www.startech.com/en-fr/audio-video-products/st122hd4ku).
- Masa de planificación: 72 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Cable de entrada cautivo HDMI tipo A macho; Dos salidas HDMI tipo A hembra; Entrada DC de 5 V; adaptador de corriente y cable de alimentación USB incluidos; HDMI 1.4, hasta 4K a 30 Hz
- Montaje: No se ha verificado una interfaz de montaje al rig en las fuentes consultadas.
- Material: Plástico técnico
- Obligatorio/opcional: Opcional; función: Producto solicitado conservado; uso externo o en banco en esta selección de hardware.
- Restricciones: No tiene un soporte limpio verificado entre las piezas listadas para uso dinámico en gimbal.; La doble salida solicitada se conserva en banco. Probar alimentación, EDID y compatibilidad 1080p; no se aprueba un montaje en gimbal.
- Confianza: Media.
- [Fuente principal](https://www.startech.com/en-fr/audio-video-products/st122hd4ku)

## HDMI Kondor Blue

- ID: `kondor-blue-hdmi-aa`
- Nombre oficial del fabricante: Kondor Blue Full HDMI Cable for On-Camera Monitors, 12 to 24 in Braided Coiled.
- Modelo: KB-FHDMI-12; fabricante: Kondor Blue; categoría: Cable de vídeo.
- Medidas publicadas L/W/H: 304.8 / pendiente / pendiente mm. Aproximadas/incompletas: no.
- Nota de dimensiones: Longitud espiral de 12 a 24 pulgadas.
- Masa publicada: pendiente g. Aproximada: sí.
- Nota de masa: No se publicó la masa del cable en las fuentes consultadas.
- Fuente de masa: [Kondor Blue](https://kondorblue.com/products/12-to-24-coiled-braided-hdmi-cable-for-camera-mounted-monitors).
- Masa de planificación: 65 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: HDMI tipo A macho; HDMI tipo A macho; HDMI 2.0, 18 Gbps
- Montaje: Tramo de cable entre cámara o monitor y el dispositivo HDMI correspondiente.
- Material: Cable trenzado con carcasas de conector reforzadas
- Obligatorio/opcional: Obligatorio; función: Conexión HDMI corta principal del monitor del operador.
- Restricciones: Elegir el recorrido más corto adecuado para reducir la resistencia del cable.; La tensión de la espiral no debe tirar directamente de la salida HDMI de la FX3.
- Confianza: Alta.
- [Fuente principal](https://kondorblue.com/products/12-to-24-coiled-braided-hdmi-cable-for-camera-mounted-monitors)

## HDMI A-C DJI

- ID: `dji-hdmi-a-to-c`
- Nombre oficial del fabricante: DJI RS Mini-HDMI to HDMI Cable (20 cm).
- Modelo: No publicado; fabricante: DJI; categoría: Cable de vídeo.
- Medidas publicadas L/W/H: 200 / pendiente / pendiente mm. Aproximadas/incompletas: no.
- Nota de dimensiones: Longitud de cable publicada por DJI.
- Masa publicada: pendiente g. Aproximada: sí.
- Nota de masa: No se publicó la masa del cable en las fuentes consultadas.
- Fuente de masa: [DJI](https://store.dji.com/uk/product/r-mini-hdmi-to-hdmi-cable).
- Masa de planificación: 35 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: HDMI tipo A macho; Mini HDMI tipo C macho
- Montaje: Desde la salida del distribuidor en banco hacia Mini HDMI de Ronin Image Transmitter; la salida del monitor es una alternativa condicionada, no la ruta principal.
- Material: Cubierta de PVC y conductores de cobre
- Obligatorio/opcional: Opcional; función: Cable de la salida secundaria de transmisión.
- Restricciones: Sólo necesario si Ronin Image Transmitter está activo.; Su recorrido debe dejar libre el eje de giro horizontal; el alcance se comprueba físicamente.
- Confianza: Alta.
- [Fuente principal](https://store.dji.com/uk/product/r-mini-hdmi-to-hdmi-cable)

## Control USB-C DJI

- ID: `dji-r-usbc-control`
- Nombre oficial del fabricante: DJI R Multi-Camera Control Cable (USB-C).
- Modelo: No publicado; fabricante: DJI; categoría: Cable de control.
- Medidas publicadas L/W/H: 300 / pendiente / pendiente mm. Aproximadas/incompletas: sí.
- Nota de dimensiones: La tienda oficial DJI publica una longitud de 30 cm; la envolvente de conectores no está completa.
- Masa publicada: pendiente g. Aproximada: sí.
- Nota de masa: No se recuperó el peso en las fuentes consultadas.
- Fuente de masa: [DJI](https://store.dji.com/ca/product/r-multi-camera-control-cable-usb-c).
- Masa de planificación: 30 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: USB-C macho; USB-C macho
- Montaje: Tramo corto desde RSS del RS a USB-C de la FX3.
- Material: Cable de PVC y carcasas USB-C moldeadas
- Obligatorio/opcional: Obligatorio; función: Control de cámara desde el gimbal.
- Restricciones: Dejar un bucle flexible de servicio durante la inclinación, sin engancharse al motor de rotación.
- Confianza: Alta.
- [Fuente principal](https://store.dji.com/ca/product/r-multi-camera-control-cable-usb-c)

## D-Tap a DC SmallHD

- ID: `smallhd-dtap-to-2mm-barrel`
- Nombre oficial del fabricante: SmallHD D-Tap to 5.5mm Male DC Barrel Power Cable (36in / 91cm).
- Modelo: CBL-PWR-DTAP-BAR-36; fabricante: SmallHD; categoría: Cable de alimentación.
- Medidas publicadas L/W/H: 914.4 / pendiente / pendiente mm. Aproximadas/incompletas: sí.
- Nota de dimensiones: El fabricante indica 36 pulgadas / 91 cm; no publica toda la geometría del conector. Se conserva el ID histórico por compatibilidad de datos, no como especificación de diámetro.
- Masa publicada: pendiente g. Aproximada: sí.
- Nota de masa: No se recuperó el peso en las fuentes consultadas.
- Fuente de masa: [SmallHD](https://smallhd.com/products/dtap-barrel-36in).
- Masa de planificación: 95 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: D-Tap macho; Barril DC macho de 5.5 mm de diámetro exterior; centro positivo publicado; diámetro interior por confirmar
- Montaje: Desde la salida D-Tap de la placa 3203B a la entrada DC del Indie 7.
- Material: Cable de PVC y carcasas de conector moldeadas
- Obligatorio/opcional: Obligatorio; función: Alimentación del monitor; no se afirma regulación de tensión.
- Restricciones: Confirmar ajuste del barril, polaridad y tensión D-Tap medida antes de conectar; nunca conectar D-Tap directo a la FX3.
- Confianza: Media.
- [Fuente principal](https://smallhd.com/products/dtap-barrel-36in); [fuente secundaria](https://www.bhphotovideo.com/c/product/1154925-REG/smallhd_cbl_pwr_dtap_bar_36_d_tap_adapter_cable.html)

## RavenEye

- ID: `dji-ronin-image-transmitter`
- Nombre oficial del fabricante: DJI Ronin Image Transmitter.
- Modelo: No publicado; fabricante: DJI; categoría: Transmisor de vídeo.
- Medidas publicadas L/W/H: 82 / 63 / 24 mm. Aproximadas/incompletas: no.
- Nota de dimensiones: Especificaciones publicadas por DJI.
- Masa publicada: 126 g. Aproximada: no.
- Nota de masa: Especificaciones publicadas por DJI.
- Fuente de masa: [DJI](https://www.dji.com/rs-4-pro/specs).
- Masa de planificación: 126 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: USB-C de alimentación/comunicación; Entrada Mini HDMI; USB-C RSS de control de cámara; Interfaz de expansión de zapata sin contactos
- Montaje: Accesorio incluido en el Combo; el montaje activo depende de disponer de zapata o herrajes 1/4"-20 compatibles.
- Material: Plástico técnico y herrajes metálicos de montaje
- Obligatorio/opcional: Opcional; función: Vídeo y control inalámbricos para la aplicación Ronin.
- Restricciones: La batería interna permite mantenerlo fuera del sistema de alimentación V-mount.; No confundirlo con el hardware DJI Transmission requerido por el hub LiDAR.
- Confianza: Alta.
- [Fuente principal](https://www.dji.com/rs-4-pro/specs); [fuente secundaria](https://store.dji.com/product/dji-rs-4-pro-combo)

## Aplicación Ronin

- ID: `dji-ronin-app`
- Nombre oficial del fabricante: DJI Ronin App.
- Modelo: No publicado; fabricante: DJI; categoría: Aplicación.
- Medidas publicadas L/W/H: pendiente / pendiente / pendiente mm. Aproximadas/incompletas: no.
- Nota de dimensiones: Sólo aplicación.
- Masa publicada: pendiente g. Aproximada: no.
- Nota de masa: Sólo aplicación.
- Fuente de masa: [DJI](https://www.dji.com/downloads/djiapp/dji-ronin).
- Masa de planificación: pendiente g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Bluetooth; Vídeo/control por Wi-Fi con Ronin Image Transmitter
- Montaje: Se ejecuta en teléfono o tableta; el plan actual no incluye un montaje físico del dispositivo.
- Material: Aplicación
- Obligatorio/opcional: Opcional; función: Configuración, ajuste y monitorización inalámbrica del gimbal.
- Restricciones: Requiere un dispositivo compatible y, para vídeo, Ronin Image Transmitter activo.
- Confianza: Alta.
- [Fuente principal](https://www.dji.com/downloads/djiapp/dji-ronin)

## Monitor & Control

- ID: `sony-monitor-control-app`
- Nombre oficial del fabricante: Sony Monitor & Control App.
- Modelo: No publicado; fabricante: Sony; categoría: Aplicación.
- Medidas publicadas L/W/H: pendiente / pendiente / pendiente mm. Aproximadas/incompletas: no.
- Nota de dimensiones: Sólo aplicación.
- Masa publicada: pendiente g. Aproximada: no.
- Nota de masa: Sólo aplicación.
- Fuente de masa: [Sony](https://creatorscloud.sony.net/catalog/en-jo/monitorcontrol/index.html).
- Masa de planificación: pendiente g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Monitorización/control por cable o inalámbricos con un dispositivo compatible
- Montaje: Se ejecuta en teléfono, tableta o Mac.
- Material: Aplicación
- Obligatorio/opcional: Opcional; función: Alternativa de monitorización/control de cámara en perfiles esenciales o verticales.
- Restricciones: Útil si se retira deliberadamente el monitor SmallHD o la transmisión Ronin para reducir peso.
- Confianza: Alta.
- [Fuente principal](https://creatorscloud.sony.net/catalog/en-jo/monitorcontrol/index.html)

## Soporte NATO de monitor 2906B

- ID: `smallrig-2906b`
- Nombre oficial del fabricante: SmallRig Swivel and Tilt Adjustable Monitor Support with NATO Clamp.
- Modelo: 2906B; fabricante: SmallRig; categoría: Soporte de monitor.
- Medidas publicadas L/W/H: 52.6 / 36 / 53.8 mm. Aproximadas/incompletas: no.
- Nota de dimensiones: Envolvente publicada; forma y asiento del montaje aproximados. Manual página 10: 53.8 de alto × 52.6 de ancho × 36.0 de fondo.
- Masa publicada: 85 g. Aproximada: no.
- Nota de masa: Masa nominal ±5 g publicada en manual, sin monitor ni batería.
- Fuente de masa: [SmallRig](https://static.smallrig.com/mall/img/public/0g141qmktenu-1751249917074_.pdf).
- Masa de planificación: 85 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Abrazadera NATO; Tornillo 1/4-20 de monitor; Giro 360° e inclinación 180° publicados
- Montaje: Abrazadera NATO sobre riel superior 4770 sin XLR, o riel del kit 4830 sobre XLR-H1. Tornillo superior 1/4-20 a rosca inferior del Indie 7.
- Material: Aleación de aluminio y acero inoxidable, manual página 10
- Obligatorio/opcional: Opcional; función: Monitor sobre núcleo a mano o estático; no sustituye 3026B lateral en gimbal..
- Restricciones: Manual página 3: límite según ángulo, 4.2 kg a 90°, 2.5 kg a 45°, 2.3 kg a 30°. No certifica seguridad dinámica ni rosca del Indie 7.; Pines elásticos descritos para Atomos Ninja V/V+; no se afirma antitorsión del Indie 7.; Verificar asiento NATO, apriete, palanca de batería, cables y acceso a asa.
- Confianza: Media.
- [Fuente principal](https://static.smallrig.com/mall/img/public/0g141qmktenu-1751249917074_.pdf)

## Extensión y riel XLR 4830

- ID: `smallrig-4830`
- Nombre oficial del fabricante: SmallRig Extension Mount Plate Kit for Sony FX3/FX30 XLR Handle.
- Modelo: 4830; fabricante: SmallRig; categoría: audio handle accessory.
- Medidas publicadas L/W/H: 124.8 / 55.8 / 77.5 mm. Aproximadas/incompletas: no.
- Nota de dimensiones: Envolvente publicada; forma y asiento del montaje aproximados. Manual página 2: envolvente de kit 124.8 × 77.5 × 55.8 mm, no cotas de cada subpieza.
- Masa publicada: 115 g. Aproximada: no.
- Nota de masa: Masa nominal ±5 g publicada en manual, sin monitor ni batería.
- Fuente de masa: [SmallRig](https://static.smallrig.com/mall/img/public/1725874097334_.pdf).
- Masa de planificación: 115 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Riel NATO para asa XLR; Orificios 1/4-20 y ARRI 3/8-16 publicados; Fijaciones M4 incluidas
- Montaje: Extensión, pieza de bloqueo y riel NATO nativos sobre XLR-H1; seguir montaje del manual página 8. Retirar riel superior desmontable de 4770 antes de instalar XLR.
- Material: Aleación de aluminio, acero inoxidable y silicona; manual página 2
- Obligatorio/opcional: Opcional; función: Proporcionar riel de monitor cuando el asa Sony ocupa el techo de cámara..
- Restricciones: Kit 4770 no incluye 4830; elegirlo expresamente.; Incluye riel NATO para XLR, extensión, bloqueo, dos tornillos M4 y dos llaves; no incluye asa Sony ni monitor.; No transferir monitor de gimbal sin desconectar y elegir esta cadena.; Verificar que monitor, batería y cables no cierren el agarre del asa.
- Confianza: Media.
- [Fuente principal](https://static.smallrig.com/mall/img/public/1725874097334_.pdf)

## Batería Sony NP-F970/PRO

- ID: `sony-np-f970-pro`
- Nombre oficial del fabricante: Sony NP-F970/PRO Rechargeable Battery Pack.
- Modelo: NP-F970/PRO; fabricante: Sony; categoría: Batería.
- Medidas publicadas L/W/H: 70.8 / 38.4 / 60 mm. Aproximadas/incompletas: sí.
- Nota de dimensiones: Envolvente publicada; forma y asiento del montaje aproximados. Ficha Sony NP-F970/PRO: ancho 38.4 × alto 60.0 × fondo 70.8 mm aproximados. No se extrapolan las cotas discrepantes de NP-F970 regional.
- Masa publicada: 300 g. Aproximada: sí.
- Nota de masa: Sony publica aproximadamente 300 g para NP-F970/PRO.
- Fuente de masa: [Sony](https://www.sony.jp/products/catalog/SPC_NP-F970_PRO.pdf).
- Masa de planificación: 300 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Contactos serie L / InfoLITHIUM; 7.2 V nominales; no salida de barril ni USB
- Montaje: Un paquete serie L en una de las dos bahías de la placa nativa incluida del Indie 7. Sin adaptador D-Tap ni cable a barril.
- Material: Celdas de ion-litio publicadas; carcasa plástica estimada, no composición certificada.
- Obligatorio/opcional: Opcional; función: Alimentación autónoma del monitor, también en gimbal vertical..
- Restricciones: Tensión nominal 7.2 V; ficha Sony: 45 Wh / 6300 mAh. No es NP-FZ100 ni alimenta la FX3.; Usar cargador específico externo. El Indie 7 no carga baterías.; Una batería elegida: no representar dos paquetes ni prometer autonomía calculada.; Comprobar retención, carga disponible y tensión real bajo carga; interfaz serie L documentada, combinación física no ensayada.
- Confianza: Media.
- [Fuente principal](https://www.sony.jp/products/catalog/SPC_NP-F970_PRO.pdf)

## Sony FX30

- ID: `sony-fx30`
- Nombre oficial del fabricante: Sony FX30.
- Modelo: ILME-FX30; fabricante: Sony; categoría: Cuerpo de cámara.
- Medidas publicadas L/W/H: 129.7 / 77.8 / 84.5 mm. Aproximadas/incompletas: sí.
- Nota de dimensiones: Campos históricos: ancho / alto / fondo, cotas aproximadas de fabricante; consultar layout-manifest para ejes. No son cotas de montaje.
- Masa publicada: 562 g. Aproximada: sí.
- Nota de masa: 562 g aproximados: cuerpo solo, sin batería, tarjeta ni asa. No sumar 646 g con batería/tarjeta.
- Fuente de masa: [Sony](https://www.sony.jp/pro-cam/products/ILME-FX30/spec.html).
- Masa de planificación: 562 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Una salida HDMI tipo A; USB-C x1; Multi/Micro USB x1; Entrada de micrófono de 3.5 mm; Salida de auriculares de 3.5 mm; Sony Multi Interface Shoe; Compartimento nativo NP-FZ100
- Montaje: Núcleo a mano, montura E y jaula 4770 según el manual específico FX30.
- Material: Materiales no verificados en las fuentes revisadas; apariencia del modelo aproximada.
- Obligatorio/opcional: Opcional; función: Captura APS-C; piloto a mano.
- Restricciones: 562 g aproximados: cuerpo solo, sin batería, tarjeta ni asa. No sumar 646 g con batería/tarjeta.; Piloto de planificación sólo a mano y horizontal; gimbal, monitor, audio externo y control no revisados para este cuerpo.; Puertos identificados; coordenadas no medidas. No hereda puertos ni cables de FX3.; ILME-FX30 puede incluir asa según SKU/región; no se añade automáticamente.; Ventilación inferior y cubierta de batería deben quedar libres.
- Confianza: Media.
- [Fuente principal](https://www.sony.jp/pro-cam/products/ILME-FX30/spec.html)

## FE 20mm F1.8 G

- ID: `sony-fe-20-f18-g`
- Nombre oficial del fabricante: Sony FE 20mm F1.8 G.
- Modelo: SEL20F18G; fabricante: Sony; categoría: Objetivo.
- Medidas publicadas L/W/H: 73.5 / 73.5 / 84.7 mm. Aproximadas/incompletas: sí.
- Nota de dimensiones: Campos históricos: diámetro / diámetro / longitud; consultar size_xyz_mm para ejes. Medidas exteriores publicadas, no encajes mecánicos.
- Masa publicada: 373 g. Aproximada: sí.
- Nota de masa: Dimensiones diámetro máximo 73.5 × longitud 84.7 mm; masa aproximada.
- Fuente de masa: [Sony](https://www.sony.jp/ichigan/products/SEL20F18G/spec.html).
- Masa de planificación: 373 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Montura Sony E; Filtro nominal de 67 mm
- Montaje: Montura Sony E directa de FX30; par exacto documentado por Sony.
- Material: Materiales no verificados en las fuentes revisadas; apariencia del modelo aproximada.
- Obligatorio/opcional: Opcional; función: Óptica fija del piloto FX30.
- Restricciones: Dimensiones diámetro máximo 73.5 × longitud 84.7 mm; masa aproximada.; Sin parasol ni tapas en la escena: no fueron seleccionados.; No hereda zoom, forma o longitud de SEL1635GM.; Otros pares cámara/objetivo quedan pendientes; no se aprueban por compartir montura.
- Confianza: Media.
- [Fuente principal](https://www.sony.jp/ichigan/products/SEL20F18G/spec.html)

## Sony NP-FZ100

- ID: `sony-np-fz100`
- Nombre oficial del fabricante: Sony NP-FZ100 Rechargeable Battery Pack.
- Modelo: NP-FZ100; fabricante: Sony; categoría: Batería.
- Medidas publicadas L/W/H: 38.7 / 22.7 / 51.7 mm. Aproximadas/incompletas: sí.
- Nota de dimensiones: Campos históricos: ancho / alto / fondo, cotas aproximadas de fabricante; consultar layout-manifest para ejes. No son cotas de montaje.
- Masa publicada: 83 g. Aproximada: sí.
- Nota de masa: 7.2 V nominales, 16.4 Wh, 2280 mAh; no son rango de descarga ni corriente admisible.
- Fuente de masa: [Sony](https://electronics.sony.com/imaging/imaging-accessories/interchangeable-lens-camera-accessories/p/npfz100?sku=npfz100).
- Masa de planificación: 83 g; no sustituye pesaje del subconjunto instalado.
- Interfaces: Contactos nativos NP-FZ100; pinout no publicado
- Montaje: Alojamiento nativo FX3 o FX30; palanca de retención y cubierta según la guía propia de cada cuerpo.
- Material: Materiales no verificados en las fuentes revisadas; apariencia del modelo aproximada.
- Obligatorio/opcional: Opcional; función: Alimentación interna nativa de FX3 o del piloto FX30.
- Restricciones: 7.2 V nominales, 16.4 Wh, 2280 mAh; no son rango de descarga ni corriente admisible.; Batería interna, no bloque externo ni cable D-Tap.; 83 g aproximados, sumados una sola vez al cuerpo solo.; Cargador no elegido ni incluido en este plan; usar batería previamente cargada.; FX3 documentada por Sony en su guía propia; FX30 conserva su revisión independiente. Otros cuerpos pendientes.; No instalar simultáneamente con SmallRig 4253B: ambos ocupan el mismo alojamiento.
- Confianza: Media.
- [Fuente principal](https://electronics.sony.com/imaging/imaging-accessories/interchangeable-lens-camera-accessories/p/npfz100?sku=npfz100)
