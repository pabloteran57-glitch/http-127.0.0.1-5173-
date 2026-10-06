# Rigs propios y montaje visual

## Flujo de trabajo

1. Elegir **Crear rig** para una selección vacía, o **Personalizar** para copiar una plantilla sin modificarla.
2. **Define tu uso**: nombre, rodaje con gimbal/a mano/estático y encuadre. **Elige piezas**: tarjetas visuales por categoría o búsqueda, papel de cada producto y referencia oficial accesible. El editor abre el catálogo, no una selección cerrada.
3. **Revisa tu rig**: todas las elecciones, en su orden, con estados En visor / En tu lista / Montaje pendiente. Añadir soportes o conexiones requiere un botón explícito y muestra los nombres que añadirá. No se sugieren cadenas parciales excluidas por contexto.
4. Abrir el rig para inspeccionarlo, comprobar sus conexiones y recorrer **Montaje**.
5. Elegir **Guardar rig** y abrirlo después desde **Mis rigs**. En una plantilla, el botón guarda una copia propia sin modificar el original. No es necesario descargar ni abrir archivos.

El guardado es local al origen y navegador, con un máximo de 40 rigs. No sincroniza cuentas, sesiones ni colaboradores. La app vuelve al último rig guardado después de una recarga. Guardar confirma el plan y conserva hasta cinco versiones; las anteriores se abren como copias. Los borradores se registran por sesión tras 350 ms y al ocultar o abandonar la página, si el almacenamiento lo permite. Mis rigs permite recuperarlos sin reemplazar un plan confirmado. Un cierre inmediato, cuota agotada o borrado de datos del sitio aún puede perder cambios; no es una copia de seguridad externa.

Los registros guardados se validan contra el catálogo. Se rechazan versiones desconocidas, piezas desconocidas, IDs duplicados y documentos inválidos. La edición no altera las especificaciones canónicas. La biblioteca v2 y su historial se escriben juntos bajo Web Locks y comprobación de versión; si el navegador no permite el bloqueo, no se confirma el guardado. Si otra pestaña cambió la biblioteca, se bloquea una escritura obsoleta y el borrador permanece abierto. Revisar cambios conserva las diferencias como copias; nunca sobrescribe silenciosamente otra pestaña. La biblioteca v1 histórica se conserva. Una biblioteca v2 ilegible se respalda en `takegrid.rigs.v2.backup` antes de un nuevo guardado, si el almacenamiento está disponible. Detalles en [Proyectos locales](durable-projects.md).

La interfaz no ofrece exportación de planos ni transferencia de archivos. El formato JSON es interno y reutilizable para desarrollo; no se presenta como un entregable que el usuario deba abrir fuera de Takegrid. Borrar los datos del sitio elimina la biblioteca local.

## Reglas de ingeniería

`data/planner-rules.json` vincula los productos ya verificados con cadenas conservadoras de soporte, contextos de uso y etapas visuales. No describe compatibilidad universal.

- Una elección incompleta se conserva en el perfil como pendiente, pero no se representa como instalada ni habilita sus conexiones.
- La V-mount necesita la cadena 3203B, varillas, 1674 y jaula documentada. La masa de planificación del 3203B sigue siendo 351 g.
- El monitor requiere el soporte lateral del gimbal. Para cámara estática o a mano no se inventa un soporte alternativo.
- Distribuidor, RavenEye, foco y hub de Transmission permanecen en reserva. El doble HDMI de banco conserva su diagrama separado.
- XLR-H1 no se activa en gimbal. En rigs propios verticales, 3026B e Indie 7 pueden conservar la cadena candidata lateral fija; no se gira el monitor con la cámara. La pila de varillas/V-mount vertical sigue pendiente y no se activa. No se cambia la plantilla vertical original.
- Los circuitos se derivan de los extremos y del producto de cable seleccionado. No se añade una segunda salida HDMI a la FX3 ni un cable implícito.
- NP-FZ100 interna, fijación del RX, masas incompletas, holguras y pruebas eléctricas siguen siendo dependencias explícitas.

La vista Rig conserva una bandeja de todas las piezas elegidas; seleccionar una pendiente abre su ficha sin instalarla artificialmente. Un monitor lateral candidato puede tener alimentación pendiente: dibujarlo no significa que funcione. En la demo pública, las tarjetas muestran pictogramas de categoría identificados como esquemas, no fotos o CAD. La foto real revisada se consulta por enlace oficial; cuando sólo hay manual o tabla técnica se enlaza al producto. Las fotografías locales revisadas no se redistribuyen sin permiso.

## Ensamblaje visual

Las trece etapas canónicas conservan las verificaciones y fuentes originales. `data/assembly-profile-content.json` contiene bloques condicionados a las piezas y circuitos activos; `src/lib/assembly.ts` deriva la secuencia relevante. Un núcleo de cámara, óptica y jaula recorre cuatro etapas: núcleo, jaula, alimentación y revisión final. Las comprobaciones necesarias se mantienen aunque no añadan geometría. Los pendientes se explican aparte, nunca como instalación ficticia.

Cada fotograma muestra la intersección entre la selección activa y los elementos introducidos hasta esa etapa. Las conexiones de vídeo, control y alimentación aparecen sólo en su etapa, con ambos extremos disponibles. Elegir una pieza o ruta pausa la reproducción y lleva al visor sin modificar el perfil.

En la etapa del monitor, el estabilizador translúcido identifica el soporte de referencia, no un acople de la cámara ya verificado. La extracción elimina el bloque de gimbal y energía externa; no añade un asa que el usuario no haya seleccionado. Las aplicaciones, el receptor sin soporte confirmado y los productos sin geometría no reciben modelos ficticios.

El usuario puede reproducir, pausar, reiniciar, avanzar, retroceder, elegir etapa, ángulo y ritmo (0,5×, 1×, 2×). El temporizador espera a que el visor notifique preparación; usa 4,5 segundos por etapa a 1×. Se detiene al salir de Montaje, abrir el editor, biblioteca o ayuda, interactuar con la escena o esconder la pestaña. Termina en la revisión final, nunca en extracción automática. No marca comprobaciones como realizadas.

El encuadre depende del conjunto completo, no de si el gimbal ya apareció en la etapa. Renderizado bajo demanda cuando la escena está quieta; las transiciones continúan solicitando fotogramas. No se declara una mejora cuantificada de FPS. La aparición animada no es una trayectoria de inserción, ni simula equilibrio, par, tornillería o energizado. Se respeta la preferencia de movimiento reducido.

## Extensión futura

Diez candidatos se investigaron en un lote aislado, todavía no seleccionable. Para incorporar otra cámara o ecosistema será necesario completar fuentes, interfaces, reglas de soporte, geometría, derechos y etapas, y añadir casos de prueba. No basta con importar una lista grande de productos. El [lote piloto](catalog-pilot.md) y el [motor extensible](extensible-engineering.md) documentan esas puertas de entrada.

El objetivo de producto es apoyar al 1AC y al filmmaker en preproducción y preparación de rodaje mediante un plan trazable. No se presenta como reemplazo de manuales, capacitación de seguridad o comprobaciones físicas.

## Pruebas

`npm run test:planner`: 46 pruebas del planificador/persistencia/medición, siete del worker sin conexión y 600 casos reproducibles (300 selecciones y 300 guías). Cubren dependencias, contextos, cables, montaje progresivo, inventario, extracción, biblioteca, escritura obsoleta, cuota, historial y recuperación. Se ejecutan en las compilaciones local y pública. Registro actual en [Verificación 0.2.0](iteration-qa.md); registro previo en [Estabilización](stabilization-qa.md).
