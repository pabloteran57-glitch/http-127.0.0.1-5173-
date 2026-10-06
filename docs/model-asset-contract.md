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
node scripts/audit-model-assets.mjs
npm run test:models
node scripts/sync-docs.mjs
npm run build
npm run build:public
```

La auditoría compara tamaño y SHA-256; rechaza dependencias externas, animación, extensiones no admitidas, ciclos y accessors inválidos; mide vértices efectivamente usados con transformaciones. Compara triángulos/envolvente reales con el registro. No acredita licencia por sí sola: exige evidencia revisada antes de aprobar.

Presupuestos iniciales del software: 1,5 MB y 50.000 triángulos por recurso; salida pública completa menor de 5 MB. Son límites de implementación, no garantía de FPS ni calidad óptima. Revisar resolución/memoria de texturas y rendimiento en móvil antes de liberar; no se ha medido GPU con un GLB real.

## Visor y publicación

La carga GLB sólo ocurre para una coincidencia aprobada exacta. Verifica hash al recibir, conserva proxy aproximado mientras carga o si falla y no altera los circuitos. La ficha indica atribución y origen, no certificación mecánica. Probar selección, despiece, vertical, montaje y enlaces A/B con el recurso real antes de activarlo.

Netlify sigue publicando `dist-public`. Vite emite exclusivamente archivos registrados/aprobados, no carpetas de entrada ni referencias. El verificador sólo permite esas rutas GLB adicionales. El worker sigue acotado a módulos/estilos/identidad propios; no se cachean modelos de terceros por defecto. Sin red, el visor puede volver al proxy.

**Estado actual:** contrato/importador preparado y probado con geometría sintética; cero mallas reales aprobadas. El escaneo de Sketchfab requiere permiso/archivo/escala y reducción; no se extrajo contenido del visor. La nueva generación IA necesita referencias autorizadas y cuenta conectada. No afirmar todavía que los renders hayan sido reemplazados.
