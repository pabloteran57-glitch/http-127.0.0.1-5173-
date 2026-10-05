# Publicación web

## Dos modos separados

- `npm run build`: archivo local completo en `dist`, con fotografías y manuales de investigación. No subirlo a alojamiento público.
- `npm run build:public`: demo publicable en `dist-public`; mantiene datos, visor aproximado, conexiones, 13 etapas y 7 perfiles. Las imágenes y manuales se consultan mediante enlaces oficiales, no se redistribuyen.
- `npm run preview:public`: comprobar la compilación pública localmente. Usar el puerto anunciado, no asumirlo.

Vite desactiva la copia indiscriminada de `public` en el modo `public-demo`. Sólo emite los SVG de identidad propios y su página de presentación. `check-public-build.mjs` verifica una lista permitida de archivos y un presupuesto de 5 MB sin comprimir.

Las referencias descargadas siguen intactas en el equipo. `validate-data.mjs --public` conserva las comprobaciones de fuentes, huellas y estructura, pero no exige copias locales de fotografías/manuales en el repositorio de despliegue. La validación normal sigue exigiendo esos archivos.

## Netlify

La configuración versionada en `netlify.toml` establece `npm run build:public`, publica `dist-public` y utiliza Node 22. Se conserva HTTPS del proveedor; no necesita el servidor de desarrollo del equipo.

Los recursos de investigación se excluyen también del repositorio mediante `.gitignore`. No añadir `.env`, credenciales, fotografías, PDFs ni capturas de investigación al repositorio público. Si se verifican derechos de un recurso nuevo, revisar explícitamente la política de publicación antes de incorporarlo.

Netlify devuelve 404 para `/references/*` y sirve la app para las demás rutas. Esta regla no es autenticación: el sitio publicado y los datos que contiene son públicos.

## Revisión

Los cambios enviados a la rama de producción se despliegan automáticamente. Las solicitudes de cambio pueden generar una vista previa para revisión antes de integrarse.

La app no ofrece todavía cuentas, proyectos sincronizados, comentarios persistentes ni edición simultánea. Compartir la URL permite revisar la misma versión, no una sesión de trabajo compartida.

## Verificación de salida

Comprobar visor, cuatro áreas de navegación, conexiones, siete perfiles, enlaces oficiales, búsqueda y móvil. Ningún elemento `<img>` de la demo debe solicitar `/references/`. Conservar todas las advertencias de aproximación y pruebas físicas pendientes.

Fuentes de configuración: [Vite](https://vite.dev/config/shared-options.html#publicdir), [Netlify](https://docs.netlify.com/build/configure-builds/file-based-configuration/).

## Dependencias

Auditoría del 5 de octubre de 2026: `npm audit --omit=dev` devuelve cero alertas. La auditoría completa informa cinco alertas de gravedad alta en la cadena de compilación de Tailwind 3 (`braces`, `chokidar`, `micromatch` y `fast-glob`). No son un servicio de servidor expuesto en esta web estática, pero requieren seguimiento. No ejecutar `npm audit fix --force`: propone una migración mayor de Tailwind que debe probarse por separado.

