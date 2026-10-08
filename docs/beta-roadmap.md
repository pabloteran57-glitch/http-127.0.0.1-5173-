# Takegrid: ruta a una beta utilizable

Revisión: 7 de octubre de 2026. Estado: endurecimiento del prototipo en curso. Fuente estructurada: `data/product-roadmap.json`. El catálogo tiene 33 entradas; tres altas del lote investigado están integradas para planificación FX30 a mano y horizontal. Las otras siete siguen en investigación. [Alcance vigente](pilot-integration.md).

Iteración 0.2.10: piloto FX30 en editor, biblioteca, conexiones nativas y guía propia de cinco etapas. Conserva los accesorios desde el visor, monitor sobre NATO sin imponer gimbal para las cadenas FX3 revisadas, ajustes y guardado de poses. No finaliza beta ni autoriza cadenas FX30 adicionales. [Verificación de integración](pilot-integration-qa.md) y [estado de publicación](additional-hosting.md).

Mi equipo, guía filtrada y controles de reproducción ya tienen correcciones funcionales comprobadas. Se prepararon laboratorio, reglas declarativas, recuperación e historial, recursos sin conexión, protocolo de beta y paquete preliminar de financiación. La evidencia actual está en `docs/iteration-qa.md`; la previa en `docs/stabilization-qa.md`. Preparar entregables posteriores no cierra sus criterios de salida. Cuentas y sincronización quedan aplazadas por decisión del usuario, no eliminadas del plan.

## Decisión recomendada

Optimizar primero el flujo completo de un rig propio. Después, preparar reglas extensibles y ampliar por lotes verificados. Es posible añadir productos ahora, pero no basta con sumar registros: cámara, lente, soportes, conexiones, geometría y guía deben formar una cadena coherente. La arquitectura admite reglas declarativas, pero un segundo conjunto real necesita sus propios datos y verificaciones.

No hace falta tener miles de referencias para demostrar valor a usuarios o inversores. Sí hace falta que una selección personal corresponda exactamente a su lista, sus conexiones, su guía y su recuperación después de guardar. La expansión no se cancela: se ordena para no multiplicar errores ni reducir fidelidad.

## Diagnóstico Histórico

- `PartsTable` inicia con el filtro de perfil desactivado. Bajo Tu equipo aparece el catálogo completo de 27 entradas.
- El filtro actual muestra sólo piezas activas. No distingue adecuadamente una pieza elegida pendiente de otra nunca elegida; ambas pueden aparecer como RESERVA.
- El visor del montaje filtra geometría, pero navegación y contenido mantienen las trece etapas maestras. Las comprobaciones y el desplegable pueden mencionar equipos no elegidos.
- La reproducción utiliza intervalos de 4.5 segundos sobre todas esas etapas. Un rig pequeño recorre muchas etapas que no cambian la escena.
- En la web pública se observó un perfil de ocho elecciones con cuatro piezas representadas, seis pendientes y trece etapas. No se cambiaron ni guardaron sus elecciones durante el diagnóstico.
- El rendimiento todavía no tiene una línea base reproducible. Los cambios de encuadre y las asignaciones por fotograma son candidatos de análisis, no una causa de lentitud demostrada.

Este diagnóstico describe la versión anterior a las correcciones, no el estado actual. Que compilen datos y visor no basta para declarar cerrada la experiencia de uso.

## Secuencia de avance

| Fase | Entregable principal | Condición para avanzar |
| --- | --- | --- |
| 1. Estabilización | Mi equipo separado del Catálogo, guía adaptada al rig y reproducción útil | Sin piezas ajenas, pasos vacíos, pérdida de elecciones ni bloqueos del flujo principal |
| 2. Ingeniería extensible | Interfaces, versiones y compatibilidades declarativas; alta de producto trazable | Incorporar un caso nuevo sin reprogramar la interfaz; lo desconocido permanece pendiente |
| 3. Catálogo piloto | Lote propuesto de 10-20 piezas y configuraciones nuevas completas | Fuentes, derechos, montaje, señal y potencia auditados; pruebas físicas identificadas |
| 4. Proyectos fiables | Recuperación, cuentas, sincronización, permisos y planes sin conexión | Guardado verificable, privacidad y conflictos sin sobrescritura silenciosa |
| 5. Beta cerrada | Uso observado con una cohorte propuesta de 10-15 profesionales | Objetivo propuesto de 90% de tareas principales sin ayuda; cero fallos críticos/altos del flujo |
| 6. Beta pública | Publicación versionada, soporte, métricas y mantenimiento | Una persona nueva prepara y recupera un rig sin una demostración del desarrollador |
| 7. Financiación | Demo real, evidencia, presentación, presupuesto e hitos de entrega | Alcance financiable concreto y elegibilidad verificada; ninguna promesa técnica ficticia |

Los números de productos, participantes y finalización son objetivos propuestos, no resultados obtenidos. La preparación financiera puede comenzar después de la beta cerrada; no implica abrir una campaña antes de demostrar un producto fiable. Las fases 3 y 4 pueden trabajarse en paralelo cuando su base esté probada, sin saltar sus controles de salida.

## Primera fase: alcance preciso

