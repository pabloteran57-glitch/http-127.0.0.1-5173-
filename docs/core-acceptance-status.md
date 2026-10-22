# Criterios del núcleo 0.2.20

Generado desde data/core-acceptance.json. Cierre de estabilización de software del núcleo, no liberación de beta profesional ni certificación física.

Estado: software_verified_publication_pending. Sin cambios de catálogo, plantillas o migración de biblioteca en esta etapa.

| Criterio | Estado |
| --- | --- |
| Selección exacta y estados claros | verified_software_only |
| Montaje filtrado y transporte de reproducción | verified_software_only |
| Guardar, recargar, historial y conflicto entre pestañas | verified_software_only |
| Perfiles locales y recuperación aislados | verified_software_only |
| Recuperación de visor sin perder el plan | verified_software_only |
| Editor directo, navegación y estados vacíos en móvil/escritorio | verified_software_only |
| Worker y fallo de almacenamiento tratados sin falso guardado | verified_software_only |
| Compilación, recursos auditados y publicación respaldada | publication_pending |

## Evidencia de software

- automated: passed. Nueva suite; además se ejecutan completas las regresiones previas. Sin usuarios ni hardware físicos.
- desktop: passed. Recorrido de interfaz registrado; no ensayo físico.
- mobile: passed. Emulación de viewport, no teléfono físico ni prueba GPU. El override del navegador integrado no cambió sus 1280 px: no se contó como prueba móvil.
- viewer-recovery: passed. No se provoca fallo real de GPU; laboratorio sólo en desarrollo.
- offline: passed. No se certifica operación en dispositivo físico sin red ni precarga GLB.

## Condiciones externas aún pendientes

- Ensayos de rigs físicos
- Mediciones en dispositivos físicos de referencia
- Cohorte observada y aceptación de usuarios
- Derechos de modelos exactos de terceros
- Privacidad, soporte, presupuesto y elegibilidad de financiación

Protocolo y resultados: [revisión de software](core-acceptance-0220.md). Publicación: [alojamiento](additional-hosting.md).
