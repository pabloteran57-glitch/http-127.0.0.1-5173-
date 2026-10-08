# Integración del piloto FX30: verificación de software

Revisión: 7 de octubre de 2026. Takegrid 0.2.10. Alcance: planificación a mano y horizontal; no ensayo físico ni liberación de beta.

## Cambio Comprobado

Tres altas explícitas: Sony FX30 ILME-FX30, Sony FE 20mm F1.8 G SEL20F18G y Sony NP-FZ100. Jaula SmallRig 4770 existente. Manifiestos, distribución ilustrativa, contactos internos, guía propia y recursos activos siguen el orden de ingeniería. `data/pilot-integration.json` registra la promoción; los expedientes de investigación conservan su estado histórico.

La batería queda dentro del cuerpo ensamblado y separada sólo en despiece. No se dibuja cable externo ni se copian los anclajes de puertos FX3. Subtotal documental aproximado: 1226 g, sin tarjeta, parasol ni diferencias del subconjunto de jaula. No es masa medida ni centro de gravedad real.

## Pruebas Automatizadas

`npm run build:public` terminó correctamente, incluida validación, auditoría de mallas, TypeScript y paquete público permitido. 285 comprobaciones: 170 de planificador, 58 de recursos/modelos y 57 de catálogo, incluidas 24 de integración. También se ejercitan 300 selecciones y 300 guías reproducibles. No son ensayos de GPU, dispositivos reales o usuarios.

- Todas las 16 subselecciones del núcleo conservan elecciones exactas y filtran etapas/contactos.
- Accesorios ajenos, otros contextos y vertical quedan pendientes; dos cuerpos o dos ópticas no se montan juntos.
- Los siete perfiles FX3 conservan selecciones y conexiones. Las trece etapas originales no se sustituyen por la guía FX30.
- Guardado aditivo, recuperación e historial mantienen rigs previos. Sin migración destructiva ni piezas implícitas.
- Tres GLB propios conservan sus huellas revisadas; 20 modelos y 20 miniaturas activos. Ningún CAD, foto de fabricante o archivo privado entra al paquete público.

## Recorrido En Navegador

Vista previa de `dist-public` en Edge, origen local 127.0.0.1:4174. Plan de prueba separado llamado QA 0.2.10, sin modificar un proyecto del usuario. Ventana de escritorio y viewport 390 × 844; este último no equivale a un teléfono táctil físico.

| Acción | Resultado observado |
| --- | --- |
| Crear rig desde cero y elegir cuatro tarjetas | FX30, SEL20F18G, 4770 y NP-FZ100 elegidas, sin avanzar a un asistente |
| Guardar | Aviso de historial local y estado Guardado confirmado |
| Montaje a 2× | Recorre cinco etapas y termina con Reproducir de nuevo; sin extracción FX3 |
| Reiniciar y elegir etapa de batería | Reinicia; selección directa funciona. Los controles se comprobaron tras actualizar el estado de pantalla |
| Despiece de batería | Batería visible separada; volver al conjunto la sitúa dentro del cuerpo |
| Quitar batería desde móvil | Quedan tres elecciones, cuatro etapas y ningún contacto de energía |
| Recuperar batería y añadir Indie 7 | Cinco elecciones; sólo cuatro montadas, monitor pendiente explícito |
| Cambiar a gimbal y volver a mano | No monta el piloto en contexto no revisado; conserva todas las elecciones al volver |
| Guardar cinco elecciones y recargar | Recupera cuatro activas y monitor pendiente, sin crear soporte, HDMI ni alimentación externos |
| Buscar, filtrar y abrir Elegidas | Miniaturas cargadas de las cinco piezas; ancho de documento y diálogo 390 px, sin desbordamiento horizontal |
| Conexiones del piloto | Un enlace nativo por contactos, sin curva externa; revisión de retención pendiente visible |

Correcciones surgidas de este recorrido: retirar el aviso genérico de cables faltantes en el núcleo nativo y ocultar la propuesta NATO FX3 de la tarjeta del monitor cuando su alcance no está revisado. Ambas comprobadas en la compilación final. Consola consultada sin entradas de error/advertencia en este recorrido; no demuestra ausencia universal de fallos.

Capturas locales, fuera del paquete público: `research/model-incoming/qa-0210/desktop-bateria-desglose.png`, `mobile-editor.png` y `mobile-montaje.png`.

## Puertas Abiertas

`check:catalog -- --strict` y `check:beta -- --strict` no aprueban la liberación. Faltan masa/retención/ventilación y accesos del conjunto real; puertos/firmware y cadenas adicionales FX30; siete altas restantes; dispositivos físicos de referencia; usuarios observados; privacidad/soporte y financiación cotizada. Cuentas y nube siguen aplazadas por decisión del usuario. El resultado es integración de software acotada, no conclusión del plan completo.
