# Inspeccion del piloto 0.2.9

Revision local del 2026-10-07 sobre la compilacion publica, servida en el puerto informado por Vite. No se probaron rigs reales ni participantes de beta.

## Comprobaciones realizadas

- Tres mallas propias: FX30, SEL20F18G y NP-FZ100; cada carga informa huella verificada, no CAD.
- Cinco botones de vista de cada modelo revisados en escritorio: perspectiva, frontal, posterior, lateral y superior.
- Pantalla movil simulada de 390 x 844 px en Edge: tarjetas apiladas, las tres inspecciones accesibles, vista superior y cierre comprobados. No equivale a un telefono fisico ni ensayo tactil.
- Sin desbordamiento horizontal del modal: ancho/contenido iguales, 324 px en Ayuda y 339 px en inspeccion, segun DOM observado.
- Escape cierra inspeccion sin cerrar Ayuda; devuelve foco a la tarjeta de origen. Cierre por boton tambien comprobado.
- Al salir siguen Comercial, las cuatro tareas, FX3 seleccionada, monitor y 17 elementos originales. No se crearon rigs ni perfiles de prueba.
- Sin errores o avisos capturados en el registro de consola de la pestaña al terminar este recorrido.
- Corregido parpadeo de las cubiertas FX30 por superficies coplanares; actualizadas huellas y envolvente visual, sin cambiar dimensiones oficiales.

## Evidencia

Capturas propias locales en `research/model-incoming/qa-029/`: `fx30-desktop.jpg`, `sel20-desktop.jpg`, `npfz100-desktop.jpg`, `fx30-mobile.jpg` y `pilot-mobile.jpg`. Contact sheet de cinco vistas por pieza en `research/model-incoming/pilot-contact-sheet.png`. No se publican estas capturas ni notas privadas de investigacion en el alojamiento o GitHub.

`npm run build:public` paso: 170 pruebas del planificador, 58 de modelos activos, 20 del piloto documental y 13 del piloto visual; total 261 comprobaciones de software. Las 17 mallas activas conservan su exportacion byte a byte. Paquete permitido de 56 archivos, aproximadamente 6.28 MB, con 20 GLB y 20 WebP propios.

## Pendiente

Poses del conjunto FX30, seleccion y reglas dinamicas, guia de montaje e integracion con guardado. Catalogo activo: 30 entradas, 18 circuitos y 7 plantillas, sin cambios. `check:catalog --strict` y `check:beta --strict` siguen fallando intencionadamente por criterios pendientes. Pruebas de software y visor no certifican encajes, equilibrio, polaridad, seguridad ni beta profesional.
