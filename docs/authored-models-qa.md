# Verificación de reconstrucciones propias 0.2.5

Revisión del 6 de octubre de 2026. No es una prueba física, de GPU ni una certificación de geometría exacta.

## Manifiesto y Fidelidad

14 nodos del layout tienen mallas propias separadas. Las otras 13 entradas están desglosadas en `model-production.unmodeled`, sin activaciones nuevas. GLB, materiales y código propios; no texturas/fotografías copiadas ni extracción de visores de Sketchfab. Cada archivo tiene huella, presupuesto, referencia y discrepancias de envolvente en `model-assets.json`.

Revisadas perspectiva, frontal, posterior, lateral y superior en la rejilla local y referencias de producto/manuales. Correcciones durante revisión: abertura óptica antes tapada, mandos hundidos, huecos de abrazaderas desplazados 1 mm, cabezal separado de la rosca candidata del monitor y solapamiento de BG70 con unidad de control. No se movieron puertos canónicos para ajustar la malla. Todas las roscas, superficies de asiento y articulaciones son ilustrativas.

La caja publicada no siempre corresponde a la caja visual: FX3 sin salientes frente a controles/zapata; 4770 con pose de zapata aproximada; 1674 con palancas; matte box con bandera; gimbal superior sin grip estándar; 3026B articulado. No se deforman ejes para simular coincidencia exacta.

## Software

`npm run build` y `npm run build:public` pasan. 166 comprobaciones: 66 planificador, 26 conexiones, 7 worker, 17 perfiles, 20 contrato GLB, 19 carga y 11 reconstrucción. Las pruebas de reconstrucción conservan los manifiestos, separan productos, comprueban dimensiones nominales de varillas, coincidencias visuales de interfaz y exportación repetida byte a byte.

Salida pública local: 30 archivos permitidos, aproximadamente 4.82 MB; 14 GLB. Sin `public/references`, capturas, documentos privados ni el GLB original DJI. Persisten avisos de chunks superiores a 500 kB; no se interpreta la compilación como garantía de fluidez. GLB no incluidos en precarga offline; respaldo aproximado comunicado.

## Recorrido Local

Servidores observados: desarrollo `http://127.0.0.1:5174/` y compilación pública `http://127.0.0.1:4173/`.

- Comercial: carga de las doce mallas del perfil termina sin fallo comunicado; examen de FX3 abre diálogo, frontal seleccionable y confirmación de huella verificada. Se conservan enlaces oficiales, no fotografías en la compilación pública.
- Despiece separa cámara, jaula, base, barras, gimbal, grip, batería y monitor; no aparece una cámara/lente fusionada al gimbal. Conexiones mantiene HDMI A/A y anclajes A/B; despiece indica vínculo lógico desconectado.
- Editor móvil: catálogo vacío al crear, diez elecciones directas sin cambio automático de vista. Configuración gimbal vertical conserva FX3, SEL1635GM, 4770, RS 4 Pro, BG70, 3026B, Indie 7, Mic 2, HDMI y control USB-C. No se añade V-mount, parasol o base implícitos.
- Viewport solicitado 390 × 844; lectura DOM efectiva 390 × 844 y ancho de contenido 375, sin desbordamiento horizontal en el recorrido observado. No es un teléfono físico.
- Montaje deriva nueve etapas. A partir del montaje del soporte se conserva monitor; RX en accesorios del núcleo. Reproducción 2× termina en la novena con ocho nodos y tres circuitos: HDMI, TRS y control USB-C. Extracción opcional no se inicia y cero etapas se marcan físicamente revisadas. Las esperas de carga son estados visibles, no un ensayo cronometrado.
- Detalle de RX abre en móvil con huella confirmada, cinco controles accesibles y origen aproximado explícito. Guardar el rig confirma historial local y conserva las diez elecciones.

La publicación remota se documentará cuando se observe, no antes. Capturas locales excluidas de publicación: `public/previews/takegrid-fx3-detalle-local.png`, `public/previews/takegrid-montaje-modelos-movil-025.png`, `public/previews/takegrid-mic2-detalle-movil-025.png`.

## Pendientes

Archivo/licencia del DJI_RS4_PRO_2 solicitado por el usuario; archivo/permiso del escaneo FX3 solicitado por correo; vistas autorizadas para Meshy y el resto del catálogo. No se generó nada en Meshy ni se consumieron créditos. Las 14 mallas mejoran el detalle, pero no cumplen la petición de CAD/modelos mecánicamente exactos. Ensayos con usuarios, rig físico, derechos comerciales adicionales y las puertas de beta/financiación siguen abiertas.
