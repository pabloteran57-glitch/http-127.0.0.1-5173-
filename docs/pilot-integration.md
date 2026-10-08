# Piloto FX30 integrado para planificación

Generado desde data/pilot-integration.json y manifiestos canónicos. Estado: planning_candidate; revisión 2026-10-07.

## 1. Manifiesto

- Sony FX30, ILME-FX30: 562 g aproximados. [Fuente oficial](https://www.sony.jp/pro-cam/products/ILME-FX30/spec.html).
- Sony FE 20mm F1.8 G, SEL20F18G: 373 g aproximados. [Fuente oficial](https://www.sony.jp/ichigan/products/SEL20F18G/spec.html).
- Sony NP-FZ100 Rechargeable Battery Pack, NP-FZ100: 83 g aproximados. [Fuente oficial](https://electronics.sony.com/imaging/imaging-accessories/interchangeable-lens-camera-accessories/p/npfz100?sku=npfz100).

El cuerpo usa 562 g sin batería ni tarjeta; NP-FZ100 añade 83 g una sola vez. Con SEL20F18G (373 g) y kit 4770 (208 g), subtotal documental aproximado de 1226 g. Tarjeta, parasol, tapas y diferencias del subconjunto de jaula no incluidos.

## 2. Distribución

Cuerpo a mano, óptica coaxial sobre montura E, jaula 4770 alrededor y batería dentro del compartimento nativo. Poses del visor aproximadas, nunca coordenadas mecánicas. El expediente físico catalog-pilot conserva valores sin medir. La pose interna permite visualización y no describe orientación exacta de contactos ni inserción.

## 3. Conexión

NP-FZ100 → alojamiento FX30: contactos internos. No cable externo, D-Tap ni regulador. 7.2 V nominales, no rango de descarga o pinout. Puertos FX30 propios; HDMI/MIC tienen anotaciones visuales aproximadas y circuitos revisados aparte. No se activa control USB-C heredado de FX3. Evidencia específica en connection-reviews.json. Monitor serie L usa su placa nativa, no el barril DC.

## 4. Guía

Cinco etapas del núcleo; hasta diez al elegir monitor NATO y RX. Soporte, pantalla, batería del monitor, RX, HDMI y TRS tienen pasos propios que sólo aparecen por selección. Si no eliges una pieza, no se añade ni se reproduce su etapa. Comprobación final se conserva. En Montaje, Ver batería interna en despiece muestra la pieza oculta; transición ilustrativa, no inserción física.

## 5. Visor y guardado

Tres mallas originales con sus huellas revisadas y miniaturas propias; no reutilizan FX3 o SEL1635GM. Selección directa en Crear rig, cuatro tareas y Mis rigs existentes. Guardado, historial y recuperación locales; revisión de biblioteca conservada mediante alta aditiva. Ninguna selección, plantilla o perfil anterior cambia automáticamente.

## 6. Alcance y variantes

Sólo a mano y horizontal. Elige cámara/óptica en Cámara y óptica, jaula en Jaulas y accesorios y batería en Alimentación. Las siete plantillas FX3 permanecen intactas. Monitor NATO/serie L y RX sobre jaula son candidatos documentales. [Cadenas y ejemplos](fx30-accessories.md). Puedes guardar combinaciones incompletas y accesorios fuera de ese alcance como pendientes; no se fabrican sus montajes, guía o conexiones.

## Evidencia y pendientes

Software: verified_software_only. Ejecutar npm run test:catalog y npm run build:public. Registro de interfaz: [pruebas del núcleo](pilot-integration-qa.md) y [monitor/audio](fx30-accessories-qa.md).

- Ensayo del conjunto y masa del subconjunto real de jaula
- Retención, cubierta de batería y ventilación con jaula
- Tarjeta apropiada al modo de grabación elegida aparte
- Gimbal, asa XLR, control, adaptador de cámara y V-mount requieren cadenas FX30 propias. Monitor y RX son candidatos documentales, sin ensayos de señal, niveles o retención.
- Usuarios y dispositivos físicos de referencia para beta

Física: pending. Sin ensayo, dispositivos ni participantes inventados. Esta integración no cierra catálogo completo, beta ni financiación.
