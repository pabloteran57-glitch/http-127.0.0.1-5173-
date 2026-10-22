# Diagnóstico de anclajes

Generado desde planner-rules.mount_resources y data/anchor-diagnostics-review.json. Revisión 2026-10-16. Diagnóstico de cadenas existentes, sin altas de productos o capacidades de carga nuevas.

## Orden Técnico

1. **manifest**: Se conservan las 36 entradas, modelos, masas y fuentes canónicas. La revisión de 3011 y TA-15RH-NATO-B no autoriza altas: siguen pendientes parejas, retención o masa y cotas netas inequívocas.
2. **layout**: Cinco recursos describen sólo cadenas existentes en planner-rules.mount_resources. No contienen coordenadas nuevas. La ocupación se deriva del padre contextual y de las piezas elegidas y activas.
3. **cables_power**: Se conservan los 22 circuitos. El diagnóstico no crea puertos, fuentes, conectores o recorridos. Los extremos de un circuito siguen requiriendo piezas activas.
4. **assembly**: Se conserva la guía por selección y el orden de montaje. El diagnóstico no presenta piezas pendientes como instaladas ni habilita pasos ajenos.
5. **viewer**: Ficha y selector de accesorios distinguen anclajes sin uso en el plan, ocupados, pendientes, en conflicto o no disponibles; las opciones explican su bloqueo sin añadir piezas.
6. **variants**: Siete plantillas conservadas; sin migración de biblioteca, cambios implícitos o nuevas compatibilidades. Pruebas con ecosistema remapeado y 2048 subselecciones.

## Anclajes Descritos

- **NATO superior de la jaula**, sobre Jaula HawkLock: Riel NATO desmontable. Asiento conservador del plan, no longitud útil medida del riel. Con XLR-H1 se retira; no se representa como anclaje disponible.
- **Zapata inclinada de la jaula**, sobre Jaula HawkLock: Zapata sin contactos. Se representa sólo el RX de Mic 2. Con asa 4152, el 2905B sigue la zapata frontal del asa, no ésta. Retención y despejes reales pendientes.
- **Zapata frontal del asa**, sobre SmallRig 4152 · asa NATO: Zapata sin contactos. Sólo la zapata superior frontal de la cadena candidata actual. No ofrece las dos zapatas posteriores ni giro libre del asa.
- **NATO de la extensión XLR**, sobre Extensión y riel XLR 4830: Riel NATO de 4830. Cadena alternativa sobre XLR-H1, no sobre el NATO superior retirado de la jaula. Encaje y despejes pendientes.
- **Monitor lateral fijo**, sobre RS 4 Pro: Anclaje lateral de la cadena 3026B. Monitor fuera del núcleo móvil. El estado del plan no prueba acceso a manos, recorrido de ejes o seguridad dinámica.
- **Localización lateral 1/4-20**, sobre Jaula HawkLock: Rosca 1/4-20 y orificios de localización. Sólo la pose candidata 4346. No es NATO, ARRI 3/8 ni patrón dimensional verificado; retención, mano y puertos por comprobar.
- **Fijación inferior para placa 2896C**, sobre Jaula HawkLock: Rosca inferior 1/4-20 y tornillo de placa incluido. Asiento candidato único del plan. Profundidad y resistencia antitorsión no medidas. No receptor Arca ni doble tornillo 3/8 añadido al 1/4.
- **Fijación inferior para placa AD-01**, sobre Jaula HawkLock: Rosca inferior 1/4-20 y tornillo incluido. Sólo la cadena 3751B acotada. No receptor Arca/HawkLock ni doble fijación; profundidad, antitorsión y retención pendientes.

## Límites

- Ocupación del plan, no comprobación de carga, antirrotación, longitud de tornillo o holguras.
- Las condiciones y exclusividad siguen en las reglas; este diagnóstico no introduce una segunda política de compatibilidad.
- La descripción de un anclaje no autoriza adaptadores ni nuevas revisiones de producto por analogía.
- Aceptación con usuarios, teléfonos y rigs físicos sigue pendiente. Cuentas y nube aplazadas.

Ensayo físico: pendiente. Ninguna observación se infiere de una compilación. [Verificación de interfaz](anchor-diagnostics-qa.md).
