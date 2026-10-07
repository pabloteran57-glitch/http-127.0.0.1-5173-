# Base de ingeniería extensible

Las comprobaciones de selección y exclusiones de circuitos se leen de `data/planner-rules.json`; ya no hay casos de vídeo, batería o audio codificados por modelo dentro de `resolveRig`. Se conservan las cadenas conservadoras, las cuatro tareas y todas las elecciones originales.

## Contrato de alta

1. Manifiesto: identidad, revisión exacta, fuente por campo, cotas, masa e incertidumbre.
2. Distribución: soporte trazable, orientación y envolvente; no heredar orificios o poses de otra revisión.
3. Conexiones: identidad de puertos, capacidad de señal, alimentación y límites.
4. Guía: instrucciones condicionadas al equipo realmente elegido.
5. Visor: geometría atribuida con escala y derechos, siempre etiquetada si es aproximada.
6. Variantes: configuraciones completas y regresiones de selección y montaje.

`data/catalog-contract.json` es un índice derivado, no un segundo catálogo. Vincula identidad canónica, revisión del registro, guía y geometría por separado. `data/catalog-intake.json` es una cola de investigación, nunca una lista de piezas instalables.

## Compatibilidad

`compatibilityDecision` sólo admite un candidato documentado si hay revisión y URL HTTPS de evidencia. Incompatible queda bloqueado; desconocido o incompleto sigue desconocido. Este control de integridad no autentica el contenido de una URL: la revisión humana/técnica de la evidencia continúa siendo obligatoria. Candidato no significa probado físicamente.

El panel Conexiones usa `assessConnection`, no ese control básico. Vincula modelo y nombre exactos, revisión, puerto, conector, señal y fuentes con alcance explícito. Compara rangos completos y polaridad; información ausente mantiene pendientes. Cuatro de dieciocho circuitos tienen revisión ampliada: control RS 4 Pro/FX3, 4253B y dos alimentaciones del Indie 7. No certifica los demás catorce ni valida automáticamente el contenido web. [Evidencia por comprobación](connection-reviews.md).

## Extensibilidad Comprobada

`planning_root_part_ids` declara raíces; todo accesorio necesita cadena o reserva explícita. Los ciclos, raíces desconocidas y soportes contextuales contradictorios permanecen pendientes. `exclusive_selection_groups` conserva dos cuerpos u ópticas elegidos sin representarlos instalados simultáneamente.

Contexto y ruta de plantilla, reglas de completado explícito y etapa de extracción proceden de datos. `vertical_frame` identifica nodos que giran con cámara; `visual_subassemblies` controla visibilidad de subensambles. La guía toma sus manuales de referencias condicionadas, no de nombres de producto en JSX.

Quince regresiones remapean todos los IDs de partes, puertos y cables y recorren selección, poses, masa aproximada, instrucciones, reproducción y extracción. No incorporan productos sintéticos al catálogo. Un futuro equipo sin malla autorizada usa una envolvente etiquetada, nunca la forma de FX3 o de otra pieza. Las 17 reconstrucciones actuales se conservan.

Esto prueba extensibilidad de software, no compatibilidad universal. Un alta real exige su propio manifiesto, distribución, señales, guía, geometría y variantes; no se heredan coordenadas por compartir marca, montura o dimensiones. [Regresiones y límites](extensible-engineering-qa.md).

## Migración

La biblioteca histórica v1 se lee sin perder, añadir ni reordenar piezas. En el siguiente guardado explícito se escribe envolvente v2 con revisión de catálogo; el documento de rig sigue siendo v1. Una revisión desconocida o un ID retirado se rechaza sin borrar almacenamiento. No se migra silenciosamente una pieza a un modelo parecido.
