# Producción de modelos realistas

Fuentes canónicas: `data/model-production.json` y `data/model-assets.json`. Revisión 2026-10-06. Estado: `authored_approximate_batch_original_exact_assets_pending`. **17 mallas aprobadas. No se ha sustituido ninguna forma por un recurso sin auditar.**

## Acción por acción

1. Verificar identidad exacta, revisión y alcance de dimensiones.
2. Buscar CAD oficial autorizado y después malla comunitaria con licencia verificable.
3. Si no hay recurso reutilizable, recopilar fotos propias/autorizadas para reconstrucción manual o IA.
4. Reconstruir sin lente/asa/accesorios fusionados, respetando pieza o subcomponente elegido.
5. Calibrar con escala uniforme y referencias trazables; nunca deformar XYZ para fingir exactitud.
6. Comparar frontal, lateral, superior y posterior, interfaces y envolvente.
7. Optimizar malla/materiales para web y validar archivo GLB autocontenido.
8. Registrar hash, autor, licencia, evidencia y atribución antes de integrar.
9. Probar ensamble, despiece, vertical, audio y montaje móvil sin mover puertos canónicos.

## Primer lote, mismo catálogo

Reconstrucciones propias aproximadas; no descargas de Sketchfab ni resultados de Meshy. [Procedencia y uso](authored-model-rights.md). Aprobar una malla visual no verifica asiento, tolerancias ni funcionamiento del rig.

| Pieza representada | Archivo | Triángulos | Bytes | Alcance de referencia |
|---|---|---:|---:|---|
| FX3 | `/models/sony-fx3-takegrid-v1.glb` | 12808 | 608396 | Cuerpo ILME-FX3 129.7 × 77.8 × 84.5 mm, sin salientes, en manifiesto. Malla incluye controles y zapata estimados; su altura 82.9 mm no se presenta como la cota publicada. Roscas y bayoneta sólo visuales. |
| 16-35 mm GM | `/models/sony-fe-16-35-gm-takegrid-v1.glb` | 9588 | 404296 | SEL1635GM primera generación, diámetro 88.5 y longitud 121.6 mm publicados. Perfil, estriado y controles estimados, sin parasol ni extensión de zoom medida. |
| Jaula HawkLock | `/models/smallrig-4770-takegrid-v1.glb` | 4996 | 236268 | Kit 4770 160 × 101.2 × 66.2 mm publicado. Marco abierto y zapata de página 4; forma estimada. Altura 110.18 mm incluye la pose candidata de zapata canónica: discrepancia no corregida por deformación ni declarada exacta. |
| Base 1674 | `/models/smallrig-1674-takegrid-v1.glb` | 2420 | 116664 | Cuerpo publicado 80 × 80 × 26 mm; 15 mm de paso y 60 mm entre varillas. Palancas y salientes estimados llevan envolvente de malla a 90 × 28.35 × 80 mm. |
| Varillas de 8 pulgadas | `/models/smallrig-rods-8in-takegrid-v1.glb` | 2560 | 70984 | Par con 15 mm de diámetro exterior, pared de 2 mm y 203.2 mm de longitud publicados; centros a 60 mm. Acentos visuales añaden 0.01 mm, no textura ni material medido. |
| Parasol Star-Trail | `/models/smallrig-3645-takegrid-v1.glb` | 2484 | 120124 | Envolvente del cuerpo 156 × 116 × 32 mm aproximada en layout. Malla con bandera estimada desplegada, no comparar su caja total con medidas del cuerpo. Filtro y perfil no verifican asiento. |
| Placa V-mount | `/models/smallrig-3203b-takegrid-v1.glb` | 2652 | 120228 | 168.7 × 108 × 33 mm publicados; abrazadera superior según manual página 5. Asiento V, palancas y agujeros sólo ilustrativos; masa sigue siendo 351 g conservadores. |
| VB99 Pro | `/models/smallrig-vb99-pro-takegrid-v1.glb` | 4260 | 215404 | 4292, 107.2 × 73.2 × 55.2 mm publicados. Relieves y pantalla ilustrativos; puertos y límites eléctricos siguen en manifiestos. |
| RS 4 Pro | `/models/dji-rs4-pro-combo-takegrid-v1.glb` | 7832 | 371872 | Sólo unidad superior RS 4 Pro estimada, sin BG30/cámara/lente/trípode fusionados. Las cotas DJI desplegado con grip estándar no aplican a esta subescena; no se deforma para igualarlas. No es el archivo DJI_RS4_PRO_2 ni el GLB DJI. |
| BG70 | `/models/dji-rs-bg70-takegrid-v1.glb` | 892 | 47504 | Envolvente 43 × 165 × 43 mm aproximada en layout. Referencia visual BG70 separada del gimbal; geometría exacta del fabricante pendiente. |
| Soporte de monitor | `/models/smallrig-3026b-takegrid-v1.glb` | 2768 | 141452 | 3026B, 152.6 × 54.8 × 38 mm publicados en otra pose; brazo y cabezal aproximados. Conserva la orientación candidata del layout; sin adaptadores ficticios ni carga dinámica certificada. |
| Indie 7 | `/models/smallhd-indie-7-takegrid-v1.glb` | 6640 | 324300 | 180.1 × 118.6 × 33.5 mm publicados. Pantalla frontal -Z, dos alojamientos NP-F vacíos y rosca inferior ilustrativa; no se añaden baterías ni se certifica pinout. |
| Mic 2 / receiver | `/models/dji-mic-2-kit-takegrid-v1.glb` | 3184 | 158944 | Sólo DMR02 RX, 54.2 × 28.36 × 22.49 mm y 28 g publicados; ejes adaptados al layout. Zapata integrada, OLED y dial estimados. No se fusionan TX/estuche ni se simula adaptador MI. |
| XLR-H1 | `/models/sony-xlr-h1-takegrid-v1.glb` | 4560 | 227200 | XLR-H1; envolvente 65 × 78 × 128 mm aproximada en layout. Pie, mandos y conectores estimados; no verifica roscas, asiento ni compatibilidad con gimbal. |
| Soporte NATO de monitor 2906B | `/models/smallrig-2906b-takegrid-v1.glb` | 2568 | 130192 | Envolvente de planificación XYZ 52.6 × 53.8 × 36 mm; malla 56.50 × 53.80 × 32.00 mm. Contorno, controles, contactos y holguras aproximados desde referencias. No deformada para igualar cotas; no CAD ni encaje probado. |
| Extensión y riel XLR 4830 | `/models/smallrig-4830-takegrid-v1.glb` | 2292 | 113592 | Envolvente de planificación XYZ 55.8 × 77.5 × 124.8 mm; malla 66.00 × 59.55 × 122.00 mm. Contorno, controles, contactos y holguras aproximados desde referencias. No deformada para igualar cotas; no CAD ni encaje probado. |
| Batería Sony NP-F970/PRO | `/models/sony-np-f970-pro-takegrid-v1.glb` | 1540 | 79280 | Envolvente de planificación XYZ 38.4 × 70.8 × 60 mm; malla 38.40 × 70.80 × 61.25 mm. Contorno, controles, contactos y holguras aproximados desde referencias. No deformada para igualar cotas; no CAD ni encaje probado. |

