# Rigs propios y montaje visual

## Flujo de trabajo

1. Elegir **Crear rig** para una selección vacía, o **Personalizar** para copiar una plantilla sin modificarla.
2. Definir nombre, uso y encuadre. Seleccionar cada producto del catálogo por categoría o búsqueda.
3. Revisar los pendientes. **Añadir dependencias disponibles** requiere una acción explícita; no agrega soportes ni productos externos al catálogo.
4. Abrir el rig para inspeccionarlo, comprobar sus conexiones y recorrer **Montaje**.
5. Elegir **Guardar rig** y abrirlo después desde **Mis rigs**. En una plantilla, el botón guarda una copia propia sin modificar el original. No es necesario descargar ni abrir archivos.

El guardado es local al origen y navegador, con un máximo de 40 rigs. No sincroniza cuentas, sesiones ni colaboradores. La app vuelve al último rig guardado después de una recarga. Los borradores se mantienen mientras la página está abierta, incluso al cambiar de perfil; cerrar o recargar puede perder cambios sin guardar.

Los registros guardados se validan contra el catálogo. Se rechazan versiones desconocidas, piezas desconocidas, IDs duplicados y documentos inválidos. La edición no altera las especificaciones canónicas. Si otra pestaña cambió la biblioteca, se bloquea una escritura obsoleta y el borrador permanece abierto; no se sobrescribe silenciosamente el trabajo de esa pestaña. Una biblioteca ilegible se conserva en una copia local `takegrid.rigs.v1.backup` antes de un nuevo guardado, siempre que el almacenamiento esté disponible.

La interfaz no ofrece exportación de planos ni transferencia de archivos. El formato JSON es interno y reutilizable para desarrollo; no se presenta como un entregable que el usuario deba abrir fuera de Takegrid. Borrar los datos del sitio elimina la biblioteca local.

## Reglas de ingeniería

`data/planner-rules.json` vincula los productos ya verificados con cadenas conservadoras de soporte, contextos de uso y etapas visuales. No describe compatibilidad universal.

- Una elección incompleta se conserva en el perfil como pendiente, pero no se representa como instalada ni habilita sus conexiones.
- La V-mount necesita la cadena 3203B, varillas, 1674 y jaula documentada. La masa de planificación del 3203B sigue siendo 351 g.
- El monitor requiere el soporte lateral del gimbal. Para cámara estática o a mano no se inventa un soporte alternativo.
- Distribuidor, RavenEye, foco y hub de Transmission permanecen en reserva. El doble HDMI de banco conserva su diagrama separado.
- XLR-H1 no se activa en gimbal. La configuración vertical sólo utiliza la base ligera documentada; otras selecciones permanecen pendientes.
- Los circuitos se derivan de los extremos y del producto de cable seleccionado. No se añade una segunda salida HDMI a la FX3 ni un cable implícito.
- NP-FZ100 interna, fijación del RX, masas incompletas, holguras y pruebas eléctricas siguen siendo dependencias explícitas.

## Ensamblaje visual

Las trece etapas conservan las verificaciones y fuentes originales. Cada fotograma muestra una intersección entre la selección activa y los elementos introducidos hasta esa etapa. Las conexiones de vídeo, control y alimentación aparecen sólo en su etapa, con ambos extremos disponibles.

En la etapa del monitor, el estabilizador translúcido identifica el soporte de referencia, no un acople de la cámara ya verificado. La extracción elimina el bloque de gimbal y energía externa; no añade un asa que el usuario no haya seleccionado. Las aplicaciones, el receptor sin soporte confirmado y los productos sin geometría no reciben modelos ficticios.

El usuario puede recorrer las etapas o reproducirlas automáticamente, pausar y elegir el ángulo. La reproducción se detiene al salir de Montaje, no avanza en una pestaña oculta y no marca verificaciones como realizadas. La aparición animada no es una trayectoria de inserción, ni simula equilibrio, torque, tornillería o energizado. Se respeta la preferencia de movimiento reducido.

## Extensión futura

El catálogo ampliado queda fuera de esta iteración. Para incorporar otra cámara o ecosistema será necesario verificar piezas, fuentes, interfaces, reglas de soporte, geometría y etapas, y añadir casos de prueba. No basta con importar una lista grande de productos.

El objetivo de producto es apoyar al 1AC y al filmmaker en preproducción y preparación de rodaje mediante un plan trazable. No se presenta como reemplazo de manuales, capacitación de seguridad o comprobaciones físicas.

## Pruebas

`npm run test:planner`: 21 pruebas y 300 selecciones reproducibles sobre dependencias, contextos, cables, montaje progresivo, extracción, formato de biblioteca, escritura obsoleta, cuota y recuperación. Estas pruebas se ejecutan en las compilaciones local y pública.
