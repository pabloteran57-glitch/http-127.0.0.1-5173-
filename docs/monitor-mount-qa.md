# Revisión de montaje de monitor, versión 0.2.6

Fecha: 7 de octubre de 2026. Esta revisión cierra defectos de selección, representación y recorrido de montaje en software; no certifica un rig físico ni libera la beta. La versión 0.2.6 fue confirmada como publicada por el proveedor en el enlace habitual; evidencia en [publicación adicional](additional-hosting.md).

## Datos y Cadenas Candidatas

| Contexto | Soporte elegido explícitamente | Alimentación del Indie 7 |
| --- | --- | --- |
| Gimbal activo | Puerto NATO lateral del RS 4 Pro → SmallRig 3026B → monitor fuera de cámara | V-mount y cable existentes, o Sony NP-F970/PRO sobre placa L incluida |
| Cámara sin asa XLR y sin gimbal | Riel superior desmontable de la jaula 4770 → SmallRig 2906B → monitor | Las mismas dos alternativas; no se añaden ambas automáticamente |
| Cámara con XLR-H1 y sin gimbal | Retirar riel superior desmontable 4770; XLR-H1 → kit 4830 → 2906B → monitor | Las mismas dos alternativas |

Las tres rutas tienen reglas, masas, envolventes y trazados derivados del contexto elegido. Son soluciones candidatas documentadas, no ensayos de ajuste dinámico. Un cambio de pose no inventa otro puerto ni otro cable. La orientación vertical sin gimbal no tiene aquí un soporte mecánico documentado.

Fuentes primarias incorporadas al manifiesto: [manual 2906B](https://static.smallrig.com/mall/img/public/0g141qmktenu-1751249917074_.pdf), [manual 4770/4830](https://static.smallrig.com/mall/img/public/1725874097334_.pdf), [Sony NP-F970/PRO](https://www.sony.jp/products/catalog/SPC_NP-F970_PRO.pdf) y [SmallHD Indie 7](https://smallhd.com/products/indie-7). La placa 4830 no se presume incluida en el kit 4770. Las cargas publicadas del 2906B dependen del ángulo y no certifican seguridad dinámica.

La especificación independiente de entrada del Indie 7 identifica exterior 5.5 mm, interior 2.0 mm y centro positivo. Esto no completa el diámetro interior ni demuestra el ajuste físico del cable CBL-PWR-DTAP-BAR-36. La batería Sony seleccionada es NP-F970/PRO, aproximadamente 300 g y 7.2 V nominales, no una NP-F genérica de masa menor. Su intervalo operativo completo, consumo, cargador y retención real requieren comprobación.

## Evidencia de Software

- Validación canónica, sincronización de documentación, TypeScript y `npm run build:public`: completados sin errores.
- 179 pruebas automatizadas: 72 del planificador, 27 de conexiones, 7 de uso sin conexión, 17 de perfiles, 20 del contrato de modelos, 19 de carga de modelos, 11 de reconstrucciones y 6 de miniaturas. Las pruebas del planificador incluyen 300 selecciones y 300 guías generadas; no equivalen a 300 rigs físicos.
- Siete plantillas conservadas: ninguna selección canónica se modificó silenciosamente. Los rigs propios permiten completar el monitor mediante un botón que enumera antes las piezas faltantes.
- Compilación pública: 50 archivos, 5 311 215 bytes sin comprimir. Diecisiete GLB originales aproximados y diecisiete miniaturas propias; sin fotografías del fabricante, PDF privado, bibliotecas personales ni CAD no autorizado.
- Hashes, escala visual declarada y decodificación de los recursos propios comprobados; las hojas de revisión de los modelos y miniaturas se inspeccionaron visualmente.
- Auditoría npm: cero vulnerabilidades de producción. Siete avisos en herramientas de desarrollo, relacionados con dependencias de Tailwind 3, siguen pendientes; no se aplicó una actualización mayor de Tailwind sin pruebas de regresión.

## Recorridos de Interfaz Comprobados

Pruebas manuales con navegador Edge en orígenes locales, usando perfiles QA nuevos y sin reemplazar la biblioteca inicial:

| Recorrido | Resultado observado |
| --- | --- |
| Rig a mano desde selección propia, con FX3, 4770, XLR-H1, Mic 2 y monitor | `Completar monitor (4)` añadió, tras pulsación expresa, 2906B, 4830, HDMI y NP-F970/PRO; diez elecciones conservadas |
| Rig vertical con gimbal, Mic 2 y monitor, viewport 390 × 844 | `Completar monitor (3)` añadió 3026B, HDMI y NP-F970/PRO; diez elecciones conservadas, sin V-mount implícita |
| Montaje a mano y vertical a velocidad 2× | Sólo etapas relevantes; llegó a comprobaciones finales, detuvo reproducción y no ejecutó automáticamente extracción |
| Recarga del rig vertical guardado | Perfil y diez elecciones recuperados |
| Compilación pública local: personalizar plantilla a mano y añadir Indie 7 | Doce elecciones guardadas y recuperadas después de recarga; nueve objetos montados, cuatro conexiones, cero modelos fallidos y cero errores de consola observados |

Los tres elementos sin objeto del último caso son micrófono de solapa, aplicación y cable; continúan en la selección. Las posiciones de terminales y curvas son ilustrativas, no trayectorias mecánicas verificadas. El autoencuadre incluye las envolventes del monitor y mantiene una referencia estable durante el montaje.

Capturas y notas privadas de las pruebas quedan en `research/model-incoming/` y `research/private/`. La reunión aportada en PDF se revisó como evidencia cualitativa; no se publicó ni se contó como una cohorte formal de beta. No se midieron tiempos de GPU ni batería, y esta prueba de viewport no es una prueba en un teléfono físico.

## Qué Falta para Ampliar y para Beta

| Fase acordada | Estado y siguiente condición |
| --- | --- |
| 1. Núcleo | Correcciones de software comprobadas y publicación confirmada; registrar cualquier regresión real, fluidez en dispositivos y comprobaciones físicas |
| 2. Preparar expansión | Contrato de catálogo y tres cadenas añadidos; revisar semántica de montajes y límites antes de activar otra familia de cámara |
| 3. Catálogo | Tres accesorios incorporados de forma dirigida; diez candidatos del lote piloto siguen en cuarentena hasta verificar modelo exacto, montajes, alimentación, señal y derechos |
| 4. Proyectos | Perfiles y recuperación locales probados; cuentas y nube aplazadas por decisión del usuario, no simuladas |
| 5. Beta cerrada | Cero participantes formales registrados de un mínimo propuesto de diez; no existe todavía una tasa de éxito observada |
| 6. Beta pública | Herramientas y documentación preparadas; falta evidencia de usuarios, dispositivos, soporte y recuperación operativa |
| 7. Financiación | Alcance preparado; faltan evidencia de uso, costes reales y elegibilidad jurídica de la plataforma |

No es necesario esperar a financiación o App Store para investigar más productos. Su activación será por lotes y conservará el orden manifiesto → distribución → conexiones → guía → visor → variantes. No hay una fecha fiable para la beta completa mientras falten ensayos físicos y usuarios reales. Un modelo detallado propio no sustituye un archivo exacto del fabricante o una descarga comunitaria autorizada.