| Orden | Producto | Subcomponente | Estado | Referencias necesarias |
|---|---|---|---|---|
| 1 | FX3 | Producto | `authored_approximate_mesh_exact_asset_pending` | frontal sin óptica; posterior; lateral de puertos; lateral de empuñadura; superior; inferior |
| 2 | Jaula HawkLock | Producto | `authored_approximate_mesh_exact_asset_pending` | frontal sin cámara; posterior; superior con zapata inclinada; inferior con placa; lateral con abrazadera HDMI |
| 3 | 16-35 mm GM | Producto | `authored_approximate_mesh_exact_asset_pending` | lateral completo; frontal sin tapa; montura; lado de controles |
| 4 | Mic 2 | receiver | `authored_approximate_mesh_exact_asset_pending` | pantalla/dial; zapata integrada; lado OUT y auriculares; lado USB-C |
| 5 | RS 4 Pro | Producto | `authored_approximate_mesh_exact_asset_pending` | frontal desplegado; posterior; ambos laterales; interfaces de placas y NATO |

### FX3

- ILME-FX3, no FX30 ni FX3A
- Cotas publicadas excluyen salientes: no asumir bounding box del escaneo equivalente
- Cuerpo separado de lente, XLR y jaula
- 630 g cuerpo solo según Sony US; 715 g con batería/tarjeta. 640 g anteriores sin respaldo corregidos en manifiesto

### Jaula HawkLock

- 4770, no 4183 ni 4771
- Conservar huecos y zapata; no cerrar la jaula como bloque sólido
- Fotografías no verifican posición/tolerancia de roscas ni asiento

### 16-35 mm GM

- SEL1635GM primera generación, no GM II
- Separar parasol de óptica si no se incluye en la configuración
- Un anillo de follow focus imprimible no es el modelo del objetivo

### Mic 2

- DMR02, sólo RX; no fusionar TX ni estuche
- 28 g y envolvente de receptor publicados
- Posición de puertos y asiento conservan incertidumbre canónica

### RS 4 Pro

