# Publicación web

## Despliegue activo

- Demo pública HTTPS: [Takegrid](https://takegrid.netlify.app/).
- Repositorio público: [pabloteran57-glitch/http-127.0.0.1-5173-](https://github.com/pabloteran57-glitch/http-127.0.0.1-5173-).
- Proyecto Netlify: `takegrid`; producción desde `main`, comando `npm run build:public`, salida `dist-public`, Node 22.
- Primer despliegue verificado el 5 de octubre de 2026, commit `f6e7f3b0e9bdcebaabfd5fed65c2ad7dd4d833f2`. Compilación remota: 27 piezas, 17 conexiones, 13 etapas y 7 perfiles; salida propia de 1.41 MB.
- Comprobados visor, despiece, circuitos A/B, doble HDMI de banco, siete perfiles, inventario, búsqueda, estado vacío y navegación móvil. No son pruebas mecánicas ni eléctricas del equipo físico.
- Comprobación HTTP: portada 200, solicitud bajo `/references/` 404 y CSS 200 con caché inmutable. Cabeceras de HTTPS, `nosniff`, protección de marcos y restricciones de cámara/micrófono/geolocalización presentes.
- Versión actual 0.2.3 comprobada el 6 de octubre de 2026; commit funcional `0edf6c425b146f05d7419b3ca0fad57545fd553c`. Script `/assets/index-glFEvWu5.js`, estilos `/assets/index-Bh-oL0EQ.css` y visor `/assets/RigViewer-DGwcMLQR.js` coinciden con la compilación pública. Selección directa, categoría de jaulas, RX candidato sobre HawkLock, guardado local y reproducción comprobados. 99 pruebas automáticas aprobadas; 14 nodos aproximados. [Verificación y límites](mobile-selection-qa.md). No implica beta aprobada.
- Referencia anterior 0.2.2: commit funcional `1db1313b28028f22167734762844502cef6ffa0b`, editor de tres pasos y 88 pruebas. [Registro histórico](rig-creation-qa.md).
- Referencia anterior 0.2.1: commit funcional `80ef04d2d202c41fd6f1512b97ebc694f17272e0`; ruta seleccionada visible, extremos A/B prioritarios y tres revisiones documentales. [Revisión de conexiones](connection-review-qa.md).
- Referencia anterior 0.2.0: commit funcional `9f5b0e539b759eca77c0dba0fd9fe9fb4f665795`; recuperación e historial local conservados.

La insignia superpuesta del proveedor se desactivó desde la configuración del proyecto para evitar tapar la navegación inferior en móvil. No se añadió un dominio de pago ni se cambió el plan contratado.

## Dos modos separados

- `npm run build`: archivo local completo en `dist`, con fotografías y manuales de investigación. No subirlo a alojamiento público.
- `npm run build:public`: demo publicable en `dist-public`; mantiene datos, visor aproximado, conexiones, 13 etapas y 7 perfiles. Las imágenes y manuales se consultan mediante enlaces oficiales, no se redistribuyen.
- `npm run preview:public`: comprobar la compilación pública localmente. Usar el puerto anunciado, no asumirlo.

Vite desactiva la copia indiscriminada de `public` en el modo `public-demo`. Emite los SVG de identidad propios, la página de presentación, el manifiesto web y un worker generado para los módulos y estilos propios de esa compilación. `check-public-build.mjs` verifica la lista permitida, la precaché y un presupuesto de 5 MB sin comprimir. No incluye referencias del fabricante ni captura APIs, formularios o solicitudes externas.

Las referencias descargadas siguen intactas en el equipo. `validate-data.mjs --public` conserva las comprobaciones de fuentes, huellas y estructura, pero no exige copias locales de fotografías/manuales en el repositorio de despliegue. La validación normal sigue exigiendo esos archivos.

## Netlify

La configuración versionada en `netlify.toml` establece `npm run build:public`, publica `dist-public` y utiliza Node 22. Se conserva HTTPS del proveedor; no necesita el servidor de desarrollo del equipo.

Los recursos de investigación se excluyen también del repositorio mediante `.gitignore`. No añadir `.env`, credenciales, fotografías, PDFs ni capturas de investigación al repositorio público. Si se verifican derechos de un recurso nuevo, revisar explícitamente la política de publicación antes de incorporarlo.

Netlify devuelve 404 para `/references/*` y sirve la app para las demás rutas. Esta regla no es autenticación: el sitio publicado y los datos que contiene son públicos.

## Revisión

Los cambios enviados a la rama de producción se despliegan automáticamente. Las solicitudes de cambio pueden generar una vista previa para revisión antes de integrarse.

La app permite guardar rigs propios dentro de Mis rigs, en el navegador y origen actuales, con historial local y recuperación de borradores. Cuentas y nube se aplazaron por decisión del usuario. Compartir la URL permite revisar la misma versión, no la biblioteca privada ni una sesión de trabajo compartida. No hay exportación de planos en la interfaz.

La versión 0.2.3 sigue siendo un prototipo de ingeniería, no una beta aprobada. Preparar sin conexión es opcional y almacena únicamente recursos propios; instalar en iOS/Android y comprobar una desconexión real siguen pendientes. Las actualizaciones no fuerzan recarga ni activación mientras existe trabajo abierto. No hay publicación en App Store. Véanse [Operación de versiones](release-operations.md), [verificación actual](mobile-selection-qa.md) y [revisión del plan](plan-review-2026-10-06.md).

## Verificación de salida

Comprobar visor, cuatro áreas de navegación, conexiones, siete perfiles, enlaces oficiales, búsqueda y móvil. Ningún elemento `<img>` de la demo debe solicitar `/references/`. Conservar todas las advertencias de aproximación y pruebas físicas pendientes.

Fuentes de configuración: [Vite](https://vite.dev/config/shared-options.html#publicdir), [Netlify](https://docs.netlify.com/build/configure-builds/file-based-configuration/).

## Dependencias

Auditoría del 5 de octubre de 2026: `npm audit --omit=dev` devuelve cero alertas. La auditoría completa informa cinco alertas de gravedad alta en la cadena de compilación de Tailwind 3 (`braces`, `chokidar`, `micromatch` y `fast-glob`). No son un servicio de servidor expuesto en esta web estática, pero requieren seguimiento. No ejecutar `npm audit fix --force`: propone una migración mayor de Tailwind que debe probarse por separado.
