# Publicación adicional de Takegrid

## Estado Confirmado

- Enlace adicional público: [Takegrid 0.2.6](https://takegrid-rigs.pabloteran57.chatgpt.site).
- Enlace anterior conservado: [Takegrid en Netlify](https://takegrid.netlify.app/), versión anterior sin sustituir.
- No se contrató un plan ni cambió facturación. El código 0.2.6 se respaldó en el repositorio GitHub existente, sin forzar ni reescribir historial.
- Confirmación de Sites: `succeeded`, `2026-10-07T12:25:25.791214+00:00` (7 de octubre, 07:25 en Ecuador).
- Proyecto: `appgprj_6ac5ca6c160c819191d2bacd7366c426`.
- Versión guardada: `appgprj_6ac5ca6c160c819191d2bacd7366c426~appgver_d045d29baa6481918b48f161364db368` (versión 2 del proveedor).
- Despliegue: `appgdep_6ac63a2b2cd08191b8d4175b94fc5d5d`.
- Revisión principal de origen: `607fd2fa6a81dd56370b6e3f3a70c47b4b6d6e15`.
- Revisión del repositorio estático adicional: `e4c72751f89c99773b2a3435f49c17c6e789a969`.

La URL confirmada de producción, no la URL provisional de registro, es la indicada arriba. La confirmación del proveedor acredita el despliegue; las pruebas de interfaz se realizaron en la compilación pública local.

## Contenido y Persistencia

Copia exacta de los 50 archivos de `dist-public` (5 311 215 bytes sin comprimir), más `.openai/hosting.json` en el paquete. Diecisiete mallas propias aproximadas y diecisiete miniaturas propias; no CAD oficiales ni originales de Sketchfab. El paquete tar confirmado por Sites contiene 51 archivos, mide 5 355 520 bytes y tiene huella `sha256:a395cc8cd75959f7d2afe370930ff14f45381ae3aaa76247ded56e5128453367`. El transporte gzip local mide 1 334 946 bytes y tiene huella `sha256:31bdf60c51b17914ed298038e470b156d590b67f79e66f44edc058e9c4af652b`; la diferencia corresponde al formato de archivo. No incluye referencias del fabricante, investigación privada, capturas, bibliotecas locales ni el GLB oficial de DJI.

La versión 0.2.6 incorpora las cadenas candidatas de soporte de monitor para gimbal, jaula y asa XLR, alimentación local NP-F y selección expresa de piezas faltantes. La [revisión de este bloque](monitor-mount-qa.md) documenta 179 pruebas automatizadas y recorridos manuales con guardado, reapertura y reproducción. La versión anterior 0.2.5 permanece guardada para recuperación; no se forzó una recarga de las pestañas del usuario.

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
