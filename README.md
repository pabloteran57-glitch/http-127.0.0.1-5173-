# Takegrid - Planificador de rigs

Planificador local React/TypeScript/Tailwind/React Three Fiber para DJI RS 4 Pro + Sony FX3. **Prototipo de planificación, no montaje certificado.** Nombre y logo provisionales.

Interfaz, descripciones, avisos y guías en español. Se conservan los nombres oficiales de productos, las siglas técnicas y los identificadores de datos. Fotografías y manuales del fabricante mantienen su contenido original, con explicación en español.

## Usar

```sh
npm install
npm run build:models
npm run dev
npm run validate
npm run build
```

En PowerShell usar `npm.cmd` si la política bloquea npm.ps1. Vite anuncia el puerto real; no asumir otro. El visor se carga como módulo separado.

## Flujo de la aplicación

Cuatro tareas: **Rig**, **Conexiones**, **Montaje** y **Piezas**. El visor abre sin cableado superpuesto; Conexiones activa las rutas y resalta un circuito con sus extremos A/B. En móvil, navegación inferior fija y selector de conexión junto al visor. El doble HDMI es un circuito de banco independiente del perfil, no un montaje aprobado en el rig.

La ficha despliega medidas, materiales y restricciones bajo demanda. Montaje deriva sólo las etapas pertinentes de las trece referencias canónicas y separa las revisiones de lectura por configuración durante la sesión. Piezas abre **Mi equipo**, incluyendo elecciones pendientes; las treinta entradas se consultan en **Catálogo**. Detalles del perfil conserva siete plantillas, desglose de peso y pruebas pendientes. Los planes se guardan y abren dentro de la app, sin exportar archivos.

Vista de marca: `/brand/preview.html`. SVG reutilizables en `public/brand`; nombre en `data/brand.json`.

## Rigs Propios

**Crear rig** abre una selección vacía. **Personalizar** crea una copia editable de la plantilla actual. Elige productos, revisa dependencias y guarda el perfil en **Mis rigs**. **Guardar rig** también puede guardar directamente una copia de una plantilla. El guardado es local a este navegador, no una cuenta sincronizada. Las piezas pendientes se conservan sin inventar un montaje.

Versión 0.2.3: selección directa en **Catálogo**, **Elegidas** y **Datos del rig**, sin pasos obligatorios. Añadir o quitar no te saca del catálogo; guardar está disponible en todas las vistas. Jaulas y accesorios tienen su categoría. Un rig propio vertical conserva el monitor lateral candidato con 3026B, sin activar la pila V-mount ni presuponer alimentación. El RX de DJI Mic 2 se representa sobre la zapata documentada de HawkLock 4770, con 28 g publicados y pose aproximada pendiente de ensayo. Miniaturas propias aproximadas y enlaces oficiales, sin redistribución de medios del fabricante. Las siete plantillas mantienen sus listas originales.

**Montaje** incluye visor acumulativo, guía condicionada a la selección, reproducción, pausa, reinicio, anterior/siguiente, deslizador de etapas y ritmo. Espera a la escena antes de avanzar; la extracción a mano es opcional y nunca automática. La animación es ilustrativa, no una trayectoria de acople medida. Reglas, esquema y límites en [rigs propios](docs/custom-rigs.md).

Versión 0.2.0: borradores recuperables, historial de cinco versiones y restauración como copia en Mis rigs. Web Locks coordina guardado entre pestañas; sin esa API no se confirma la escritura. Biblioteca v2 separada de la antigua v1, que se conserva para migrar sin afectar pestañas viejas. Revisar cambios de otra pestaña protege los planes distintos como copias. No hay copia externa ni cuenta. [Persistencia y límites](docs/durable-projects.md).

Versión 0.2.4: el botón de perfil junto a **Mis rigs** crea bibliotecas locales independientes. El perfil inicial conserva rigs, historial y borradores anteriores sin moverlos ni borrar v1. La elección se recuerda por pestaña; cambiar confirma primero los borradores recuperables. Sin contraseña, privacidad frente a otras personas del navegador ni sincronización. El visor permite reintentar un fallo de carga sin recargar toda la app; montaje espera a modelos listos o respaldo comunicado. [Pruebas y límites](docs/viewer-profiles-qa.md).

