# FX3: bateria nativa y eleccion de fuente

Revision: 7 de octubre de 2026. Iteracion 0.2.11, fase 3 del plan. Ampliacion de una relacion del catalogo existente; no alta de otro producto ni validacion fisica.

## Orden Tecnico

1. Manifiesto: NP-FZ100 documentada para FX3 en [especificaciones Sony](https://helpguide.sony.net/ilc/2210/v1/en/contents/TP1000886922.html). Mantiene 83 g aproximados y cotas de la ficha propia de bateria. Cuerpo solo 630 g; subtotal cuerpo+bateria 713 g, sin tarjeta. No sumar bateria a los 715 g que Sony publica incluyendo bateria y tarjeta.
2. Distribucion: padre visual FX3 mediante perfil declarativo, bateria interna y pose aproximada. La pose FX30 permanece independiente. No hay coordenadas de asiento ni trayectoria de insercion verificadas.
3. Energia: `pwr-npfz100-to-fx3-contacts`, puertos propios y sin curva externa. Pareja documentada de 7.2 V nominales; no pinout ni rango completo inferidos. Revision exacta en `connection-reviews.json`, separada de FX30 y 4253B.
4. Guia: bateria elegida aparece en el nucleo de FX3 y su conexion por contactos. [Guia Sony, pagina impresa 82](https://helpguide.sony.net/ilc/2210/v1/en/print.pdf): retencion, cubierta y precauciones. Acceso, ventilacion y retencion con jaula real pendientes.
5. Interfaz: tarjeta identifica FX3 y piloto FX30; conflictos conservan elecciones como pendientes. No ofrece soportes para resolver un conflicto excluyente. La V-mount destinada a monitor no impone adaptador de camara cuando se eligio bateria nativa.
6. Variantes: siete plantillas intactas, sin bateria implicita. Extraccion conserva la bateria solo si ya estaba elegida; nunca sustituye 4253B automaticamente. Revision de biblioteca sin migracion destructiva.

## Evidencia de Software

- `npm run build:public`: correcto; datos, TypeScript, 302 comprobaciones y paquete publico permitidos.
- 170 comprobaciones del planificador, conexiones, ajustes, perfiles y uso sin conexion; 58 de modelos/miniaturas; 74 del catalogo. Adicionalmente, 300 selecciones y 300 guias reproducibles.
- `scripts/test-native-camera-power.mjs`: 17 casos; contextos, orientaciones, fuentes excluyentes, energia de monitor independiente, anclas, masa, contactos, guia, extraccion y bibliotecas.
- Modelos propios aproximados: 20; sin cambio de huellas ni fotos de fabricante redistribuidas. Persisten advertencias de paquetes JavaScript superiores a 500 kB; no se declara mejora de GPU.
- `check:catalog --strict` y `check:beta --strict` siguen rechazando aprobacion por pruebas fisicas, usuarios y otros criterios externos pendientes. El rechazo esperado no se oculta como exito.

## Recorrido Observado

Navegador Edge, entorno de pruebas local del paquete publico, no biblioteca del origen publico del usuario.

- Crear desde cero y elegir FX3, 16-35 mm GM, 4770 y NP-FZ100: cuatro elecciones exactas. Guardar un plan de QA independiente y recorrer las tres etapas pertinentes.
- Reproduccion 2x termina en revision final con reinicio disponible. Bateria visible solo al pedir despiece; conjunto ensamblado la conserva dentro del cuerpo.
- Ventana de 390 x 844: anadir 4253B conserva cinco elecciones y deja ambas fuentes pendientes. Guardar y recargar recupera las cinco. No ofrece agregar soportes al adaptador en conflicto.
- Quitar explicitamente 4253B recupera fuente nativa; Conexiones muestra un contacto NP-FZ100 -> FX3, sin cable externo y con comprobacion fisica pendiente.
- Botones, textos y ancho DOM comprobados en ventana movil, sin desbordamiento horizontal observado. No es un ensayo de telefono fisico ni de tacto, bateria o GPU. Captura de la ventana movil no utilizable por escalado de captura; no se usa como evidencia visual.
- Captura de escritorio revisada: `research/model-incoming/qa-0211/desktop-bateria-fx3.png`, privada y fuera de publicacion. Consola observada sin errores/advertencias de la app durante el recorrido.

## Plan Restante

Este bloque no cierra las siete fases. [Plan vigente](beta-roadmap.md), [avance generado](product-progress.md) y [piloto FX30](pilot-integration-qa.md).

Siguiente: verificar cadenas de monitor y audio del piloto FX30 antes de activarlas; despues, otros siete candidatos y configuraciones completas. Siguen pendientes dispositivos fisicos, ensayos de rigs, aceptacion de usuarios, beta cerrada/publica, soporte y presupuesto de financiacion. Cuentas y nube aplazadas por decision del usuario; perfiles locales conservados.
