# Operación y publicación

Versión actual de código: `data/release.json`. Estado: prototipo de ingeniería, no beta profesional liberada. Ayuda contextual y descripción local de problemas implementadas; no hay servidor de soporte ni telemetría de planes.

## Publicar con evidencia

1. Regenerar documentos e índice; validar datos, `npm run test:planner` y TypeScript.
2. Construir con `npm run build:public`, nunca publicar `dist` ni `public/references`.
3. Probar compilación pública en viewport móvil/escritorio: crear, guardar, recargar, recuperar, historial, conflicto, montaje, conexiones, ayuda y preparación sin conexión.
4. Comparar el commit remoto antes de enviar. Una vista previa no debe recibir datos privados ni usar permisos de producción.
5. Registrar commit, artefactos, resultados y pendientes. Publicar la demo no equivale a liberar beta.
6. Verificar URL pública, recursos, selección y navegación. Conservar una publicación anterior identificable para reversión desde el panel de Netlify; no borrar datos del navegador durante una reversión.

Los service workers no toman control de pestañas abiertas ni fuerzan recarga. Guardar y cerrar pestañas permite activar una versión ya instalada. Una reversión del sitio también necesita comprobar la versión en caché: no anunciar reversión instantánea en todos los dispositivos.

## Incidencias

Ayuda permite redactar y copiar pasos de reproducción, sin nombres de rig, biblioteca ni telemetría automática. El envío es deliberado por un canal acordado; falta definir responsable, canal y tiempo de respuesta. Gravedad crítica para pérdida de datos o instrucción insegura; alta para flujo principal bloqueado; media/baja para fallos que permitan continuar.

Monitorización externa, privacidad jurídica, costes operativos, cuentas y distribución móvil necesitan evaluación posterior. No se habilitan pagos ni servicios adicionales por omisión.

Fuentes oficiales: [Deploy Previews](https://docs.netlify.com/deploy/deploy-types/deploy-previews/), [despliegues](https://docs.netlify.com/deploy/deploy-overview/).
