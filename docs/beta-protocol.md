# Protocolo de beta cerrada

Autoridad: `data/beta-protocol.json`; observaciones reales en `data/beta-evidence.json`. Estado: preparado, no ejecutado. Cero participantes reclutados y cero ensayos físicos registrados, no una tasa de éxito de 0% ni una prueba de ausencia de errores.

## Sesión

1. Consentimiento y alias; no registrar datos de clientes o rodajes confidenciales. Aclarar límites del catálogo y geometría.
2. Registrar versión, dispositivo, navegador, viewport y rol. Usar perfiles de prueba, no planes del usuario.
3. Ejecutar las seis tareas del protocolo sin demostración previa; registrar tiempo, ayuda, errores y finalización.
4. Comparar selección, inventario, textos, conexiones y recuperación. No interpretar casillas de lectura como ensayos físicos.
5. Preguntar por utilidad recurrente y disposición a pagar sin convertir intención en ingresos. Observar retorno sólo si realmente ocurre.
6. Registrar incidencia con reproducción, gravedad, causa/hipótesis, evidencia y versión corregida. Repetir la tarea tras la corrección.

Objetivos propuestos: 10–15 participantes y 90% de tareas válidas sin ayuda. Mostrar numerador y denominador; no extrapolar cuotas de mercado. Criterios de liberación en datos, no cambiarlos para acomodar resultados deficientes.

## Rendimiento y accesibilidad

Laboratorio en `/?laboratorio=1`: tres repeticiones por prueba, misma escena, dispositivo y viewport. Reposo/giro de vista y demanda/continuo son controles de esta versión, no una comparación contra una versión anterior. Intervalos de callbacks de render, no fotogramas de GPU. Excluir interrupciones; fijar objetivos tras recoger referencia física.

Revisar teclado, foco/modal, 320/390 px y escritorio, contraste, lectura de estados, pausas al ocultar y comportamiento sin WebGL. La preparación sin conexión requiere un ensayo real de red desconectada y reapertura; la simulación del worker en pruebas no lo sustituye.

## Ensayo físico

Seguir los ocho controles de `physical_protocol` con equipo identificado, báscula/calibre y técnicos competentes. Registrar revisión, herramientas, masas medidas, fijaciones, cables, señal, alimentación, barrido de ejes y manos. Adjuntar fotos propias autorizadas, fecha y limitaciones. No obtener un resultado aprobado a partir de una captura 3D.

`npm run check:beta` muestra las carencias. `node scripts/check-beta-readiness.mjs --strict` impide declarar listo el conjunto mientras falte evidencia. No es una certificación legal ni mecánica.
