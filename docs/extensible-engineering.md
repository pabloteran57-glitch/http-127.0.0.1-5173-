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

Las pruebas incluyen un producto sintético, aislado del catálogo, que resuelve selección y dependencias cambiando sólo reglas. No prueba geometría ni guía universal. Los modelos de visor, encuadre, contextos de plantilla y etapas aún son específicos del ecosistema actual; no se anuncia compatibilidad universal.

## Migración

La biblioteca histórica v1 se lee sin perder, añadir ni reordenar piezas. En el siguiente guardado explícito se escribe envolvente v2 con revisión de catálogo; el documento de rig sigue siendo v1. Una revisión desconocida o un ID retirado se rechaza sin borrar almacenamiento. No se migra silenciosamente una pieza a un modelo parecido.
