# Publicación adicional de Takegrid

## Estado Confirmado

- Enlace adicional público: [Takegrid 0.2.10](https://takegrid-rigs.pabloteran57.chatgpt.site).
- Enlace anterior conservado: [Takegrid en Netlify](https://takegrid.netlify.app/), versión anterior sin sustituir.
- No se contrató un plan ni cambió facturación. El código 0.2.10 se respaldó en el repositorio GitHub existente, sin forzar ni reescribir historial.
- Confirmación de Sites: `succeeded`, `2026-10-08T01:53:49.960858+00:00` (7 de octubre, 20:53 en Ecuador).
- Proyecto: `appgprj_6ac5ca6c160c819191d2bacd7366c426`.
- Versión guardada: `appgprj_6ac5ca6c160c819191d2bacd7366c426~appgver_32b62b26b6f48191bbf223e404774ba1` (versión 7 del proveedor).
- Despliegue: `appgdep_6ac6f7a5a2d081918bdd44d158406f3d`.
- Revisión principal de origen: `e215195fa96b544eb06265fbd2e8ba1460d89ceb`.
- Revisión del repositorio estático adicional: `1e912b17b09b783efecd4b75c532ab158e6ccffb`.

La URL confirmada de producción, no la URL provisional de registro, es la indicada arriba. La confirmación del proveedor acredita el despliegue; las pruebas de interfaz se realizaron en la compilación pública local.

## Contenido Actual

La 0.2.10 contiene una copia exacta de 56 archivos de `dist-public`, 6 310 753 bytes sin comprimir, más el manifiesto de alojamiento. Sites confirmó 57 archivos y un tar de 6 359 040 bytes, huella `sha256:3eac3317cb74b00bfd02800e8ed86db57ee8ff9f521ede3752dd7acc8418e511`. El gzip local mide 1 572 131 bytes, huella `sha256:bd9e78647e54092b03114942933493263859b72382a788ae9c21ff9366738a65`.

Son 20 mallas y 20 miniaturas propias aproximadas activas. FX30, SEL20F18G y NP-FZ100 ahora están disponibles en Crear rig para planificación a mano y horizontal, junto a la jaula 4770. Guía propia de cinco etapas, batería interna y contactos sin cable externo. Accesorios/contextos no revisados siguen elegidos pendientes; no heredan cadenas FX3. Los perfiles y rigs guardados no se migran ni se modifican. [Revisión de integración](pilot-integration-qa.md): 285 comprobaciones de software y recorridos de escritorio/viewport móvil, no dispositivos o rigs físicos. Las siete plantillas y el dominio permanecen; versiones anteriores conservadas, sin recarga forzada.

El empaquetador no completó el paso de preparación en Windows después de enviar la fuente. Se verificó de nuevo la revisión remota exacta; el validador estático oficial y `tar.exe` generaron el archivo sin modificarla. Staging y transporte de esta versión en `research/model-incoming/`, ignorados por Git y excluidos del sitio público.

## Histórico 0.2.9

Confirmado `succeeded` a las 18:37 de Ecuador, 7 de octubre. Versión `appgprj_6ac5ca6c160c819191d2bacd7366c426~appgver_1c0c0e9fea60819182aa30a606f9d07f`, despliegue `appgdep_6ac6d7aba7c08191a5a1455dbfeaa291`, revisión estática `a068b4010274076ab7f08f9a4c93b06d0555ccd4`, fuente `d75f28724339c727040b3099623e404a9e281b3c`. Copia exacta de 56 archivos públicos, 6 279 896 bytes. Tar confirmado: 57 archivos, 6 328 320 bytes, `sha256:ffdcb1e599b45d50c3c353b8f07a61a51c2c2213847f735a0b4cbbb91ee272c5`.

Diecisiete mallas activas y tres del piloto en inspección aislada, veinte miniaturas propias y 261 comprobaciones de software. No activaba el piloto en Crear rig. [Revisión conservada](pilot-model-ui-qa.md).

## Histórico 0.2.8

Actualización documental conservada: versión `appgprj_6ac5ca6c160c819191d2bacd7366c426~appgver_3c090a0388008191b15b3209f10924a1`, despliegue `appgdep_6ac6d0235cb48191ab25c10e43c915e3`, revisión estática `c650ba8eedab790802a393f3e608b67596750e9e`, confirmado a las 18:05 de Ecuador.

Copia exacta de los 50 archivos de `dist-public` (5 347 583 bytes sin comprimir), más `.openai/hosting.json` en el paquete. Diecisiete mallas propias aproximadas y diecisiete miniaturas propias; no CAD oficiales ni originales de Sketchfab. El paquete tar confirmado por Sites contiene 51 archivos, mide 5 396 480 bytes y tiene huella `sha256:7891531f086253f87289c41e84ae08b9e23c92045e61f39eaeab3117f7487c00`. El transporte gzip local mide 1 342 722 bytes y tiene huella `sha256:b9ee329b76dec119e8a293a553e10a6b836365c47b996bebcb0bdf98a8eeaab6`; la diferencia corresponde al formato de archivo. No incluye referencias del fabricante, investigación privada, capturas, bibliotecas locales ni el GLB oficial de DJI.

La versión 0.2.8 conserva las cadenas candidatas y reglas declarativas. Añade accesorios desde la pieza seleccionada, contexto explícito sin imponer gimbal, orientación del monitor según soporte y traslación medida de placa V-mount sin bisagra ficticia. Corrige el bloque blanco de la ficha y la identificación de subconjuntos GLTF, incluido el NATO desmontable con XLR. La [revisión de este bloque](contextual-attachments-qa.md) documenta 228 comprobaciones automatizadas y recorridos locales de escritorio/móvil con monitor, audio, ajustes, guardado, reapertura y reproducción. No activa el lote investigado ni sustituye ensayos físicos. Las versiones anteriores 0.2.5, 0.2.6 y 0.2.7 permanecen guardadas para recuperación; no se forzó una recarga de las pestañas del usuario.

Actualización documental del piloto: fuentes oficiales adicionales y [ficha FX30/SEL20F18G](catalog-pilot-blueprint.md), sin cambio de interfaz o catálogo activo. La [revisión del piloto](catalog-pilot-qa.md) añade 20 pruebas, para 248 comprobaciones de software en total. El build y la publicación no incluyen el piloto como rig montable ni acreditan nuevas pruebas de UX.

Histórico 0.2.8 inicial: despliegue `appgdep_6ac6b58171248191b758ab46fd2ef218`, versión `appgprj_6ac5ca6c160c819191d2bacd7366c426~appgver_cbece2e27de88191b95928ede3f36d39`, revisión estática `da8ad9b7e1280a94a9aadc9577976feae49274f3`, confirmado a las 16:11 de Ecuador. Conservado para recuperación.

Histórico 0.2.7: despliegue `appgdep_6ac645b01f6c8191ab1df6042eae1253`, versión `appgprj_6ac5ca6c160c819191d2bacd7366c426~appgver_4cd1282a92c4819181917f15683e6b50`, revisión estática `3195d068bc075a6db7c7fc54532c8783af92368a`, confirmado a las 08:14 de Ecuador. [Pruebas](extensible-engineering-qa.md).

Histórico 0.2.6: despliegue `appgdep_6ac63a2b2cd08191b8d4175b94fc5d5d`, versión `appgprj_6ac5ca6c160c819191d2bacd7366c426~appgver_d045d29baa6481918b48f161364db368`, revisión estática `e4c72751f89c99773b2a3435f49c17c6e789a969`, confirmado a las 07:25 de Ecuador. [Pruebas](monitor-mount-qa.md).

Los perfiles, borradores e historiales se guardan en el navegador del dominio donde se usaron. Cambiar de dominio, navegador o dispositivo no transfiere esos datos. No se borró ni sobrescribió ninguna biblioteca de Netlify. El enlace compartido no contiene los rigs personales ni permite edición conjunta sincronizada. No se añadió exportación a la interfaz.

## Actualizar Sin Duplicar

1. Mantener el código principal y los datos canónicos en el proyecto y repositorio existentes. Ejecutar sus validaciones, pruebas y `npm run build:public`.
2. Reutilizar la identidad persistida en `hosting/sites-public/.openai/hosting.json`; no registrar otro sitio.
3. Abrir el mismo repositorio estático con el flujo de Sites antes de modificarlo, conservar cambios remotos y actualizar únicamente desde `dist-public`. No copiar `dist` ni `public/references`.
4. Comparar archivos y huellas con la compilación probada; publicar una versión respaldada por el paquete y su revisión exacta. Conservar la versión anterior para recuperación.
5. Confirmar estado `succeeded` antes de comunicar una nueva publicación. El código principal y este alojamiento adicional no están conectados mediante despliegue automático.

El directorio `hosting/sites-public/` está excluido del repositorio principal: su Git es independiente y contiene sólo la copia estática pública y su procedencia. Nunca guardar credenciales del proveedor en ese directorio, documentos, argumentos de shell ni historial.

El flujo de Sites completó y verificó el envío del código, pero su empaquetador Bash no estaba disponible en este Windows. Se utilizó el mismo validador estático oficial `prepare-site-build.cjs` y `tar.exe` para empaquetar sin modificar la fuente enviada. El manifiesto y todos los recursos fueron incluidos en el guardado nativo de versión. El staging y archivo de transporte quedan en `research/private/`, fuera de la publicación.

## Límites Pendientes

La publicación no libera beta ni certifica mecánica, electricidad, fluidez, permisos comerciales adicionales o modelos exactos. Continúan las solicitudes de archivos autorizados FX3/RS 4 Pro, la cobertura restante del catálogo y las pruebas con usuarios/rig físico. No se ha comprobado navegación en el nuevo dominio; sí la interfaz y persistencia en la compilación pública local y la finalización remota por el proveedor.
