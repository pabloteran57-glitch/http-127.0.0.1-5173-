# Takegrid - Planificador de rigs

Planificador local React/TypeScript/Tailwind/React Three Fiber para DJI RS 4 Pro + Sony FX3. **Prototipo de planificación, no montaje certificado.** Nombre y logo provisionales.

Interfaz, descripciones, avisos, guías y notas de exportación en español. Se conservan los nombres oficiales de productos, las siglas técnicas y los identificadores de datos. Fotografías y manuales del fabricante mantienen su contenido original, con explicación en español.

## Usar

```sh
npm install
npm run dev
npm run validate
npm run build
```

En PowerShell usar `npm.cmd` si la política bloquea npm.ps1. Vite anuncia el puerto real; no asumir otro. El visor se carga como módulo separado.

## Flujo de la aplicación

Cuatro tareas: **Rig**, **Conexiones**, **Montaje** y **Piezas**. El visor abre sin cableado superpuesto; Conexiones activa las rutas y resalta un circuito con sus extremos A/B. En móvil, navegación inferior fija y selector de conexión junto al visor. El doble HDMI es un circuito de banco independiente del perfil, no un montaje aprobado en el rig.

La ficha usa referencias del fabricante y despliega medidas, materiales y restricciones bajo demanda. Montaje conserva trece etapas y separa las revisiones de lectura por perfil durante la sesión. Piezas conserva las veintisiete entradas, con búsqueda y filtro de perfil. Detalles del perfil contiene siete plantillas, desglose de peso, distribución aproximada y pruebas pendientes. Exportar genera un plano técnico JSON con fuentes, criterios de ingeniería y advertencias.

Vista de marca: `/brand/preview.html`. SVG reutilizables en `public/brand`; nombre en `data/brand.json`.

## Datos Canónicos

- `data/parts-manifest.json`: 25 productos + dos componentes del Combo, con fuente y confianza por campo.
- `data/layout-manifest.json`: envolventes XYZ, poses candidatas, soporte y pruebas pendientes.
- `data/cables-manifest.json`, `data/ports-manifest.json`: 17 circuitos, puertos reales, coordenadas sólo aproximadas.
- `data/assembly-guide.json`, `data/variants.json`: 13 pasos y 7 perfiles.
- `data/engineering-manifest.json`: límites publicados y políticas de masa/centros ponderados.
- `data/sources.json`, `data/geometry-references.json`, `data/geometry-audit.json`: atribución, descargas SHA-256 y referencias revisadas.
- `data/ui-content.json`: nombres cortos y traducciones de presentación; no reemplaza especificaciones ni interfaces canónicas.

Documentación completa en `docs/`. Regenerar con `node scripts/sync-docs.mjs` después de cambiar datos; no editar especificaciones sólo en la interfaz.

## Correcciones Importantes

BG70 sustituye BG30. Monitor fijo lateral sobre 3026B, fuera de la carga móvil. VB99 Pro 644 g y 3203B bajo varillas con abrazadera superior documentada. 3203B tiene discrepancia de masa, usa 351 g conservadores. SmallHD cable 5.5 mm exterior, no 2 mm. FX3 una HDMI: distribuidor presente en circuito dual de banco pero estacionado en gimbal hasta montaje real y fuente probados. Interfaz Transmission y foco no activados sin hardware/calibración. XLR-H1 sólo a mano/estático.

El subtotal móvil ~3.23 kg incluye estimaciones y excluye cables, RX y fijaciones. 4.5 kg nominales del gimbal NO prueban encaje. CG interno, motores, ajuste de ejes, alcance de cables y rigidez necesitan medición física.

## Referencias y CAD

`node scripts/download-references.mjs` descarga páginas/medios oficiales del catálogo; IDs como argumentos actualizan sólo esos productos. No ejecutarlo como rastreador de terceros. `scripts/extract-pdf-images.py` extrae imágenes originales de PDFs, requiere pypdf. Fotografías y manuales de fabricante son investigación local, no recursos de licencia abierta para publicar en App Store.

No se importó CAD comunitario no verificado. Toda forma 3D interna y pose es aproximada, incluso donde se conocen cotas exteriores. Pendientes explícitos: BG70, parasol completo, pila de placas, RX, longitudes, radios de curvatura y holguras reales.

## Verificación

`npm run validate` comprueba productos, referencias, rutas, perfiles, etiquetas UI y reglas mecánicas/lógicas; no ensaya un rig físico. `npm run build` ejecuta validación y TypeScript antes de Vite. Pruebas de interacción y adaptación a pantallas documentadas en `docs/ux-ui.md`; sólo pruebas de banco reales pueden liberar producción.

## Publicación

Usar `npm run build:public` para publicar: genera `dist-public` sin redistribuir las fotografías, manuales ni capturas de investigación. La demo conserva los datos y las funciones de planificación y utiliza enlaces oficiales para consultar referencias. El archivo local completo se mantiene separado. Configuración automática de Netlify en `netlify.toml`; proceso y límites en [publicación](docs/publication.md).