- RS 4 Pro, no RS 4
- Separar BG30 y usar BG70 elegido
- Dimensiones DJI desplegado con grip estándar no certifican rig con BG70
- Malla decorativa no aporta cinemática ni límites de motores

## Recursos investigados

- [dji-rs4-pro-official-ar](https://www.dji.com/global/rs-4-pro?site=brandsite): `downloaded_quarantine_rights_component_separation_and_draco_pending`. URL expuesta por model-viewer en la sección 3D oficial, no extraída de buffers privados. Archivo descargado únicamente para referencia local, fuera del paquete público. Grafo incluye CAMERA_CINE_DFM, óptica 50 F1P2, motor y cables; no es el componente RS 4 Pro aislado. DJI advierte que las dimensiones de esa vista pueden diferir del producto real. Permiso de modificación/redistribución y separación BG30/BG70 pendientes; no usar su cámara como Sony FX3. No se relajó el importador ni se movieron puertos para admitir esta escena. Descargado: sí; licencia: sin confirmar.
- [yeggi-fx3-accessories-search](https://www.yeggi.com/q/sony%2Bfx3/): `search_reviewed_no_matching_body_asset_confirmed`. Resultados revisados: bandejas, protectores, jaulas de terceros y rigs DIY, no cuerpo ILME-FX3 autorizado confirmado. Yeggi es un índice: descarga y licencia deben comprobarse en la página del creador. No se usaron cotas de un accesorio imprimible como cotas de cámara o de HawkLock 4770. Descargado: no; licencia: sin confirmar.
- [sketchfab-fx3-scan-punitsabnani](https://sketchfab.com/3d-models/sony-fx3-camera-scan-8eaae19fabce47daa5c0d031a1f0fc5e): `permission_requested_file_scale_pending`. Página visible sin descarga directa ni licencia reutilizable explícita; autor pide contacto. Escaneo declarado por autor, no CAD Sony; original PLY de aproximadamente 98 MB según descripción, sin UV/PBR. Visor de origen avisó modelo demasiado pesado para el dispositivo de revisión. Solicitud de archivo, uso web comercial, optimización y unidades enviada con autorización del usuario; respuesta y permiso pendientes. No se extrajeron buffers del visor. Descargado: no; licencia: sin confirmar.
- [sketchfab-dji-rs4-pro-2-user-reference](https://sketchfab.com/3d-models/dji-rs4-pro-2-3f1e362f18b842389f0e2d6172cd230a): `quarantine_download_license_component_scope_scale_pending`. Enlace exacto DJI_RS4_PRO_2 enviado por el usuario; revisado en navegador. Página no expone descarga ni licencia reutilizable verificadas. Archivo y separación de grip/cámara/lente no confirmados; no se extraen buffers. No se atribuye esta malla a la reconstrucción propia de Takegrid ni se afirma equivalencia con el GLB oficial DJI. Descargado: no; licencia: sin confirmar.
- [sketchfab-a7iv-sel1635-scan-free-candidate](https://sketchfab.com/3d-models/sony-a7m4-with-gm1635-f28-93fb2cac30e741f580faf022795f7d50): `not_imported_fused_wrong_camera_lens_isolation_pending`. Recurso gratuito con control Download 3D Model y atribución en página. Escaneo A7 IV con objetivo fusionado, no FX3; no sustituye el cuerpo canónico. Revisión exacta SEL1635GM, separación, escala y presupuesto web requieren revisión del archivo antes de usarlo. Descargado: no; licencia: CC Attribution publicada; versión y archivo pendientes de comprobar.
- [cults-sel1635gm-focus-ring](https://cults3d.com/en/3d-model/gadget/seamless-follow-focus-ring-sony-16-35-2-8-gm): `rejected_wrong_asset_scope`. Modelo de anillo accesorio; sus cotas no son la geometría ni dimensiones completas del objetivo. Descargado: no; licencia: sin confirmar.

## Reconstrucción IA

Meshy confirmado expresamente por el usuario; Yeggi y Sketchfab para búsqueda de recursos existentes. Estado: `connected_free_account_authorized_views_pending`.

Descarga oficial no equivale a permiso de IA ni de redistribución. No subir referencias sin prueba de permiso. No contratar planes, comprar créditos ni usar servicios de pago sin autorización específica Reconstrucción visual aproximada; no CAD ni evidencia de tornillería, roscas, masa, pinout o tolerancias.

Usuario inició sesión en Meshy en Edge. Cuenta gratuita observada el 6 de octubre: 100 créditos; no se cargó foto, lanzó tarea, descargó salida ni consumió crédito. El acceso no resuelve derechos ni vistas faltantes.

- [Documentación de Meshy](https://help.meshy.ai/en/articles/9996860-how-to-use-meshy-image-to-3d): Conversión de foto a malla y exportación.
- [Documentación de Meshy](https://help.meshy.ai/en/articles/12634481-how-to-use-multi-view): Multi-View usa una imagen principal y hasta tres adicionales; requiere plan de pago.
- [Documentación de Meshy](https://help.meshy.ai/en/articles/16102098-can-i-use-meshy-assets-commercially): Derechos de resultado dependen del plan y de derechos sobre referencias; free CC BY 4.0 con atribución.
- [Documentación de Meshy](https://help.meshy.ai/en/articles/15696428-what-is-included-on-the-free-plan): Plan gratuito consultado: créditos mensuales y descargas limitadas de Meshy 6 Lite; no asumir funciones de planes de pago.

## Fotografías con licencia revisada

- [fx3-henry-ccby2-front](https://commons.wikimedia.org/wiki/File:Sony_FX3_with_Sony_FE_24mm_F1.4_GM_-_by_Henry_S%C3%B6derlund_(51061907312).jpg): Foto original revisada visualmente: FX3 frontal con FE 24mm F1.4 GM distinto de SEL1635GM; no basta para cuerpo aislado/multivista, puertos ni jaula. Conservada localmente, sin publicación ni carga IA. Sony FX3 with Sony FE 24mm F1.4 GM, Henry Söderlund, 9 de marzo de 2021, CC BY 2.0. Original sin modificaciones; sin respaldo implícito del autor/Sony. [Licencia](https://creativecommons.org/licenses/by/2.0/). Descarga 10015183 bytes; SHA-256 `967d94ebc1196911acc75ba5998e3cbddc12434b87e87f73e03c688442e8d19d`.

## Puertas de liberación

- Identidad/revisión y componente correctos
- Licencia, modificación y distribución web comercial verificadas
- Derechos de imágenes/IA comprobados si aplica
- GLB autocontenido, hash y límites auditados
- Escala uniforme, base de referencia y revisión visual documentadas
- Puertos, soporte, masa y cables siguen en manifiestos
- Atribución visible, regresiones y comparación móvil

17 nodos del layout tienen reconstrucción propia aproximada. No se da por cumplida la petición de módulos exactos: CAD/escaneos y el resto de piezas físicas siguen pendientes. Software sin objeto 3D, cables sin trayectoria física inventada y accesorios en reserva sin soporte ficticio. Cada alta repite los controles.

## Resto del catálogo actual

- **Adaptador NP-FZ100**: `cable_connector_geometry_pending`. Circuito y extremos conservados en cables/puertos; dummy, regulador y conectores requieren forma verificada. No fingir un cable rígido exacto.
- **HDMI Kondor Blue**: `cable_connector_geometry_pending`. Recorrido lógico flexible existente; forma y esfuerzo de cable espiral no medidos.
- **HDMI A-C DJI**: `cable_connector_geometry_pending`. Extremos HDMI A/C documentados, ruta de banco; conectores no modelados.
- **Control USB-C DJI**: `cable_connector_geometry_pending`. Ruta USB-C activa según selección; forma de conectores y radios por medir.
- **D-Tap a DC SmallHD**: `cable_connector_geometry_pending`. Exterior 5.5 mm y polaridad del cable publicados; interior del cable y ajuste físico pendientes. Entrada del monitor 2.0/5.5 mm y centro positivo documentados por separado.
- **Focus Pro LiDAR**: `reserve_component_geometry_pending`. Modelo separado, revisión y soporte por verificar; sin activación ni cableado implícitos.
- **Motor Focus Pro**: `reserve_component_geometry_pending`. Motor separado; anillo y calibración SEL1635GM no resueltos.
- **Interfaz LiDAR / Transmission**: `reserve_component_geometry_pending`. No usar como RavenEye ni activarlo sin DJI Transmission correspondiente.
- **Distribuidor StarTech**: `reserve_component_geometry_pending`. Sin montaje de gimbal verificado; se conserva sólo en lógica de banco.
- **RavenEye**: `reserve_component_geometry_pending`. RavenEye separado; soporte y doble HDMI no verificados en rig móvil.
- **Micrófono de solapa DJI**: `off_camera_geometry_pending`. Accesorio del sujeto conectado a TX; no se instala en cámara por seleccionar audio.
- **Aplicación Ronin**: `software_no_mesh`. Aplicación, sin objeto mecánico ni masa física.
- **Monitor & Control**: `software_no_mesh`. Aplicación, sin objeto mecánico ni masa física.

El contrato técnico y los comandos se explican en [Integración GLB](model-asset-contract.md). La reunión exploratoria se mantiene privada, no se cuenta como ensayo puntuado de beta ni concede permisos de fotos.
