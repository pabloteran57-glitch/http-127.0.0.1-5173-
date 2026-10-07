# Visor recuperable y perfiles locales

Revisión de software 2026-10-06, versión 0.2.4. No es ensayo físico ni beta observada.

## Alcance

- Se conservan Takegrid, cuatro tareas, siete plantillas, selección exacta y manifiestos de ingeniería.
- Error del módulo diferido o del Canvas contenido con **Reintentar visor**, sin recargar la página.
- Modelos auditados esperan tamaño/hash/parseo; timeout asíncrono de 15 s, cancelación y liberación de respuestas tardías. Sin GLB aprobado no hay cargas adicionales. No garantiza tiempo de GPU ni interrumpe trabajo síncrono.
- Montaje no hereda estado listo de otra etapa; espera cargas terminadas o respaldo comunicado. Fallo pausa reproducción, no elimina el plan.
- Perfiles locales autorizados: índice `takegrid.profiles.v1`; elección por pestaña en sessionStorage. No se recopila correo ni se crea autenticación en Takegrid.
- Perfil inicial conserva exactamente `takegrid.rigs.v1`, `takegrid.rigs.v2` y borradores heredados. Sin copia destructiva ni mezcla.
- Perfiles nuevos aíslan biblioteca, respaldo, historial y borradores. Web Locks y snapshot coordinan escrituras; lectura posterior confirma el guardado.
- Cambiar confirma todos los borradores sucios antes de desmontar la sesión. Si falla, no cambia de perfil. Borradores se recuperan como copias, no reemplazan rigs guardados.

## Evidencia automática

`npm run test:planner`: 66 pruebas de planificación, 26 de conexiones, 7 del worker y 17 de perfiles. Conserva 300 selecciones y 300 guías reproducibles. `npm run test:models`: 20 de contrato y 19 de carga. Total: 155 pruebas de software, no 155 usuarios ni montajes físicos.

Perfiles: aislamiento con IDs de rig/tab iguales, conservación v1/v2, historial, borradores y descartes, nombres/IDs inválidos, índice corrupto, límites, cuotas/lectura no confirmada, conflictos y elección por pestaña. No prueba seguridad contra alguien con acceso al navegador.

## Revisión de interfaz local

Servidor anunciado por Vite `http://127.0.0.1:5175/`; no modifica la biblioteca del origen público.

1. Laboratorio DEV `?prueba-visor=1`: primer módulo rechazado deliberadamente. Página operativa, selección de siete piezas conservada. Reintentar carga el visor real en segundo intento sin recargar. Captura local `public/previews/takegrid-visor-recuperado-024.png`, excluida de publicación.
2. Perfil de prueba A: guardar copia Comercial, 17 elecciones, confirmación e historial local.
3. Perfil de prueba B: biblioteca vacía, sin rig de A. Crear borrador con FX3, salir a A y volver a B: un borrador recuperable sólo en B.
4. Perfil A conserva su rig confirmado al volver. No se borra ningún registro de pruebas ni datos existentes.

5. Recuperar B como copia conserva una FX3 elegida; guardar y recargar mantiene perfil B, rig confirmado y misma elección. Original recuperable intacto.
6. Vista móvil efectiva observada después del cambio de viewport: CSS 375 × 844, ancho de documento 375 sin desbordamiento. Selector de perfiles, formulario, cambio A/B y acceso a biblioteca comprobados. No es teléfono físico ni prueba de tacto real. La primera lectura inmediatamente tras solicitar 390 × 844 seguía en 1265 × 720; no se atribuye al resultado solicitado. Captura local `public/previews/takegrid-perfiles-locales-024.png`.

## Verificación pública

Commit funcional `5520fd2c6ce0ee77be9a3602d557d8b02f8be24b`, versión 0.2.4, verificada en `https://takegrid.netlify.app/` el 6 de octubre de 2026. No se recargó la pestaña con trabajo previo sin guardar.

1. HTML, script `index-DF3GPgOi.js`, CSS `index-5P6mxZmE.css` y visor `RigViewer-B7QI9Ge7.js` responden 200. Los tres recursos corresponden a `dist-public`, no al `dist` local completo. Referencia de investigación solicitada: 404.
2. Perfil inicial conserva los dos rigs previos; rig vertical propio de diez elecciones mantiene monitor y Mic 2. No se modificó su selección ni se guardó encima de esos planes.
3. Perfil de prueba público A empieza vacío; copia Comercial guardada con 17 elecciones. Perfil B empieza vacío, sin rig de A. Recargar recuerda B; volver a A recupera el rig confirmado y volver al inicial conserva sus dos planes. Los perfiles de prueba quedan identificados; no se eliminaron datos.
4. Montaje de la selección vertical: nueve etapas pertinentes. RX y ruta TRS aparecen desde accesorios del núcleo; monitor y 3026B en soporte lateral. Reproducción a 2× termina en etapa 9 con ocho objetos y tres rutas: USB-C, HDMI y TRS. Extracción opcional fuera de reproducción; no se marcaron revisiones físicas.
5. Conexiones muestran HDMI A/A FX3 a Indie 7, y salida TRS de RX a entrada MIC de FX3 con ambos extremos identificados. Conservan advertencias de revisión pendiente; no se certificó el circuito.
6. Sin errores ni advertencias capturados en la consola de esta pestaña durante los recorridos comprobados. Captura local `public/previews/takegrid-perfiles-publicos-024.png`, excluida del repositorio y de publicación.

`npm run build` y `npm run build:public` finalizan correctamente. Persisten avisos de tamaño de chunks; estas pruebas no prueban fluidez de GPU ni batería, uso táctil real, recuperación de todos los fallos de red o compatibilidad física.

## Adquisición 3D real

GLB obtenido de `model-viewer` oficial DJI, conservado sólo en `research/model-incoming/dji-rs4-pro-official-reference.glb`. SHA-256 `4bca5abbb94becfa5ef6bae5d6b05de2b318dd932b5132c03f7ad3bc18518568`; 8.791.748 bytes. Contiene cámara/óptica/motor/cables y compresión Draco; no es RS 4 Pro aislado ni FX3. Auditoría rechaza la extensión no admitida. Permisos, separación, BG70, escala y optimización pendientes. Ningún modelo real aprobado/generado todavía.

Yeggi revisado como índice, no licencia; resultados de accesorios no sustituyen cuerpos de producto. En el registro original de 0.2.4 Meshy estaba pendiente de acceso. El usuario inició sesión después: cuenta conectada sin fotos cargadas, generación ni consumo de créditos.

Seguimiento 0.2.5: 14 reconstrucciones propias aproximadas, no originales descargados ni resultados de Meshy. Archivo/permiso del escaneo FX3 solicitado al autor con autorización del usuario; DJI_RS4_PRO_2 documentado como candidato sin archivo/licencia confirmados. [Revisión y límites actuales](authored-models-qa.md).

## Pendientes reales

Derechos/archivos exactos y resto del catálogo, fotos autorizadas suficientes para Meshy, pruebas táctiles físicas, mediciones de dispositivos, ensayo completo de soportes/cables, usuarios observados y condiciones de financiación. El plan de siete fases no está terminado.
