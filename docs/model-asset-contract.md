# Integración GLB auditada

La malla es una capa visual. Identidad/masa/cotas siguen en `parts-manifest`; pose y soporte en `layout-manifest`; puertos y conexiones en sus manifiestos. Importar no añade piezas ni cambia listas de usuario. La selección, despiece y rotación se aplican al mismo nodo existente.

## Adquisición

1. Registrar candidato y revisión exacta en `data/model-production.json`. Una descarga gratuita no equivale a licencia comercial, modificación o distribución en una app pública.
2. Conservar archivos recibidos en `research/model-incoming/`, excluido del repositorio. Las fotos oficiales existentes permanecen en investigación; no subirlas a Meshy sin permiso.
3. Para IA usar fotos propias o autorizadas del mismo objeto, fondo simple, escala/iluminación coherentes y vistas independientes. La FX3 debe estar sin lente, jaula ni asa para no fusionar accesorios. No usar imágenes generadas como prueba de geometría real.
4. Verificar cuenta/plan de Meshy antes de usar funciones o créditos. Multi-View requiere plan de pago según documentación consultada; no se contrató ninguno. IA puede inventar superficies ocultas: revisar y corregir, no convertirlas en interfaces.
5. Limpiar en un editor 3D, exportar GLB 2 autocontenido con materiales PBR y texturas embebidas. Sin buffers externos, Draco, skins o animaciones en este primer contrato. Malla estática por producto; no ensamblaje fusionado.

## Registro por recurso

`src/lib/model-assets.ts` define `ModelAsset`. Añadir a `data/model-assets.json` sólo tras completar campos y conservar evidencia. No copiar el fixture sintético de pruebas al registro.

| Grupo | Campos obligatorios |
|---|---|
| Identidad | `id`, `part_id`, `exact_product_name`, `model_number` (null sólo si catálogo no publica código), `subcomponent_id`, `status` |
| Origen | Método oficial/comunidad/IA/manual, URL HTTPS, autor |
| Derechos | Licencia, evidencia HTTPS, fecha revisada, uso comercial/distribución/modificación, atribución; IA exige autorización de fotos y referencia escrita a su evidencia |
| Archivo | `/models/<id>.glb`, SHA-256, bytes, triángulos |
| Calibración | Unidades metros, factor uniforme positivo, offset mm, rotación grados, envolvente medida después de calibrar, fuente y alcance de referencia |
| Revisión | Identidad, escala, vistas e interfaces revisadas, evidencia escrita, mecánica aproximada y puertos canónicos |

Licencias admitidas automáticamente: CC0 1.0, CC BY 4.0 o permiso particular revisado (`custom-reviewed`). NC/ND u otras condiciones requieren otra revisión; no se aceptan por un booleano. La atribución de cada malla activa aparece en la ficha bajo Modelo 3D y atribución. Los derechos sobre fotos originales deben conservarse además de la licencia del resultado IA.

El factor es **uniforme**: no estirar ejes para hacer coincidir un escaneo con una caja nominal. `offset_mm`/`rotation_deg` alinean el origen del modelo con el nodo; no mueven puertos. `bounds_mm` mide el GLB, no una cota inventada del producto. La fuente debe explicar si incluye salientes, grip, parasol, cable, etc. Si esa correspondencia no está comprobada, mantener cuarentena.

## Auditoría

```sh
npm run build:models
node scripts/audit-model-assets.mjs
npm run test:models
node scripts/sync-docs.mjs
npm run build
npm run build:public
```

La auditoría compara tamaño y SHA-256; rechaza dependencias externas, animación, extensiones no admitidas, ciclos y accessors inválidos; mide vértices efectivamente usados con transformaciones. Compara triángulos/envolvente reales con el registro. No acredita licencia por sí sola: exige evidencia revisada antes de aprobar.

Presupuestos iniciales del software: 1,5 MB y 50.000 triángulos por recurso; salida pública completa menor de 5 MB. Son límites de implementación, no garantía de FPS ni calidad óptima. Revisar resolución/memoria de texturas y rendimiento en móvil antes de liberar; no se ha medido GPU con un GLB real.

## Visor y publicación

La carga GLB sólo ocurre para una coincidencia aprobada exacta. Verifica tamaño y hash antes de parsear, conserva proxy aproximado mientras carga o si falla y no altera los circuitos. Carga/fallo visibles y reintento; estados de una etapa anterior no acreditan la siguiente. Montaje espera a todas las cargas terminadas o respaldo comunicado. Espera de 15 segundos y cancelación para trabajo asíncrono; no puede interrumpir una decodificación síncrona ni garantiza un presupuesto GPU. Una respuesta de parseo tardía se libera sin montarse. Materiales y recursos compartidos se procesan una sola vez. Un error del módulo diferido queda contenido fuera del Canvas y permite reintentar sin recargar toda la app. La ficha indica atribución y origen, no certificación mecánica. Probar selección, despiece, vertical, montaje y enlaces A/B con el recurso real antes de activarlo.

Netlify sigue publicando `dist-public`. Vite emite exclusivamente archivos registrados/aprobados, no carpetas de entrada ni referencias. El verificador sólo permite esas rutas GLB adicionales. El worker sigue acotado a módulos/estilos/identidad propios; no se cachean modelos de terceros por defecto. Sin red, el visor puede volver al proxy.

## Reconstrucciones Propias 0.2.5

14 mallas originales separadas sustituyen la geometría básica de los 14 nodos del visor. No son modelos exactos, CAD oficiales, escaneos ni resultados de Meshy. La ficha ofrece **Examinar pieza en 3D**, con giro y cinco vistas; precisión, origen y permiso bajo demanda. Las 13 entradas restantes se desglosan en la cola: cables, software y accesorios no modelados, sin nuevas activaciones.

`npm run build:models` produce los GLB desde código propio en milímetros, convertido a metros con factor uniforme. No cambia el registro de revisión. La auditoría falla si una regeneración difiere de la huella aprobada: un cambio de generador obliga a revisar de nuevo, nunca a autoaprobar. La compilación de Netlify genera las mallas desde el mismo código y publica sólo las auditadas. La revisión documenta diferencias entre caja nominal y salientes/pose; no estira XYZ para disimularlas.

39 pruebas de contrato/carga más 11 de reconstrucción comprueban cobertura, no mutación, separación de piezas, alineación visual de varillas/cabezal, ausencia de texturas ajenas y exportación repetida idéntica. No son pruebas físicas, de GPU ni certificaciones. [Procedencia propia](authored-model-rights.md).

El GLB oficial DJI sigue sólo en cuarentena local: 8.791.748 bytes, 192 mallas, 200 nodos y Draco; incluye cámara/óptica ajenas al catálogo. No se relajaron controles para importarlo. El enlace exacto DJI_RS4_PRO_2 enviado por el usuario no tiene archivo/licencia confirmados. Se solicitó al autor el escaneo FX3 con autorización del usuario; archivo y permiso pendientes. Meshy está conectado, pero no se cargaron fotos, lanzaron tareas ni consumieron créditos. La petición de módulos exactos sigue abierta.
