# Piloto FX30 a mano con objetivo fijo

Generado desde `data/catalog-pilot.json`, con especificaciones referenciadas de `catalog-intake.json` y `parts-manifest.json`. Revisión 2026-10-07.

Ficha documental en cuarentena. No instala piezas ni modifica los rigs guardados. No es un conjunto ensayado ni una plantilla disponible.

Este es el expediente documental de origen. Estado actual: [integración de planificación](pilot-integration.md), con tres altas explícitas y guía propia; el ensayo físico permanece pendiente.

## 1. Manifiesto

| Pieza | Modelo exacto | Autoridad | Fuentes |
|---|---|---|---|
| Sony FX30 | ILME-FX30 | `catalog-intake` | [Sony](https://www.sony.jp/pro-cam/products/ILME-FX30/spec.html); [Sony](https://helpguide.sony.net/ilc/2220/v1/en/print.pdf) |
| Jaula HawkLock | 4770 | `parts-manifest` | [SmallRig](https://static.smallrig.com/mall/img/public/1725874097334_.pdf) |
| Sony FE 20mm F1.8 G | SEL20F18G | `catalog-intake` | [Sony](https://www.sony.jp/ichigan/products/SEL20F18G/) |
| Sony NP-FZ100 Rechargeable Battery Pack | NP-FZ100 | `catalog-intake` | [Sony](https://electronics.sony.com/imaging/imaging-accessories/interchangeable-lens-camera-accessories/p/npfz100?sku=npfz100) |

Subtotal: **aproximadamente 1226 g**. Subtotal documental, no peso medido, centro de gravedad, equilibrio ni capacidad dinámica. 208 g representa el kit de jaula; pesar si se retiran riel o abrazadera. No deducir la masa de tarjeta por diferencias de cifras aproximadas.

Excluidos: Tarjeta de memoria no seleccionada; Parasol ALC-SH162 no seleccionado; Tapas retiradas para montar; Diferencias del subconjunto de jaula instalado.

- ILME-FX30 + SEL20F18G: [Sony](https://support.d-imaging.sony.co.jp/www/cscs/lens_body/detail.php?area=jp&lang=es&prdct_name=ILME-FX30&rel_prdct_name=SEL20F18G), Encabezado ILME-FX30 - SEL20F18G; resultado Totalmente compatible. Compatibilidad del par, no holgura de jaula ni certificación de todas las versiones de firmware.
- ILME-FX30 + 4770: [SmallRig](https://static.smallrig.com/mall/img/public/1725874097334_.pdf), Páginas 3 y 5: compatibilidad FX30 y secuencia de sujeción inferior/laterales. Diagramas sin coordenadas, enganche medido ni par de apriete publicado.
- ILME-FX30 + NP-FZ100: [Sony](https://helpguide.sony.net/ilc/2220/v1/en/print.pdf), Página 19, contenido: NP-FZ100; página 526, especificaciones de batería. Batería nativa, no cable D-Tap ni especificación de pinout.

## 2. Distribución física

No hay coordenadas ni rotaciones calibradas: sus campos permanecen `null`. El grafo expresa relaciones de montaje, no mediciones.

### Sony FX30

- Posición: Núcleo sostenido por el operador; ventilación inferior libre.
- Orientación: Objetivo hacia la escena, pantalla accesible al operador.
- Motivo: Mantener controles, pantalla, tarjeta y acceso a batería sin accesorios implícitos.
- Rechazado: Copiar la pose y puertos del cuerpo FX3; Añadir un gimbal por defecto
- Comprobar: Entrada y salida de ventilación despejadas; Controles y pantalla utilizables con la jaula elegida

### Jaula HawkLock

- Posición: Jaula en U alrededor del cuerpo; asientos inferior y laterales indicados por SmallRig.
- Orientación: Coincidir con el diagrama del manual; no hay transformación mecánica calibrada.
- Motivo: Soporte específico FX30 documentado, sin placa ni adaptador inventado.
- Rechazado: Usar un solo anclaje ignorando los laterales del manual; Usar el riel superior a la vez que un asa XLR
- Comprobar: Usar fijaciones suministradas según manual, sin forzar; Comprobar asiento, acceso al compartimento y pantalla en el ejemplar real

### Sony FE 20mm F1.8 G

- Posición: Montura E frontal de FX30, sin adaptador.
- Orientación: Alinear índices blancos y girar según el manual hasta retención.
- Motivo: Par exacto confirmado por Sony; núcleo compacto sin matte box ni parasol añadido.
- Rechazado: Heredar longitud, forma o parasol de SEL1635GM; Introducir un adaptador de montura sin necesidad
- Comprobar: Bloqueo del objetivo y acceso al botón de liberación; Anillos accesibles; holguras con la jaula no certificadas

### Sony NP-FZ100 Rechargeable Battery Pack

- Posición: Dentro del compartimento nativo; retenida por la palanca y cubierta bloqueada.
- Orientación: Seguir la inserción del manual; contactos y posición interna sin coordenadas publicadas.
- Motivo: Alimentación nativa sin dummy, V-mount, cables o soportes adicionales.
- Rechazado: Representar la batería como un bloque externo bajo la cámara; Sumarla otra vez a la masa de cuerpo con batería
- Comprobar: Cubierta bloqueada y palanca reteniendo; Acceso con jaula y ventilación comprobados en el ejemplar real

## 3. Alimentación y conexiones

- `pilot-pwr-npfz100-fx30`: Sony NP-FZ100 Rechargeable Battery Pack → Sony FX30; Contactos nativos NP-FZ100 → Alojamiento nativo FX30.
- Tipo: alimentación por contactos; 7.2 V nominales, [Sony](https://electronics.sony.com/imaging/imaging-accessories/interchangeable-lens-camera-accessories/p/npfz100?sku=npfz100). Pinout y rango: pendientes. Longitud: no aplica.
- Recorrido: Contacto interno directo, no trazado de cable externo ni anclajes inventados.
- Retención: Palanca y cubierta según la guía FX30; comprobar acceso con 4770.
- Riesgos: Tensión nominal no equivale a rango de descarga; No puentear contactos ni usar esta ficha para un dummy

Vista ensamblada: Contacto interno de batería, sin líneas externas. Vista separada: Relación batería/compartimento etiquetada, no trayectoria de inserción físicamente simulada.

Colores reservados para futuras rutas: energía `#e9ae68`, vídeo `#6ebbc4`, datos `#b1c876`. Este piloto no tiene cables externos. La energía se explica por contacto; no dibujar una curva desde batería a cámara.

## 4. Guía documental

### 1. Preparar el cuerpo

- Montar/preparar: Cuerpo apagado, tapas protegidas y núcleo sin accesorios externos.
- Lugar: Superficie estable y limpia, antes de montar la jaula.
- Comprobar: SKU y firmware del ejemplar registrados; Ventilación inferior identificada y sin cubrir
- Equilibrio: No aplica: sin gimbal; revisar reparto y comodidad al añadir masa.
- Fuentes: [Sony](https://helpguide.sony.net/ilc/2220/v1/en/print.pdf); [Sony](https://helpguide.sony.net/ilc/2220/v1/en/contents/TP1000886849.html).

### 2. Asegurar HawkLock 4770

- Montar/preparar: Presentar el cuerpo en la jaula y seguir la sujeción inferior/laterales ilustrada, con las fijaciones suministradas.
- Lugar: Alrededor del cuerpo, conforme a la página 5 del manual 4770.
- Comprobar: Asiento sin forzar y sin holgura evidente; Sin bloqueo de ventilación, pantalla o cubierta de batería; No extrapolar el límite de tornillo de trípode a todas las fijaciones de jaula; par de apriete pendiente
- Equilibrio: Sin equilibrio de motores; comprobar agarre. El kit no añade asa XLR ni monitor.
- Fuentes: [SmallRig](https://static.smallrig.com/mall/img/public/1725874097334_.pdf); [Sony](https://helpguide.sony.net/ilc/2220/v1/en/contents/TP1000886849.html).

### 3. Acoplar FE 20mm F1.8 G

- Montar/preparar: Cámara apagada: alinear índices y girar suavemente hasta el bloqueo del manual Sony.
- Lugar: Montura E del cuerpo; sin adaptador.
- Comprobar: Retención y acceso al botón de liberación; Anillos libres y ausencia de interferencias comprobada físicamente
- Equilibrio: Mayor masa frontal: comprobar comodidad; no asumir centro de gravedad a partir de envolventes.
- Fuentes: [Sony](https://helpguide.sony.net/ilc/2220/v1/en/print.pdf); [Sony](https://support.d-imaging.sony.co.jp/www/cscs/lens_body/detail.php?area=jp&lang=es&prdct_name=ILME-FX30&rel_prdct_name=SEL20F18G).

### 4. Insertar batería nativa

- Montar/preparar: Usar una NP-FZ100 previamente cargada; insertar contra la palanca, cerrar y bloquear la cubierta según Sony.
- Lugar: Compartimento de FX30; sin cable externo.
- Comprobar: Retención, cierre y apertura posibles con la jaula; No montar dummy o V-mount implícitamente
- Equilibrio: Masa interna incluida una sola vez; comprobar agarre del conjunto.
- Fuentes: [Sony](https://helpguide.sony.net/ilc/2220/v1/en/contents/TP1000867601.html).

### 5. Comprobar el conjunto antes de usar

- Montar/preparar: Encender sólo tras verificar fijaciones, retención y ventilación.
- Lugar: Rig a mano sin monitor, gimbal ni cables externos.
- Comprobar: Firmware, enfoque y exposición comprobados en el ejemplar; Pantalla, controles y ventilación libres; Para grabar: elegir aparte una tarjeta adecuada al modo; tarjeta y masa no incluidas en este piloto; Antes de retirar batería: apagar y comprobar lámpara de acceso según Sony
- Equilibrio: No certifica seguridad ni sustituye el manual: registrar ensayo físico y masa del conjunto instalado.
- Fuentes: [Sony](https://helpguide.sony.net/ilc/2220/v1/en/contents/TP1000886849.html); [Sony](https://support.d-imaging.sony.co.jp/www/cscs/lens_body/detail.php?area=jp&lang=es&prdct_name=ILME-FX30&rel_prdct_name=SEL20F18G); [SmallRig](https://static.smallrig.com/mall/img/public/1725874097334_.pdf).

No prescribe un par de apriete inventado. La cota Sony menor de 5.5 mm pertenece al tornillo de trípode del cuerpo; no demuestra longitudes de los tornillos suministrados de la jaula.

## 5. Visor

Tres mallas propias aproximadas revisadas en pilot-model-assets.json, disponibles para inspección aislada en Ayuda. Sin reutilizar FX3/SEL1635GM, poses de rig, CAD exacto ni fotografías redistribuidas. El conjunto ensamblado sigue pendiente. Describe el expediente previo. La integración actual, con poses visuales aproximadas y reproducción propia, está en [piloto de planificación](pilot-integration.md).

## 6. Variantes

Una configuración candidata, no una octava plantilla ni modificación de las siete existentes.

No incluidos: Monitor y soporte; Asa XLR-H1; Mic 2 o micrófono externo; Gimbal y BG70; Baseplate y varillas; Matte box y parasol; V-mount y dummy; Splitters, RavenEye y LiDAR; Tarjeta y cargador no elegidos.

## Criterios pendientes

- Documentado: Identidad y pares oficiales; materiales y cotas de montaje incompletos explícitos.
- Documentado: Relaciones documentales, no poses ni holguras medidas.
- Documentado: Alimentación nativa documentada; sin inferir pinout ni rango.
- Documentado: Cinco etapas documentales aplicables, no reproducción ni montaje ensayado.
- Pendiente: Tres modelos aislados aproximados revisados. Poses relacionales del conjunto, encajes y visor de montaje FX30 siguen pendientes; una malla no certifica ajuste.
- Pendiente: Reglas, guía dinámica, selección, guardado y regresiones de interfaz del conjunto pendientes.

Sin ensayo real, dispositivo ni participante inventado. Pruebas de software no cierran esta comprobación.

Validar estructura: `npm run check:catalog`. Exigir liberación: `npm run check:catalog -- --strict` devuelve error mientras falte ensayo físico del conjunto. Ensayo físico y aceptación de beta permanecen separados; un subtotal o una compilación no los certifica.
