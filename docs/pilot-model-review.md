# Modelos del piloto

Generado desde data/pilot-model-assets.json. Revisión 2026-10-07. Expediente de revisión visual de origen. Integración actual acotada en [piloto de planificación](pilot-integration.md).

## Sony FX30

- Modelo exacto: ILME-FX30. Autoría propia; geometría y materiales aproximados.
- GLB: 496976 bytes, 10240 triángulos; huella SHA-256: 4606df81336ebe2156b08c666301df8f725a02d07fad5798b4caa52d762ecdd3.
- Envolvente visual X/Y/Z: 130.33 / 81.85 / 84.50 mm, no cotas de mecanizado.
- Referencia: [fuente oficial](https://www.sony.jp/pro-cam/products/ILME-FX30/spec.html). Sony publica cuerpo sin salientes aprox. 129.7 x 77.8 x 84.5 mm. La malla incluye cubiertas, zapata y controles estimados: envolvente visual 130.33 x 81.85 x 84.50 mm, no una correccion del dato oficial. Sensor APS-C 23.3 x 15.5 mm publicado, pose estimada. LCD cerrado. Cubiertas opacas: sin puertos, contactos, roscas o bayoneta mecanicos.
- Revisión: Revisado el 2026-10-07: perspectiva, frontal, posterior, lateral y superior del codigo propio cotejados con referencias oficiales del modelo exacto. Contact sheet local; encajes, materiales, controles y formas sin medicion mecanica.
- Derechos: Sony FX30: reconstruccion propia Takegrid, 2026. Materiales y formas aproximados, sin respaldo ni permiso de fabricacion del fabricante.
- Referencias consultadas, no redistribuidas: [Sony](https://www.sony.jp/products/picture/ILME-FX30_Gallery_02.jpg); [Sony](https://www.sony.jp/products/picture/ILME-FX30_Gallery_05.jpg); [Sony](https://www.sony.jp/products/picture/ILME-FX30_Gallery_07.jpg); [Sony](https://www.sony.jp/products/picture/ILME-FX30_Gallery_08.jpg); [Sony](https://www.sony.jp/products/picture/ILME-FX30_Gallery_09.jpg).

## Sony FE 20mm F1.8 G

- Modelo exacto: SEL20F18G. Autoría propia; geometría y materiales aproximados.
- GLB: 309804 bytes, 7380 triángulos; huella SHA-256: 17c7d9ddaf60f9761fcdfdaa3ea96c602aba5a421d594957b82c90254ed970eb.
- Envolvente visual X/Y/Z: 73.50 / 73.50 / 84.70 mm, no cotas de mecanizado.
- Referencia: [fuente oficial](https://www.sony.jp/ichigan/products/SEL20F18G/). D 73.5 x L 84.7 mm publicados; filtro nominal 67 mm. Perfil propio, enfoque, apertura, selector y boton estimados. Sin parasol ALC-SH162, tapas, texturas, contactos o patron mecanico de montura. No hereda el zoom SEL1635GM.
- Revisión: Revisado el 2026-10-07: perspectiva, frontal, posterior, lateral y superior del codigo propio cotejados con referencias oficiales del modelo exacto. Contact sheet local; encajes, materiales, controles y formas sin medicion mecanica.
- Derechos: Sony FE 20mm F1.8 G: reconstruccion propia Takegrid, 2026. Materiales y formas aproximados, sin respaldo ni permiso de fabricacion del fabricante.
- Referencias consultadas, no redistribuidas: [Sony](https://www.sony.jp/ichigan/products/SEL20F18G/); [Sony](https://www.sony.jp/products/picture/SEL20F18G.jpg).

## Sony NP-FZ100 Rechargeable Battery Pack

- Modelo exacto: NP-FZ100. Autoría propia; geometría y materiales aproximados.
- GLB: 80488 bytes, 1460 triángulos; huella SHA-256: b686452eb0158f6d9734bdaed1660573074b6afe99210f81cc838bd51f3de026.
- Envolvente visual X/Y/Z: 38.70 / 22.77 / 51.70 mm, no cotas de mecanizado.
- Referencia: [fuente oficial](https://electronics.sony.com/imaging/imaging-accessories/interchangeable-lens-camera-accessories/p/npfz100?sku=npfz100). Sony publica aprox. 38.7 x 22.7 x 51.7 mm. Carcasa propia y juntas estimadas; altura visual 22.77 mm, no cota de fabricacion. Cara de insercion opaca, sin inventar contactos, pinout o posicion interna en FX30. Sin etiqueta o imagen copiada.
- Revisión: Revisado el 2026-10-07: perspectiva, frontal, posterior, lateral y superior del codigo propio cotejados con referencias oficiales del modelo exacto. Contact sheet local; encajes, materiales, controles y formas sin medicion mecanica.
- Derechos: Sony NP-FZ100 Rechargeable Battery Pack: reconstruccion propia Takegrid, 2026. Materiales y formas aproximados, sin respaldo ni permiso de fabricacion del fabricante.
- Referencias consultadas, no redistribuidas: [Sony](https://electronics.sony.com/imaging/imaging-accessories/interchangeable-lens-camera-accessories/p/npfz100?sku=npfz100).

## Comprobación y alcance

Tres GLB y tres WebP propios. No usan fotografías, texturas, escaneos, CAD o activos IA externos. Las 17 mallas originales conservan sus huellas; las tres mallas del piloto se promueven explícitamente sin modificar su geometría. Los puertos FX30 permanecen sin coordenadas en ports-manifest; ninguna malla autoriza un cable, asiento o contacto.

El presupuesto público pasa de 6 a 7 MB para admitir 887268 bytes de modelos nuevos y 25232 bytes de miniaturas, más código de inspección. Carga GLB bajo demanda, sin precarga sin conexión.

Regenerar candidatos: npm run build:pilot-models. Revisar las cinco vistas locales antes de actualizar manualmente huellas. Verificar: npm run test:catalog y npm run build:public. La selección y guía propias están integradas; las poses del conjunto son sólo visuales y aproximadas. El ensayo físico sigue pendiente.
