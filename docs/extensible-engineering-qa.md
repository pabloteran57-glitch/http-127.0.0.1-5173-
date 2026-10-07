# Extensibilidad: comprobaciones y pendientes

Revisión: 7 de octubre de 2026. Iteración 0.2.7. No declara completa la beta ni convierte un ensayo de software en validación mecánica.

## Cambios Verificados

- Siete plantillas conservan sus listas; contexto y ruta se declaran en datos.
- Selección, completado explícito, soportes, exclusividad, guías y poses no toman decisiones por IDs de producto en los controles principales.
- Cadenas desconocidas, ciclos o dependencias contradictorias mantienen la selección pendiente y no ofrecen soportes ficticios.
- Dos cuerpos o dos ópticas incompatibles no se instalan juntos ni se sustituyen silenciosamente.
- Las piezas sin modelo autorizado reciben envolventes etiquetadas sin puertos, mandos o forma prestada.
- Las referencias de manual se condicionan a las piezas de la etapa; las imágenes del fabricante permanecen fuera del paquete público.

## Regresiones

`scripts/test-extensible-engineering.mjs`: 15 casos. Remapeo completo aislado de IDs de productos, circuitos y puertos; siete plantillas, guía acumulativa, reproducción, extracción, masa aproximada y pose. Casos negativos de óptica sin cuerpo, raíz desconocida, ciclos, ambigüedad, exclusividad y recurso de otro modelo. No son equipos nuevos reales.

La suite del planificador pasa 72 + 15 + 27 + 7 + 17 = 138 comprobaciones, además de 300 selecciones y 300 guías reproducibles. Contratos, carga, reconstrucción y miniaturas suman otras 56: **194 comprobaciones automatizadas**. TypeScript, datos y compilación pública correctos. Paquete: 50 archivos propios, aproximadamente 5.31 MB; 17 GLB y 17 miniaturas auditadas, sin referencias del fabricante, notas privadas ni credenciales. Los casos de worker usan caché/red simuladas.

## Navegador Local

Compilación pública 0.2.7, módulo principal `index-BXdpyS_q.js`. Pruebas en Edge, perfiles QA separados de la biblioteca inicial.

- Rig XLR recuperado: 12 elecciones, 9 objetos representados y 4 circuitos. Seis etapas relevantes a 2×; termina en etapa canónica 12, preparado y en pausa, sin saltar a extracción. Sin errores de consola ni mallas fallidas.
- Ventana móvil 390 × 844: selección directa de siete piezas y cambio a vertical sin alterar elecciones. Indie 7 queda pendiente hasta pulsar **Completar monitor (3)**; añade explícitamente 3026B, HDMI y NP-F970/PRO. Guardado y recarga conservan las diez elecciones, monitor y RX visibles; nueve mallas listas y ningún fallo. Sin desbordamiento horizontal.
- Guía vertical: ocho etapas más extracción opcional. Reproducción a 2× termina preparada y en pausa en la etapa canónica 12, con nueve piezas, HDMI y TRS visibles, sin extracción automática ni errores de consola. El manual de página 7 aparece sólo con 3026B en su etapa; no se inserta una imagen privada en la demo pública.

Capturas locales: `research/model-incoming/extensible-public-desktop-027.png`, `extensible-mobile-editor-027.png` y `extensible-mobile-rig-027.png`. No se incluyen en el paquete público. Ventana móvil emulada, no ensayo táctil o GPU de un teléfono físico.

## Plan Restante

| Fase | Avance real | Falta para cerrar |
|---|---|---|
| 1. Núcleo | Editor directo, elecciones completas, audio y cadenas de monitor; montaje filtrado y guardado probado | Aceptación observada, fluidez en dispositivos físicos y comprobación de montajes |
| 2. Extensibilidad | Motor, visor y guía declarativos; 15 regresiones nuevas | Revisiones semánticas restantes y conjunto real adicional completo |
| 3. Catálogo | 30 entradas actuales; 10 candidatos aislados y 3 manifiestos parciales revisados | Completar documentación, compatibilidad, distribución, conexiones, guía y geometría propia antes de activar |
| 4. Proyectos | Perfiles locales, recuperación, historial y caché propia | Ensayo físico sin conexión; copias externas y privacidad. Nube aplazada por el usuario |
| 5. Beta cerrada | Protocolo preparado | Reclutar 10–15 participantes; actualmente cero observaciones y ninguna tasa calculable |
| 6. Beta pública | Versiones recuperables y ayuda básica | Superar beta cerrada, canal/responsable de soporte y revisión de operación |
| 7. Financiación | Estructura y alcance preliminares | Evidencia de uso, cotizaciones, elegibilidad y revisión legal |

Fuente de avance: `data/product-roadmap.json`. Revisiones del lote: [manifiestos](catalog-manifest-reviews.md). Las notas privadas de reunión y bibliotecas del usuario no se usan como datos de prueba ni se publican.

## Próximo Conjunto

`fx30-handheld-prime`: FX30 + HawkLock 4770 + FE 20mm F1.8 G + NP-FZ100. Sigue en investigación. Sony documenta puertos y batería nativa de FX30; el asa incluida difiere entre ILME-FX30 e ILME-FX30B. No copiar forma, puertos, control DJI ni masa de FX3. Faltan cadena concreta, holguras, funciones por firmware, guía, derechos y pruebas; no se instala mediante coincidencia de montura.

No se asignan fechas, porcentajes globales ni costes de beta sin evidencia y capacidad definida. El trabajo de software puede continuar; los ensayos físicos, usuarios reales, derechos externos y decisiones legales requieren evidencia externa.
