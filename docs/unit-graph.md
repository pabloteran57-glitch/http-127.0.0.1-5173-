# Conexiones y anclajes por unidad

Bloque 0.2.17. Continúa el plan por fases sobre las cadenas existentes. No incorpora productos, posiciones, conectores o capacidades nuevas. Datos de política: `data/unit-graph-policy.json`.

## Implementado

- Recurso de montaje identificado por unidad anfitriona y recurso canónico, con ocupantes concretos. Repuestos fuera de la asignación.
- Extremos A/B asociados a unidad y puerto del modelo exacto. La ficha de conexión muestra sus etiquetas y la referencia elegida del cable/accesorio.
- Conserva contactos internos y la atribución de cables incluidos en kits; no inventa otro producto físico para cada cable de un kit.
- Doble reclamo del mismo conector o de una unidad de cable independiente bloquea los enlaces, sin splitter ni reemplazo automático.
- Visor, ficha y etapas identifican la unidad; las mallas y los recorridos siguen siendo aproximados.
- Revisión de lectura reiniciada al cambiar identidad activa, selección, ruta, contexto, encuadre o ajustes. No al cambiar etiqueta, fecha de guardado o añadir repuestos. Volver a una configuración anterior no restaura sus casillas antiguas.
- Sin migración adicional: biblioteca v3, esquema de rig 2, historial y perfiles de 0.2.16 permanecen. Las asignaciones se derivan del plan vigente, no se anuncian como mediciones guardadas.

Sólo una unidad por SKU participa en las cadenas actuales. Montaje simultáneo duplicado sigue pendiente de asientos alternativos, poses, ajustes y conexiones independientes documentados. Una dependencia del plan sin recurso de montaje concreto no se presenta como tornillo o junta física inventada.

## Orden y pruebas

1. Manifiestos: mismas 36 piezas, 22 circuitos, 23 mallas y siete plantillas.
2. Distribución: proyectar recursos y dependencias canónicos hacia identidades, sin cambiar coordenadas.
3. Cables: verificar propietario de puerto, unidad activa y ausencia de reclamaciones dobles.
4. Guía: invalidar lectura tras sustitución o cambio de pose; repuestos no añaden etapas.
5. Interfaz: etiquetas de unidad en ficha, anclajes, extremos A/B, visor y etapas.
6. Variantes: conservar originales y validar FX30/vertical con sus puertos y rutas propias.

`scripts/test-unit-graph.mjs`: 18 pruebas, incluidas 1000 subselecciones deterministas. Comprueban propiedad de conectores, repuestos, intercambio de monitor/cable/anfitrión, retirada de soporte, batería por contactos, capacidades desconocidas y siete plantillas. No son 1000 rigs físicos ni aceptación de usuarios.

Revisión local: perfil separado «QA conexiones 0.2.17», nueve productos destinados al rig y un monitor de repuesto. HDMI muestra «Monitor A» y «HDMI principal»; al intercambiar a B cambia la identidad de extremo y la lectura de montaje pasa de 1 a 0. Revisar B y volver a A también da 0; renombrar A y guardar conserva la revisión de lectura. Tras recarga recupera «Monitor principal» y el mismo identificador de unidad. Ventana móvil 390 ×844 sin desbordamiento horizontal y sin errores de consola observados. Evidencia privada en `research/model-incoming/qa-0217/`. No es teléfono o rig físico.

Compilación pública completa superada al repetir fuera del entorno restringido: el primer proceso Node sufrió un cierre nativo de V8, no una aserción de la app. La prueba afectada también pasó aislada. TypeScript, recompilación final y auditoría pública correctos tras integrar la lista de preparación. Se conservan ambos registros locales; no se oculta el primer cierre ni se interpreta como medición de rendimiento.

## Siguiente lote

[Agarres y hombro](support-intake.md): seis fichas con fuentes separadas. 4346 y 2896C tienen altas candidatas separadas en [0.2.18](support-integration.md); cuatro siguen en investigación. [Cobertura](setup-coverage.md) exige doce familias. El nuevo hombro tiene alcance y guía propios, sin brazo de gimbal o varillas cortas heredados.

Publicación 0.2.17 confirmada `succeeded` el 17 de octubre de 2026 a las 22:28 de Ecuador en el [mismo enlace Takegrid](https://takegrid-rigs.pabloteran57.chatgpt.site). [Revisiones y huellas](additional-hosting.md).

La comprobación beta mantiene pendientes: participantes observados (0 de mínimo propuesto 10), tasa de tareas aún no calculable, dispositivos de referencia, ensayos físicos, revisión de privacidad, soporte y presupuesto/elegibilidad de financiación. Además siguen sin implementar los nuevos montajes de sidehandles/hombro, duplicados simultáneos y expansión restante. No se declara terminado el plan completo por esta publicación.
