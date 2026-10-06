# UX/UI de Takegrid

Idioma de los textos propios: español, incluidos desplegables técnicos, mensajes, fichas y guía. Los nombres oficiales, modelos y siglas se conservan. `npm run validate` detecta etiquetas heredadas en inglés en los campos descriptivos principales.

## Jerarquía

- Rig: modelo ensamblado o despiece, selección de pieza y ficha del fabricante.
- Conexiones: una ruta resaltada, extremos A/B y especificación bajo demanda.
- Montaje: una etapa relevante a la vez, con guía condicionada y progreso de lectura por configuración.
- Piezas: Mi equipo por defecto, con elegidos y pendientes; Catálogo separado y búsqueda dentro del ámbito.

El modo de rodaje permanece separado de la tarea. Cambiarlo actualiza piezas, circuitos y subtotal juntos, sin diferir la selección controlada. Los nombres cortos son presentación; los manifiestos conservan nombres exactos, fuentes y restricciones.

## Visor y Conexiones

La vista inicial no superpone todos los cables. Conexiones activa las rutas, reduce la opacidad de las no seleccionadas y coloca la ficha seleccionada antes de la lista. Los contactos y la batería interna nunca se dibujan como cables externos. Las posiciones de puertos y curvas siguen marcadas como aproximadas.

Vista lateral/frontal/3-4, recentrado real de cámara, despiece y etiquetas permanecen disponibles. En móvil el recentrado está en las opciones del visor y el selector de conexión está encima de la escena. La ficha de la pieza puede abrirse desde un acceso directo bajo el visor.

Doble HDMI abre una topología de banco: incluye distribuidor, RavenEye y alimentaciones. No usa el subtotal móvil del perfil como si describiera ese banco, ni añade soportes no verificados.

## Accesibilidad y Diseño adaptable

Navegación por pestañas con flechas, Home/End, estado seleccionado y panel relacionado. Controles con nombres accesibles, foco visible y menús nativos. Diálogo etiquetado, cierre explícito y Escape. La información no depende sólo del color: los circuitos muestran tipo, nombre y extremos.

En móvil, cuatro destinos en una barra inferior fija, zona segura y controles táctiles principales de al menos 44 px. En escritorio la navegación permanece accesible al desplazar. Navegar cambia la tarea y vuelve al inicio en móvil; avanzar en montaje enfoca la nueva etapa. Seleccionar un circuito devuelve su ficha al área visible; el móvil ofrece regreso directo a la ruta 3D sólo si sus dos puertos tienen geometría aproximada. La altura del visor se adapta a pantallas de escritorio bajas. Se respeta la preferencia de movimiento reducido.

## Rigs propios y Montaje visual

Se conserva la identidad Takegrid, el visor y las cuatro tareas. Crear rig inicia una selección vacía; Personalizar copia una plantilla; Guardar rig conserva el plan en Mis rigs. No hay botones de exportación ni archivos necesarios para abrir un plan. El editor organiza el catálogo existente por categorías, muestra elegidos y pendientes con palabras además de color, y no instala accesorios sin una cadena de soporte documentada.

La biblioteca distingue borradores de rigs guardados y permite abrir, duplicar y eliminar con confirmación. El guardado local se explica sin presentarlo como cuenta o sincronización. Montaje filtra instrucciones y navegación, sin eliminar comprobaciones relevantes. Ofrece pausa, reinicio, ritmo y búsqueda de etapa; la extracción es opcional. La reproducción no desplaza automáticamente la página; navegar manualmente o elegir una ruta devuelve el visor al área visible. Las revisiones no se marcan automáticamente y pertenecen a la configuración revisada durante la sesión.

## Verificación

Las comprobaciones anteriores cubrían selección desde cero, guardado, recuperación, copia de plantilla, biblioteca y vistas acumulativas. No cubrían suficientemente el filtrado de los textos del montaje. La estabilización actual incorpora esas regresiones y separa su evidencia en `docs/stabilization-qa.md`: 29 pruebas, 300 selecciones y 300 guías reproducibles. No extrapolar los ensayos previos como medición de fluidez de esta versión.

Comprobado en el navegador local: cuatro tareas, búsqueda 4253B, estado vacío y recuperación, siete perfiles con piezas y subtotales coherentes, progreso aislado por perfil, doble HDMI con ocho enlaces, puertos A/B, despiece y recentrado. Pantallas 320x740, 390x844, 768x1024 y 1280x720 sin desbordamiento horizontal. En 390x844 no hay imágenes rotas ni botones visibles sin nombre. Consola de la pestaña nueva sin errores o advertencias de ejecución. TypeScript y validación de datos pasan; Vite avisa de un módulo 3D grande, cargado de forma diferida.

Estas comprobaciones son de software y presentación. No validan holguras, radio de curvatura, equilibrio ni seguridad eléctrica de un rig físico. Las revisiones de lectura duran la sesión; los rigs propios se guardan localmente. No hay cuentas ni sincronización entre equipos.
