# SEL35F18F: revisión de integración

Versión comprobada: 0.2.13. Fecha: 8 de octubre de 2026, Ecuador. Fase 3 del plan, sin liberación de beta ni ensayo físico.

## Orden técnico

1. Manifiesto: modelo SEL35F18F, diámetro 65.6 mm, longitud 73 mm y masa aproximada 280 g según Sony. No es SEL35F18 con OSS. Parejas FX3 y FX30 consultadas en la matriz oficial con resultado visible de compatibilidad; firmware del ejemplar pendiente.
2. Distribución: objetivo en su cuerpo elegido, sin parasol implícito. Posiciones, superficies y asiento son aproximados; las cotas globales no certifican bayoneta o holguras.
3. Conexiones: no hay cable externo de óptica. Monitor/audio conservan los circuitos propios del cuerpo elegido; no se trasladan puertos de FX3 a FX30.
4. Guía: bloque propio FX3 y etapa de óptica FX30. Las fuentes condicionales siguen la selección, también en la comprobación final. No aparece evidencia del 20 mm cuando se elige 35 mm.
5. Visor: malla y miniatura propias, revisadas en cinco vistas contra fotografía y diagramas Sony. Sin CAD, texturas de fabricante ni precisión mecánica inferida.
6. Variantes: dos ejemplos explícitos a mano/horizontal, uno por cuerpo. Siete plantillas originales intactas; gimbal, vertical y estático no se habilitan por analogía. Filtro de 55 mm no crea un adaptador para 3645.

## Software

`npm run validate`, TypeScript y compilación pública superados: 362 comprobaciones, incluidas 17 de la integración SEL35F18F y 16 del inventario SmallRig/Tilta. Se recorren 1024 subselecciones del conjunto con 35 mm y accesorios. Son comprobaciones de software, no ensayos reales.

El registro tiene 34 piezas, 21 mallas y 21 miniaturas propias. Paquete público comprobado: 58 archivos permitidos, unos 6.59 MB sin comprimir, sin referencias, manuales, investigación privada ni credenciales. Continúa el aviso de chunks grandes de Vite; no se atribuyen FPS, consumo de batería o tiempos de GPU.

## Interfaz local

Edge sobre `http://127.0.0.1:4174/`, compilación pública local. Perfil de prueba propio, sin modificar la biblioteca de producción:

- Creación desde cero de FX30, 4770, SEL35F18F, NP-FZ100, Indie 7, 2906B, NP-F970/PRO, HDMI Kondor Blue y Mic 2: nueve elecciones explícitas.
- Guardado y recarga conservan nueve piezas, incluidas monitor y RX. Ocho objetos físicos modelados; el cable HDMI está en la lista y sus circuitos, no como pieza rígida adicional.
- Guía de diez etapas; reproducción a 2× llega a la comprobación final, sin etapas vacías de gimbal. Reinicio y salto directo a óptica comprobados.
- Etapa de óptica: manual Sony y par SEL35F18F/FX30, sin par SEL20F18G. Comprobación final: fuentes de cámara, monitor y audio elegidos, sin evidencia de óptica ajena.
- Viewport móvil 390 × 844: búsqueda de 35 mm, quitar y volver a añadir mediante tarjeta con miniatura, sin avanzar automáticamente a un manual. Guardado y reapertura conservan la selección. No es un ensayo en teléfono físico.
- Conexiones: HDMI FX30 a HDMI IN de Indie 7 y TRS RX a MIC del cuerpo; contactos nativos no dibujan cables externos. Extremos y bucles son aproximados, no recorridos certificados.
- Consola de la pestaña consultada al finalizar: sin errores o advertencias registrados en ese recorrido. No demuestra ausencia de errores en otros dispositivos.

Capturas privadas bajo `research/model-incoming/qa-0213/`: `editor-mobile.png`, `hdmi-desktop.png` y `lens-stage-desktop.png`. Excluidas de Git y de la web. Override móvil restablecido.

Publicación confirmada por Sites en el mismo dominio, estado `succeeded`, 8 de octubre a las 10:56 de Ecuador. Revisión de código `7aba129bc3140b1b65a8f631a26d45980888cf16`; paquete comparado por huellas con la compilación pública probada. [Registro de publicación](additional-hosting.md). No se atribuye una prueba de interfaz de producción: el recorrido fue local.

## Prioridad y pendientes

La nueva prioridad del catálogo es montaje SmallRig/Tilta: [inventario de 26 candidatos](rigging-catalog.md), 12 familias y nueve índices oficiales. Ninguno de esos candidatos está activo ni tiene geometría inventada. Inventario completo, variantes regionales, paginación, derechos, cadenas mecánicas, tornillería y ensayos siguen pendientes.

Retención, masa instalada, acceso a mandos, ventilación, señal recibida, firmware y audio deben comprobarse físicamente. Cuentas/nube aplazadas; perfiles locales no son autenticación. Beta observada, dispositivos, privacidad, soporte y financiación no se cierran por publicar.
