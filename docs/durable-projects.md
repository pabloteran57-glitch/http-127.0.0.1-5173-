# Proyectos locales recuperables

Decisión del usuario: mantener almacenamiento local por ahora. Cuentas, sincronización, revisión privada y eliminación de cuenta están aplazadas, no implementadas. No se creó un servicio ni se contrataron planes.

## Confirmación y recuperación

- Guardar rig confirma biblioteca e historial en una escritura. Hasta cinco versiones por rig; abrir una anterior crea una copia y no reemplaza el plan.
- Los cambios preparan un borrador recuperable tras 350 ms y también al ocultar/salir de la página, cuando el navegador permite escribir. El aviso distingue preparación, éxito y fallo. Un cierre abrupto antes de la escritura puede perder el último cambio.
- Cada instancia de pestaña usa una clave distinta. Los borradores de otra sesión se ofrecen en Mis rigs; recuperación crea una copia local antes de abrir y conserva el original hasta descarte explícito.
- Un borrador ilegible no se borra. Un fallo de cuota no confirma guardado ni recuperación.
- El guardado usa Web Locks y comparación de la instantánea. Sin Web Locks se rechaza el guardado confirmado, conservando el borrador. Revisar cambios de otra pestaña actualiza la biblioteca y conserva cambios locales como copias.

## Versiones y privacidad

Biblioteca actual en `takegrid.rigs.v2`; el archivo histórico `takegrid.rigs.v1` se lee como origen de migración y no se sobrescribe. Se conserva para evitar que una pestaña antigua destruya datos nuevos. Si cambia, se ofrecen sus planes distintos como copias al revisar la biblioteca. La huella sólo detecta cambios; no es una firma de seguridad.

La copia heredada, respaldos y borradores anteriores pueden conservar datos de rigs eliminados de la biblioteca actual. El borrado completo requiere eliminar los datos del sitio en el navegador; no hay una cuenta ni una copia externa. El historial actual se elimina con su rig, pero no se borran sin autorización datos de otras sesiones.

Almacenar localmente no es cifrado de extremo a extremo ni garantía de permanencia. Una sesión privada, limpieza de navegador, pérdida de equipo o cuota puede eliminar datos. No se promete colaboración ni disponibilidad desde otro dispositivo.

## Sin conexión

En Ayuda y versión, Preparar recursos sin conexión solicita un service worker que almacena sólo la lista permitida de recursos propios. La compilación incluye todos los módulos divididos, datos y marca; no fotografías/manuales del fabricante, APIs ni planes privados en caché de red. Los planes permanecen en localStorage.

La instalación web depende del navegador; el manifiesto contiene un icono SVG propio y aún falta verificar instalación y experiencia en iOS/Android físicos. Las fuentes externas pueden degradar a la tipografía alternativa sin red. No se usa `skipWaiting` ni `clients.claim`: una actualización espera al cierre de pestañas, sin recargar borradores.

Fuentes técnicas: [Web Locks](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API), [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers), [iconos de manifiesto](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/icons).
