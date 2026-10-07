# Publicación adicional de Takegrid

## Estado Confirmado

- Enlace adicional público: [Takegrid 0.2.5](https://takegrid-rigs.pabloteran57.chatgpt.site).
- Enlace anterior conservado: [Takegrid en Netlify](https://takegrid.netlify.app/), versión anterior sin sustituir.
- No se contrató un plan, cambió facturación ni alteró el repositorio GitHub existente.
- Confirmación de Sites: `succeeded`, `2026-10-07T04:30:42.483367+00:00` (6 de octubre en Ecuador).
- Proyecto: `appgprj_6ac5ca6c160c819191d2bacd7366c426`.
- Versión guardada: `appgprj_6ac5ca6c160c819191d2bacd7366c426~appgver_ec42dcb3ba1c8191b5b00593b14b7532`.
- Despliegue: `appgdep_6ac5cae5bab48191a1fb44fd33253f6b`.
- Revisión principal de origen: `a29188f145b0fdf11cb14978fabeeb61321f81cd`.
- Revisión del repositorio estático adicional: `aa6545a6f4e30ad0b5af80aa9eb4c9a62b162ddc`.

La URL confirmada de producción, no la URL provisional de registro, es la indicada arriba. La confirmación del proveedor acredita el despliegue; las pruebas de interfaz se realizaron en la compilación pública local.

## Contenido y Persistencia

Copia exacta de los 30 archivos de `dist-public` (4 822 450 bytes sin comprimir), más `.openai/hosting.json` en el paquete. Catorce mallas propias aproximadas; no CAD oficiales ni originales de Sketchfab. El archivo guardado por Sites contiene 31 archivos y tiene huella `sha256:28b50c53ea6e324b764dc0eb646776bec027be21bb0a3a197779233b2c7c5675`. No incluye referencias del fabricante, investigación privada, capturas, bibliotecas locales ni el GLB oficial de DJI.

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
