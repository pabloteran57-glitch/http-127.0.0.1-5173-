# Publicación adicional de Takegrid

## Estado Confirmado

- Enlace adicional público: [Takegrid 0.2.8](https://takegrid-rigs.pabloteran57.chatgpt.site).
- Enlace anterior conservado: [Takegrid en Netlify](https://takegrid.netlify.app/), versión anterior sin sustituir.
- No se contrató un plan ni cambió facturación. El código 0.2.8 se respaldó en el repositorio GitHub existente, sin forzar ni reescribir historial.
- Confirmación de Sites: `succeeded`, `2026-10-07T21:11:39.086201+00:00` (7 de octubre, 16:11 en Ecuador).
- Proyecto: `appgprj_6ac5ca6c160c819191d2bacd7366c426`.
- Versión guardada: `appgprj_6ac5ca6c160c819191d2bacd7366c426~appgver_cbece2e27de88191b95928ede3f36d39` (versión 4 del proveedor).
- Despliegue: `appgdep_6ac6b58171248191b758ab46fd2ef218`.
- Revisión principal de origen: `2a05d83c853d321e02a64222ccb8a7e918a50a39`.
- Revisión del repositorio estático adicional: `da8ad9b7e1280a94a9aadc9577976feae49274f3`.

La URL confirmada de producción, no la URL provisional de registro, es la indicada arriba. La confirmación del proveedor acredita el despliegue; las pruebas de interfaz se realizaron en la compilación pública local.

## Contenido y Persistencia

Copia exacta de los 50 archivos de `dist-public` (5 344 841 bytes sin comprimir), más `.openai/hosting.json` en el paquete. Diecisiete mallas propias aproximadas y diecisiete miniaturas propias; no CAD oficiales ni originales de Sketchfab. El paquete tar confirmado por Sites contiene 51 archivos, mide 5 386 240 bytes y tiene huella `sha256:f5fd7a7cbf29da9ce27454c52769337ad1a5bf1deb9248f638e259d44fd2ed75`. El transporte gzip local mide 1 341 795 bytes y tiene huella `sha256:ceb52394aa2488f112adb5b9e03aaa6aa73a7c92063010e202baaa039d360892`; la diferencia corresponde al formato de archivo. No incluye referencias del fabricante, investigación privada, capturas, bibliotecas locales ni el GLB oficial de DJI.

La versión 0.2.8 conserva las cadenas candidatas y reglas declarativas. Añade accesorios desde la pieza seleccionada, contexto explícito sin imponer gimbal, orientación del monitor según soporte y traslación medida de placa V-mount sin bisagra ficticia. Corrige el bloque blanco de la ficha y la identificación de subconjuntos GLTF, incluido el NATO desmontable con XLR. La [revisión de este bloque](contextual-attachments-qa.md) documenta 228 comprobaciones automatizadas y recorridos locales de escritorio/móvil con monitor, audio, ajustes, guardado, reapertura y reproducción. No activa el lote investigado ni sustituye ensayos físicos. Las versiones anteriores 0.2.5, 0.2.6 y 0.2.7 permanecen guardadas para recuperación; no se forzó una recarga de las pestañas del usuario.

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
