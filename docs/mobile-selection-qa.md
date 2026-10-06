# Selección móvil y audio 0.2.3

Revisión: 6 de octubre de 2026. Demo pública: https://takegrid.netlify.app/. Commit funcional: `0edf6c425b146f05d7419b3ca0fad57545fd553c`.

## Incidencias y resultado

| Incidencia | Corrección | Evidencia y límite |
|---|---|---|
| Crear rig parecía un manual obligatorio | Catálogo directo; tarjeta completa añade/quita; Elegidas y Datos son vistas opcionales; guardar desde cualquiera | Reproducción del obstáculo de flujo en 390 px. El clic de selección funcionó en la revisión anterior: no se afirma haber reproducido un fallo táctil de hardware |
| Jaula mezclada con cámara/óptica | Categoría Jaulas y accesorios de siete productos; cámara/óptica sólo dos | 27 IDs únicos conservados, sin ampliar catálogo |
| Audio no aparecía en el modelo final | RX candidato sobre zapata 4770, dependiente de jaula elegida; 28 g y envolvente de RX, no kit | Manuales oficiales revisados; pose, retención, tornillos y barrido sin medición física |
| Audio en vertical conservaba una curva horizontal | Offsets locales TRS rotan con cámara/jaula/RX; monitor fijo no hereda rotación | Prueba unitaria y extremos A/B visibles. Radios y longitud real no validados |

## Revisión de interfaz

Ventanas de navegador: 320 × 568, 390 × 844, 568 × 320 y escritorio 1280 × 900. No equivalen a pruebas en teléfonos físicos.

- Catálogo inicial con 27 referencias y sin Siguiente/Atrás obligatorios. Añadir/quitar permanece en la misma vista.
- Editor ocupa el alto disponible, lista desplazable y acciones visibles; sin desbordamiento horizontal en ventanas comprobadas. Ajuste adicional de encabezado/acciones en horizontal compacta.
- Categorías, búsqueda, estados vacíos y Elegidas mantienen ámbito y orden. Añadir soporte es explícito; no añade energía al monitor.
- Perfil de prueba propio vertical con diez elecciones: FX3, 4770, RS 4 Pro, BG70, Indie 7, 3026B, HDMI Kondor Blue, control USB-C DJI, 16-35 GM y Mic 2. Guardado, recarga y Mi equipo conservan las diez.
- Ocho nodos en visor y dos productos de cable en lista. TX y estuche no montados en cámara. Quitar/reponer Mic 2 conserva el resto.
- Montaje derivado del perfil: nueve etapas reproducibles más extracción opcional. RX y TRS aparecen en la etapa de jaula. Reproducción 2× se detiene en revisión final, no en extracción; no confirma comprobaciones físicas.
- Conexiones muestra salida de RX y entrada MIC de FX3 como A/B. No se activa circuito de banco ni alimentación de monitor implícita.
- Sin errores ni advertencias en consola capturada durante las interacciones comprobadas. No demuestra ausencia universal de fallos.

Se usaron perfiles de prueba separados. No se borró la biblioteca ni se recargó el borrador abierto de otra pestaña.

## Compilación y fuentes

99 pruebas: 66 de planificador/persistencia/medición, 26 de conexiones y siete de worker, más 600 casos reproducibles. `build:public` aprobado: doce archivos propios, 1,55 MB; sin medios de investigación. Assets observados: `index-glFEvWu5.js`, `index-Bh-oL0EQ.css`, `RigViewer-DGwcMLQR.js`.

- [SmallRig 4770, manual página 4, llamada 5](https://static.smallrig.com/mall/img/public/1725874097334_.pdf): zapata inclinada, no coordenadas CAD certificadas.
- [DJI Mic 2, manual v1.2 páginas 8 y 13](https://dl.djicdn.com/downloads/DJI_Mic_2/20240426/UM/DJI_Mic_2_User_Manual_V1.2_EN.pdf): zapata integrada del RX y salida a cámara TRS.
- [DJI Mic 2, especificaciones](https://www.dji.com/mic-2/specs): RX 54,20 × 28,36 × 22,49 mm y 28 g.

Capturas locales de evidencia en `public/previews/`, excluidas de publicación. Persisten: aceptación observada, rendimiento en equipos reales, derechos de miniaturas/modelos y ensayos mecánicos/eléctricos. Esta corrección no libera la beta.
