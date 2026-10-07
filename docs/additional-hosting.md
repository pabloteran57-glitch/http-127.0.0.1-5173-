# Publicación adicional de Takegrid

## Estado Confirmado

- Enlace adicional público: [Takegrid 0.2.7](https://takegrid-rigs.pabloteran57.chatgpt.site).
- Enlace anterior conservado: [Takegrid en Netlify](https://takegrid.netlify.app/), versión anterior sin sustituir.
- No se contrató un plan ni cambió facturación. El código 0.2.7 se respaldó en el repositorio GitHub existente, sin forzar ni reescribir historial.
- Confirmación de Sites: `succeeded`, `2026-10-07T13:14:31.749355+00:00` (7 de octubre, 08:14 en Ecuador).
- Proyecto: `appgprj_6ac5ca6c160c819191d2bacd7366c426`.
- Versión guardada: `appgprj_6ac5ca6c160c819191d2bacd7366c426~appgver_4cd1282a92c4819181917f15683e6b50` (versión 3 del proveedor).
- Despliegue: `appgdep_6ac645b01f6c8191ab1df6042eae1253`.
- Revisión principal de origen: `adc9764bc314d77362621852f80e3d9396e6dcd6`.
- Revisión del repositorio estático adicional: `3195d068bc075a6db7c7fc54532c8783af92368a`.

La URL confirmada de producción, no la URL provisional de registro, es la indicada arriba. La confirmación del proveedor acredita el despliegue; las pruebas de interfaz se realizaron en la compilación pública local.

## Contenido y Persistencia

Copia exacta de los 50 archivos de `dist-public` (5 306 663 bytes sin comprimir), más `.openai/hosting.json` en el paquete. Diecisiete mallas propias aproximadas y diecisiete miniaturas propias; no CAD oficiales ni originales de Sketchfab. El paquete tar confirmado por Sites contiene 51 archivos, mide 5 355 520 bytes y tiene huella `sha256:f2214781dc6452f79a647cbffde771d7b6402ff562006d6c1a1928b3f5eacc90`. El transporte gzip local mide 1 333 249 bytes y tiene huella `sha256:3e36418fb603850f995f60beadd099c9aeea533a5ffa16a9fa446f66b1567d50`; la diferencia corresponde al formato de archivo. No incluye referencias del fabricante, investigación privada, capturas, bibliotecas locales ni el GLB oficial de DJI.

La versión 0.2.7 conserva las cadenas candidatas de monitor de 0.2.6 y desacopla soporte, contexto, guía y visor mediante reglas declarativas. La [revisión de este bloque](extensible-engineering-qa.md) documenta 194 comprobaciones automatizadas y recorridos locales de escritorio/móvil con monitor, audio, guardado, reapertura y reproducción. No activa el lote investigado ni sustituye ensayos físicos. Las versiones anteriores 0.2.5 y 0.2.6 permanecen guardadas para recuperación; no se forzó una recarga de las pestañas del usuario.

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
