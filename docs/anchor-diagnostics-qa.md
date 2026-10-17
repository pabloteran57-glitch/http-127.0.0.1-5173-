# Verificación de diagnóstico 0.2.15

16 de octubre de 2026. Bloque de estabilización y base extensible; no alta de piezas ni aprobación física.

## Ciclo Ejecutado

1. Línea base: versión 0.2.14 con 388 casos CORRECTO, 36 entradas, 23 mallas propias, 22 circuitos y siete plantillas. Se ejecutó la validación antes de editar.
2. Se escribió una prueba que falló por ausencia de diagnóstico de anclajes. Se implementaron datos, cálculo puro y presentación en ese orden.
3. Cinco recursos de cadenas existentes, con fuentes oficiales y sin coordenadas nuevas. La exclusividad permanece en las reglas; ocupación deriva del padre contextual y de piezas elegidas/activas.
4. Selector de accesorios con estados listo, elegido y bloqueado. Las adiciones siguen requiriendo confirmación y sólo se ofrecen cuando la propuesta completa tiene una cadena activa.
5. La prueba móvil encontró un RX repetido como bloqueado aunque la ruta equivalente ya estaba activa. Se eliminó únicamente el aviso redundante de presentación; diagnóstico completo y otras rutas bloqueadas permanecen trazables.
6. Se revisó también el desplazamiento del diálogo móvil: fondo bloqueado mientras se abre y barra de desplazamiento de contenido acorde a la interfaz existente.

## Regresiones

403 casos CORRECTO en `npm run validate`, incluidos 15 de diagnóstico y 2048 subselecciones nuevas. La misma familia de 2048 selecciones ya tiene pruebas independientes de integración de montaje; no son 4096 rigs distintos ni usuarios observados.

Se probaron: ancla no elegida, recurso sin uso en el plan, zapata compartida, traslado contextual al asa, riel retirado con XLR, accesorio fuera de contexto, opciones completas o bloqueadas, fuentes ausentes, ancla pendiente, conservación de elecciones y rechazo de adiciones implícitas. Ecosistema remapeado comprueba ausencia de IDs físicos codificados en el cálculo. El diagnóstico no modifica selección, catálogo, masa, puertos, guía ni geometría.

`npm run build:public`, TypeScript, validación y compilación pública final correctos. 62 archivos propios dentro del presupuesto de 7,5 MB. No hay fotos/manuales de fabricantes, notas privadas, capturas de QA ni credenciales en el paquete. Permanecen advertencias de tamaño de módulos; no se anuncia mejora de FPS.

## Interfaz Local

Compilación pública en `http://127.0.0.1:4173/`, navegador integrado. Perfil aislado `QA anclajes 0.2.15`; los cuatro planes del perfil inicial no se editaron.

- Rig FX3 con SEL35F18F, NP-FZ100, 4770, 2905B y RX: conflicto de zapata mostrado con ambas elecciones conservadas.
- Añadir explícitamente 4152: NATO ocupado por asa, zapata inclinada ocupada por RX y frontal del asa por 2905B; no recolocación implícita de elecciones.
- Añadir monitor desde asa: sólo Indie 7, HDMI y NP-F970/PRO pendientes de elegir. Diez piezas guardadas y recuperadas tras recargar.
- Escritorio y viewport 390 x 844: apertura de anclajes con teclado, motivos de bloqueo desplegables y ruta ya elegida sin RX duplicado. Sin botón de añadir en opciones bloqueadas.
- Consola sin entradas de error capturadas tras la recarga final. No demuestra ausencia universal de fallos.

La primera apertura de la vista local quedó vacía por aislamiento de red del servidor; se reinició el servidor local con acceso autorizado y se comprobó HTTP 200 antes de realizar QA. No se cambió la app para ocultar el problema de infraestructura.

Capturas locales bajo `research/model-incoming/qa-0215`, excluidas de publicación y respaldo de código. No son pruebas en teléfono físico.

## Alcance Pendiente

«Sin uso» y «ocupado» son estados del plan, no pruebas de asiento, antirrotación, carga, manos o colisión. 3011 sigue pendiente de cadena exacta y revisión de retención; TA-15RH-NATO-B conserva ambigüedad de masa y dimensiones publicadas. No se promovieron por compartir rosca, NATO o diámetro. El catálogo permanece en 36 entradas.

Fases 1 y 2 siguen abiertas para mediciones y aceptación reales. Después se continúa el lote de montaje SmallRig/Tilta con las mismas puertas de verificación. Los 26 candidatos, seis ópticas restantes, ensayos físicos, participantes, privacidad, soporte y financiación no se dan por completados. Cuentas y nube siguen aplazadas.

## Publicación

0.2.15 confirmada por Sites con estado `succeeded` el 2026-10-17T03:11:49.296640+00:00, 16 de octubre en Ecuador. Código `56afcbad12fea2260fcc0a4b8077a8326ef7c415`, copia estática `49a59b74ad23b979747379cba132ad0519eb454f`. [Registro](additional-hosting.md). La confirmación de alojamiento no se confunde con prueba física ni navegación de producción.