1. Separar **Mi equipo** y **Catálogo**. Mi equipo incluye todas las elecciones, con activos, pendientes y elementos sin geometría diferenciados. El editor sigue permitiendo descubrir y añadir productos.
2. Derivar una secuencia de montaje aplicable al perfil. Conservar las trece etapas canónicas como referencias, pero no obligar a reproducir todas en un rig personalizado. Mantener las comprobaciones relevantes aunque una etapa no añada geometría.
3. Condicionar instrucciones y fuentes a las piezas reales. Un pendiente puede explicarse, pero nunca representarse como instalado ni activar una conexión imposible.
4. Añadir inicio/reinicio, pausa, anterior/siguiente y velocidad de reproducción. Evitar encuadres que cambien abruptamente al aparecer el gimbal y evitar que la reproducción avance antes de que la escena esté disponible.
5. Medir antes de optimizar: tiempo de respuesta de selección, tiempo hasta escena útil, pausas por transición y fotogramas durante órbita/reproducción. Registrar navegador, dispositivo, tamaño del rig y estado de carga. Fijar objetivos con esa línea base, sin prometer FPS todavía.
6. Probar recorridos completos: vacío, tres piezas, gimbal ligero, rig completo, accesorios pendientes y variantes vertical/a mano. Incluir quitar un soporte durante edición, volver al rig, guardar, recargar y cambiar de perfil. Comprobar que cada escena, lista, texto y extremo de cable corresponde a la selección.

## Bucle de autocorrección

**Reproducir -> fijar criterio -> corregir una causa -> probar regresiones -> medir escritorio/móvil -> comparar -> publicar.**

Cada incidencia conserva caso reproducible, causa confirmada o hipótesis, cambio, evidencia y resultado. No se cierra por una captura bonita ni por haber pasado compilación. Una regresión reabre el caso. El ciclo continúa por incidencia hasta satisfacer su criterio de salida; no es un proceso infinito ejecutándose sin supervisión.

Los borradores del usuario no son datos desechables de prueba. No se modifican, guardan ni recargan durante el diagnóstico. Los ensayos que cambien piezas utilizan perfiles separados.

## Regla de ampliación de catálogo

Cada alta sigue este orden: **manifiesto -> distribución física -> cables/alimentación -> guía -> representación -> variantes**. Fuente oficial primero; B&H para confirmación secundaria. Verificar revisión/modelo, cotas, masa, interfaces, soporte, regulación, restricciones y derechos. No utilizar coincidencia de marca como prueba de compatibilidad.

Separar cobertura de catálogo, cobertura de geometría y validación física. Un producto investigado puede existir como ficha pendiente sin convertirse en un montaje utilizable. Una envolvente aproximada no certifica roscas, eje de giro ni holguras. No importar fotografías ni CAD a producción sin permisos y escala/revisión verificadas.

## Qué significa beta utilizable

Crear desde cero, detectar pendientes, comprobar rutas reales, guardar, recuperar y recorrer el montaje deben funcionar sin ayuda. Deben probarse pérdida de conexión, conflicto, cambios de versión, teclado/móvil y fallo de WebGL. Las fuentes y aproximaciones deben seguir disponibles sin bloquear la tarea principal.

La beta necesita evidencia de utilidad recurrente, no sólo registros o intención de uso. Medir preparación de rig, errores encontrados, retorno, finalización y disposición a pagar; reclutar 1AC y solo filmmakers reales. No fabricar métricas de mercado ni ingresos.

El objetivo es una guía interactiva profesional que reduzca la dependencia de tutoriales dispersos. No anunciar sustitución universal de manuales ni seguridad certificada; la comprobación física sigue siendo necesaria y cada ecosistema tiene un alcance explícito.

## Financiación

Preparar por separado la propuesta a inversores y una campaña por recompensas. Kickstarter admite proyectos de apps con prototipo demostrable y exige presentación honesta, derechos de recursos y transparencia sobre uso de IA. No permite ofrecer participación accionaria. [Reglas oficiales](https://www.kickstarter.com/rules?country=82).

La elegibilidad del creador o entidad debe comprobarse antes de elegir plataforma. Si el lanzamiento se realiza desde Ecuador, no figura actualmente como país habilitado para creadores; no asumir que basta con elegir otra ubicación en la página. [Requisitos oficiales](https://help.kickstarter.com/en-us/articles/16236650-who-can-use-kickstarter).

La presentación debe mostrar software funcionando, alcance actual, problema observado, diferenciación, evidencia de usuarios y los hitos que financiaría. [Modelo de financiación por recompensas](https://updates.kickstarter.com/how-crowdfunding-works-a-guide-for-creators/).

El presupuesto requiere cotizar desarrollo, investigación, derechos, validación física, infraestructura, soporte, campaña y contingencia. No fijar una meta monetaria ni prometer acceso de por vida sin conocer costes de mantenimiento. Las alternativas de plataforma y los requisitos legales/fiscales se revisan según país, entidad y modelo de financiación, con asesoramiento profesional cuando corresponda.

No se promete éxito en una campaña. No se comprometen fechas de beta hasta medir la primera fase y definir capacidad del equipo.

## Avance actual

El diagnóstico anterior es histórico. Las versiones 0.2.0–0.2.6 corrigieron inventario, guía, selección móvil directa, monitor y audio, y añadieron recuperación y perfiles locales. La iteración 0.2.7 desacopla contexto, soportes, encuadre, completado y referencias de guía; quince pruebas de ecosistema sintético se suman a las regresiones anteriores. Tres manifiestos piloto tienen revisión parcial por campo, sin activarse. [Estado actual](extensible-engineering-qa.md). La aceptación observada y las puertas físicas permanecen abiertas; no se declara beta aprobada ni se elimina la nube aplazada del plan.
