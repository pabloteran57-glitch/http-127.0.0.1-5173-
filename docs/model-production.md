# Producción de modelos realistas

Fuentes canónicas: `data/model-production.json` y `data/model-assets.json`. Revisión 2026-10-06. Estado: `pipeline_prepared_assets_pending`. **0 mallas aprobadas. No se ha sustituido ninguna forma por un recurso sin auditar.**

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

| Orden | Producto | Subcomponente | Estado | Referencias necesarias |
|---|---|---|---|---|
| 1 | FX3 | Producto | `reference_ready_rights_and_mesh_pending` | frontal sin óptica; posterior; lateral de puertos; lateral de empuñadura; superior; inferior |
| 2 | Jaula HawkLock | Producto | `reference_ready_rights_and_mesh_pending` | frontal sin cámara; posterior; superior con zapata inclinada; inferior con placa; lateral con abrazadera HDMI |
| 3 | 16-35 mm GM | Producto | `reference_ready_rights_and_mesh_pending` | lateral completo; frontal sin tapa; montura; lado de controles |
| 4 | Mic 2 | receiver | `reference_ready_rights_and_mesh_pending` | pantalla/dial; zapata integrada; lado OUT y auriculares; lado USB-C |
| 5 | RS 4 Pro | Producto | `reference_ready_rights_and_mesh_pending` | frontal desplegado; posterior; ambos laterales; interfaces de placas y NATO |

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
- [sketchfab-fx3-scan-punitsabnani](https://sketchfab.com/3d-models/sony-fx3-camera-scan-8eaae19fabce47daa5c0d031a1f0fc5e): `quarantine_permission_download_scale_pending`. Página visible sin descarga directa ni licencia reutilizable explícita; autor pide contacto. Escaneo declarado por autor, no CAD Sony. Visor de origen avisó modelo demasiado pesado para el dispositivo de revisión. No se contactó al autor ni se extrajeron buffers del visor. Descargado: no; licencia: sin confirmar.
- [cults-sel1635gm-focus-ring](https://cults3d.com/en/3d-model/gadget/seamless-follow-focus-ring-sony-16-35-2-8-gm): `rejected_wrong_asset_scope`. Modelo de anillo accesorio; sus cotas no son la geometría ni dimensiones completas del objetivo. Descargado: no; licencia: sin confirmar.

## Reconstrucción IA

Meshy confirmado expresamente por el usuario; Yeggi y Sketchfab para búsqueda de recursos existentes. Estado: `awaiting_sufficient_authorized_views_and_connected_account`.

Descarga oficial no equivale a permiso de IA ni de redistribución. No subir referencias sin prueba de permiso. No contratar planes, comprar créditos ni usar servicios de pago sin autorización específica Reconstrucción visual aproximada; no CAD ni evidencia de tornillería, roscas, masa, pinout o tolerancias.

Formulario de registro gratuito abierto: pide correo o proveedor y avisa aceptación de términos al continuar. Usuario autoriza registro; pendiente correo y aceptación explícita de términos en este paso. No se creó cuenta, cargó foto ni consumió crédito.

- [Documentación de Meshy](https://help.meshy.ai/en/articles/9996860-how-to-use-meshy-image-to-3d): Conversión de foto a malla y exportación.
- [Documentación de Meshy](https://help.meshy.ai/en/articles/12634481-how-to-use-multi-view): Multi-View usa una imagen principal y hasta tres adicionales; requiere plan de pago.
- [Documentación de Meshy](https://help.meshy.ai/en/articles/16102098-can-i-use-meshy-assets-commercially): Derechos de resultado dependen del plan y de derechos sobre referencias; free CC BY 4.0 con atribución.

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

Después del piloto, recorrer todas las piezas físicas canónicas por prioridad de uso. Software sin objeto 3D y cables flexibles sin ruta fija inventada. Cada alta repite los mismos controles.

El contrato técnico y los comandos se explican en [Integración GLB](model-asset-contract.md). La reunión exploratoria se mantiene privada, no se cuenta como ensayo puntuado de beta ni concede permisos de fotos.