Versión 0.2.5: 14 reconstrucciones propias iniciales separadas, con montura, jaula abierta, abrazaderas, pantallas y mandos. **Examinar pieza en 3D** abre giro, cinco vistas y precisión de cada recurso. Son aproximaciones visuales, no modelos exactos del fabricante ni los originales de Sketchfab. No se cambian pesos, puertos, soportes o selecciones por la forma de una malla. [Procedencia](docs/authored-model-rights.md) y [cobertura/pedientes](docs/model-production.md).

Versión 0.2.6: monitor elegible en las siete copias de plantillas y rigs propios mediante tres cadenas candidatas. Gimbal: 3026B lateral. A mano/estático: 2906B sobre NATO 4770 sin XLR, o 4830 + 2906B sobre XLR-H1. **Completar monitor** indica soportes, HDMI y una NP-F970/PRO sólo si falta alimentación; las incorpora exclusivamente al pulsarlo. 17 mallas y miniaturas propias aproximadas para reconocer piezas. La placa serie L incluida alimenta el monitor sin cable al barril; batería y cargador específico se verifican antes de usar. [Pruebas y límites](docs/monitor-mount-qa.md).

**Ayuda y versión** conserva una orientación de tres pasos, preparación optativa sin conexión, privacidad y descripción local de incidencias. No añade una quinta tarea ni reintroduce exportar planes. Instalación web según navegador, no App Store.

Laboratorio optativo: `/?laboratorio=1`. Compara reposo/giro y demanda/continuo en la misma escena. Intervalos JavaScript, no tiempos GPU ni mejora porcentual contra la versión anterior. `npm run check:beta` muestra criterios y evidencia pendientes; `--strict` no permite declarar beta lista.

## Datos Canónicos

Ruta hacia beta: [plan de avance](docs/beta-roadmap.md), con fases, criterios y diagnóstico. `data/product-roadmap.json` distingue correcciones implementadas de trabajo pendiente; no sustituye los manifiestos técnicos. Evidencia de esta iteración en [estabilización](docs/stabilization-qa.md).

- `data/parts-manifest.json`: 27 entradas originales + tres accesorios de monitor, con fuente y confianza por campo.
- `data/layout-manifest.json`: envolventes XYZ, poses candidatas, soporte y pruebas pendientes.
- `data/cables-manifest.json`, `data/ports-manifest.json`: 18 circuitos, puertos reales, coordenadas sólo aproximadas.
- `data/connection-reviews.json`: evidencia documental de cuatro circuitos; rango, polaridad, firmware y límites visibles en Conexiones. Desconocido no equivale a compatible.
- `data/assembly-guide.json`, `data/variants.json`: 13 pasos y 7 perfiles.
- `data/assembly-profile-content.json`: bloques de instrucciones condicionados a las piezas y circuitos existentes; no añade especificaciones ni compatibilidades.
- `data/engineering-manifest.json`: límites publicados y políticas de masa/centros ponderados.
- `data/sources.json`, `data/geometry-references.json`, `data/geometry-audit.json`: atribución, descargas SHA-256 y referencias revisadas.
- `data/model-production.json`, `data/model-assets.json`: trabajo de fidelidad y registro de 17 GLB propios aproximados auditados; las otras 13 entradas tienen alcance pendiente o no físico explícito. [Producción](docs/model-production.md) y [contrato](docs/model-asset-contract.md).
- `data/product-visuals.json`: 17 miniaturas originales WebP vinculadas a huellas de malla y derechos revisados; nunca aprobación automática.
- `data/ui-content.json`: nombres cortos y traducciones de presentación; no reemplaza especificaciones ni interfaces canónicas.
- `data/planner-rules.json`: dependencias conservadoras del catálogo actual y fotogramas de montaje; no certifica compatibilidad universal.
- `data/catalog-contract.json`: índice derivado de identidad, revisión, guía y geometría; se regenera, no es un segundo catálogo.
- `data/catalog-intake.json`: diez candidatos Sony investigados, no activados; [lote piloto](docs/catalog-pilot.md).
- `data/beta-protocol.json`, `data/beta-evidence.json`: tareas propuestas y observaciones reales; un registro vacío no certifica éxito.
- `data/release.json`, `data/funding-plan.json`: alcance versionado y preparación financiera sin costes, fechas ni usuarios inventados.

Documentación completa en `docs/`. Regenerar con `node scripts/sync-docs.mjs` después de cambiar datos; no editar especificaciones sólo en la interfaz.

## Correcciones Importantes

Versión 0.2.1: panel Conexiones con evidencia por circuito exacto y comprobaciones pendientes. Revisión documental inicial de control USB-C, 4253B e Indie 7; no certificación eléctrica ni física. [Criterios y fuentes](docs/connection-reviews.md).

