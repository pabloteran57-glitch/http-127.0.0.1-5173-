# Montaje visible y accesorios desde el visor

Versión 0.2.8, 7 de octubre de 2026. Revisión de software; no certificación física ni liberación de beta.

## Causa y corrección

Un rig vacío comenzaba como gimbal aunque el usuario no hubiera elegido uno. El contexto estaba en Datos del rig y completar el monitor proponía la cadena lateral correcta para ese contexto, pero equivocada para la intención del usuario.

- Crear desde cero ahora comienza a mano, sin añadir componentes.
- Montaje del rig visible en Catálogo y Elegidas; la tarjeta del monitor ofrece el mismo cambio de contexto.
- A mano/estático sin XLR: NATO superior desmontable 4770 → 2906B → Indie 7. Sin RS ni 3026B.
- Con XLR-H1: retirar NATO superior 4770; XLR-H1 → 4830 → 2906B → Indie 7.
- Gimbal activo: NATO lateral fijo RS → 3026B → Indie 7. No se ofrece monitor sobre la cámara móvil.
- Cambiar contexto conserva todos los IDs elegidos y deja los soportes no correspondientes pendientes. No sustituye ni elimina piezas.

## Acción contextual

La captura del usuario reveló que el enlace Ver foto oficial heredaba altura y fondo del contenedor de fotografías. Se separó con una clase explícita de enlace, altura automática, mínimo táctil de 44 px y contraste sobre fondo oscuro; la foto local ampliable conserva su contenedor. No se sustituye una referencia sin permiso por una imagen inventada.

Seleccionar una malla o su etiqueta y pulsar Añadir a esta pieza abre las propuestas de `attachment_options` en `data/planner-rules.json`. Cada propuesta identifica ancla, piezas, contexto, fuentes oficiales y límites. El motor comprueba la cadena completa y que todos los elementos propuestos puedan activarse. No basta la coincidencia de nombres o conectores.

Las miniaturas muestran recursos propios aproximados. Se enumera cada pieza faltante, incluidas dependencias, antes de confirmar. Añadir actualiza el borrador; Guardar rig es una acción separada. Una plantilla se convierte en copia editable, sin modificar las siete originales. Opciones desconocidas, contradictorias, ya elegidas o sin evidencia no añaden elementos.

El panel no amplía el catálogo. Cables y alimentación siguen siendo candidatos con las comprobaciones canónicas; un conjunto visual completo no prueba señal, apriete, pinout o equilibrio.

## Fuentes y orden técnico