BG70 sustituye BG30. En gimbal, monitor fijo lateral sobre 3026B, fuera de carga móvil. A mano/estático, monitor y batería elegida sobre el núcleo sí se incluyen en el desglose. VB99 Pro 644 g y 3203B bajo varillas con abrazadera superior documentada. 3203B tiene discrepancia de masa, usa 351 g conservadores. SmallHD cable 5.5 mm exterior, no 2 mm. FX3 una HDMI: distribuidor presente en circuito dual de banco pero estacionado en gimbal hasta montaje real y fuente probados. Interfaz Transmission y foco no activados sin hardware/calibración. XLR-H1 sólo a mano/estático.

El subtotal móvil depende del perfil; incluye los 28 g del RX cuando está activo, no el kit completo. Excluye cables, fijaciones y otras masas pendientes. 4.5 kg nominales del gimbal NO prueban encaje. CG interno, motores, ajuste de ejes, alcance de cables y rigidez necesitan medición física.

## Referencias y CAD

`node scripts/download-references.mjs` descarga páginas/medios oficiales del catálogo; IDs como argumentos actualizan sólo esos productos. No ejecutarlo como rastreador de terceros. `scripts/extract-pdf-images.py` extrae imágenes originales de PDFs, requiere pypdf. Fotografías y manuales de fabricante son investigación local, no recursos de licencia abierta para publicar en App Store.

No se importó CAD comunitario no verificado. Toda forma 3D interna y pose es aproximada, incluso donde se conocen cotas exteriores. Pendientes explícitos: BG70, parasol completo, pila de placas, retención y posición exacta del RX, longitudes, radios de curvatura y holguras reales.

Primero fidelidad del catálogo actual, después ampliaciones: la malla visual no decide puertos, masas ni soportes. `npm run test:models` ejecuta 56 comprobaciones de contrato, carga y reconstrucción reproducible; no genera permisos ni un escaneo real. `npm run test:planner` incluye 17 pruebas de perfiles locales. La masa de cuerpo FX3 se corrigió a 630 g con fuente Sony US; 715 g incluye batería/tarjeta. GLB oficial DJI descargado bajo `research/model-incoming/`, en cuarentena por permisos, componentes fusionados y Draco; no forma parte de la web pública.

Generación propia: `scripts/lib/authored-models.mjs` y `npm run build:models`. Ambos builds regeneran mallas y miniaturas antes de compararlas con las huellas revisadas; nunca modifican el registro automáticamente. No es necesario subir binarios de investigación al repositorio. Ni fotos oficiales ni referencias descargadas entran al paquete público. Meshy conectado pero sin generación; FX3 solicitado al autor, DJI_RS4_PRO_2 pendiente de descarga/licencia. No afirmar que esos originales estén integrados.

## Verificación

`npm run validate` comprueba productos, referencias, rutas, perfiles, etiquetas UI y reglas mecánicas/lógicas; no ensaya un rig físico. `npm run build` ejecuta validación y TypeScript antes de Vite. Pruebas de interacción y adaptación a pantallas documentadas en `docs/ux-ui.md`; sólo pruebas de banco reales pueden liberar producción.

## Publicación

Enlace público adicional: [Abrir Takegrid actualizado](https://takegrid-rigs.pabloteran57.chatgpt.site). Las actualizaciones se confirman por estado del proveedor antes de anunciarlas, sin contratar un plan. Conservamos [el enlace Netlify anterior](https://takegrid.netlify.app/) y el [repositorio en GitHub](https://github.com/pabloteran57-glitch/http-127.0.0.1-5173-). El servidor local no necesita permanecer encendido. Compartir el enlace no crea una sesión de edición colaborativa.

Las bibliotecas son locales por dominio y navegador: los rigs de Netlify no se trasladan ni se sincronizan automáticamente al enlace adicional. La publicación adicional es una copia versionada de `dist-public`, no un despliegue automático de cada cambio de GitHub. Netlify conserva su configuración y versión anterior mientras no admita nuevos despliegues. [Estado, actualización y límites](docs/additional-hosting.md).

Usar `npm run build:public` para publicar: genera `dist-public` sin redistribuir las fotografías, manuales ni capturas de investigación. La demo conserva los datos y las funciones de planificación y utiliza enlaces oficiales para consultar referencias. El archivo local completo se mantiene separado. Configuración automática de Netlify en `netlify.toml`; proceso y límites en [publicación](docs/publication.md).