Se conservan manifiesto, distribución, conexiones y guía de 0.2.6/0.2.7 antes de modificar la interfaz. No se cambian cotas ni posiciones para resolver un problema de navegación. La ficha oficial de [HawkLock 4770](https://www.smallrig.com/HawkLock-Quick-Release-Cage-Kit-for-Sony-FX3-FX30-4770.html) confirma NATO desmontable y puntos para monitor; [manual 4770/4830](https://static.smallrig.com/mall/img/public/1725874097334_.pdf), página 4, muestra el NATO y, página 8, la extensión XLR. [Manual 2906B](https://static.smallrig.com/mall/img/public/0g141qmktenu-1751249917074_.pdf) conserva interfaces y cargas dependientes del ángulo. [Indie 7](https://smallhd.com/products/indie-7) documenta placa serie L incluida; no se inventa un cable exterior para esos contactos.

## Verificación

Las pruebas específicas están en `scripts/test-attachments.mjs`: 13 comprobaciones de cadena sin gimbal, XLR, lateral vertical, cambio de contexto, elecciones exactas, rechazo de reservas, duplicados, recuperación local y plantillas intactas. `scripts/test-adjustments.mjs` añade 19 comprobaciones de persistencia, copias, articulación, anclajes, deslizamiento y nombres originales de GLTFLoader. Son pruebas de software, no equipos físicos.

En Edge, compilación pública local:

- Perfil QA aislado y rig de ocho elecciones: FX3, SEL1635GM, 4770, 2906B, Indie 7, HDMI Kondor Blue, NP-F970/PRO y Mic 2. Monitor y RX visibles; sin RS ni 3026B implícitos. Añadir monitor y audio desde la jaula modifica sólo el borrador; opciones ya elegidas dejan de proponerse.
- Guardado confirmado antes de recargar: las ocho elecciones se recuperaron sin extras. Montaje derivó seis etapas, sin montaje/equilibrio/control de gimbal, y terminó en Revisión final con reproducción 2×, sin extracción automática.
- Orientación 36° de inclinación / 36° de giro guardada y reabierta. Revisión visual del cabezal tras corregir su identificación: GLTFLoader elimina separadores del nombre y conserva el original en `userData.name`. La prueba utiliza el GLB decodificado, no sólo su JSON.
- La misma identificación se aplica al riel NATO desmontable 4770: su malla se oculta con XLR y se restaura sin ocultar la jaula. Prueba sobre el GLB propio decodificado; no es desmontaje físico verificado.
- Ventana móvil configurada a 390 × 844; contenido útil de 375 px con barra de desplazamiento. Monitor y controles visibles, Listo de 88 × 44 px dentro de la ventana y pie fijo del panel; información técnica desplazable. Es una comprobación de viewport, no hardware táctil real.
- Copia QA comercial con recorrido simulado atrás 5 / delante 10 mm: el formulario vacío no habilitó movimiento; tras confirmación de fixture mostró 10 mm y los conservó después del guardado y recarga. Esta aceptación de formulario es exclusivamente prueba de software, nunca evidencia de recorrido medido en un rig real.
- 3026B muestra sólo inclinación de 170° total, sin deslizador de giro. Errores/advertencias de consola vacíos en el rig NATO inspeccionado.
- Enlace de foto oficial: altura 44 px, fondo transparente y texto legible; no reaparece el bloque blanco vacío.

Capturas locales de investigación: `research/model-incoming/qa-028-monitor-desktop.png` y `research/model-incoming/qa-028-monitor-mobile.png`. No se distribuyen como recursos de producto ni evidencia de usuarios.

## Ajustes y fuentes

[Ajustes de posición](adjustable-layout.md) se genera desde el manifiesto de distribución. Manuales 2906B y 3026B, página 2, documentan respectivamente 180°/360° y 170° de inclinación. Los ceros y pivotes son aproximados. Manual 3203B, página 5, documenta abrazaderas atornilladas: no se inventa una bisagra. Placa y V-mount sólo se trasladan axialmente con recorrido aportado por el usuario. Puertos y tangentes ilustrativas acompañan las poses; no hay detección automática de colisiones, radios o equilibrio.

Compilación pública, TypeScript y auditorías correctas; 228 comprobaciones automatizadas, además de 300 selecciones y 300 guías reproducibles. 50 archivos permitidos, aproximadamente 5,34 MB; 17 mallas y 17 miniaturas propias. Advertencia de módulos JavaScript mayores de 500 kB conservada, no ocultada. Publicación 0.2.8 confirmada por Sites a las 16:11 de Ecuador del 7 de octubre; el estado, procedencia y versión recuperable se registran en [alojamiento](additional-hosting.md).

## Plan restante

Las incidencias de este bloque tienen correcciones y recorridos locales de software comprobados. La fase 1 sigue abierta para rendimiento sostenido en dispositivos físicos y aceptación observada. El piloto FX30 + SEL20F18G + NP-FZ100 sigue en investigación, no instalado. Fases 2 y 3 continúan por conjuntos verificados; fase 4 conserva perfiles locales y recuperación, con nube aplazada. Fases 5 a 7 necesitan usuarios observados, dispositivos, ensayos físicos, soporte y presupuesto reales. No se dan por terminadas con esta compilación.
