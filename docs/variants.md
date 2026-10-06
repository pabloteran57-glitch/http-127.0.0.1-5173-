# Plantillas de variantes

Canónico: `data/variants.json`. Los cambios son frente al perfil principal `commercial-solo-gimbal`, no frente al inventario completo. Las piezas retiradas siguen disponibles en inventario. Los condicionales NO son activos.

## Documental / solo

- ID: `documentary-one-man-film`; modo visual: Ensamblado; estado: Candidato / validación física pendiente.
- Activos: RS 4 Pro; BG70; FX3; 16-35 mm GM; Jaula HawkLock; Base 1674; Varillas de 8 pulgadas; Parasol Star-Trail; Soporte de monitor; Indie 7; VB99 Pro; Placa V-mount; Adaptador NP-FZ100; Control USB-C DJI; HDMI Kondor Blue; D-Tap a DC SmallHD; Mic 2; Micrófono de solapa DJI; Monitor & Control
- Retirados del perfil principal: Aplicación Ronin
- Añadidos al perfil principal: Mic 2; Micrófono de solapa DJI; Monitor & Control
- En reserva/condicionales: Ninguno
- Cableado activo: ctrl-rs4-to-fx3-usbc; pwr-vmount-to-fx3-dummy; pwr-plate-to-smallhd; vid-fx3-to-smallhd; pwr-bg70-to-rs4; audio-rx-to-fx3; audio-lav-to-tx; pwr-vmount-to-plate-contacts
- Conexiones retiradas: Ninguno
- Conexiones añadidas: audio-rx-to-fx3; audio-lav-to-tx
- Equilibrio: Mismo bloque móvil pesado que Comercial. No se garantiza equilibrio; pesar RX, cables y fijaciones y medir barrido de la placa baja.
- Flujo de trabajo: Audio de solapa y monitor directo para un operador. Sólo el RX de Mic 2 acompaña a la cámara; TX y estuche no son carga móvil. El punto de fijación del RX sigue pendiente.
- Presupuesto: Añade Mic 2 y micrófono de solapa frente al perfil Comercial; sin compras nuevas si ya están disponibles.
- Complejidad: Media / montaje físico pendiente
- Dependencias: Medir la pila de placas y el barrido de inclinación/rotación/giro horizontal con los motores apagados.; Pesar conjunto móvil completo; la capacidad nominal no certifica encaje.; 3203B: fijación superior documentada, separación del motor de giro horizontal no probada.; Indie 7 invertido bajo soporte nativo 3026B: verificar inversión de imagen, carga y mano enguantada.; Receptor Mic 2: pinza/soporte y punto de fijación aún no confirmados; no se representa un montaje inexistente.
- Subtotal móvil modelado: 3.25 kg, incompleto/aproximado.

## Comercial / contenido de marca

- ID: `commercial-solo-gimbal`; modo visual: Ensamblado; estado: Candidato / validación física pendiente.
- Activos: RS 4 Pro; BG70; FX3; 16-35 mm GM; Jaula HawkLock; Base 1674; Varillas de 8 pulgadas; Parasol Star-Trail; Soporte de monitor; Indie 7; VB99 Pro; Placa V-mount; Adaptador NP-FZ100; Control USB-C DJI; HDMI Kondor Blue; D-Tap a DC SmallHD; Aplicación Ronin
- Retirados del perfil principal: Ninguno
- Añadidos al perfil principal: Ninguno
- En reserva/condicionales: Focus Pro LiDAR; Motor Focus Pro; RavenEye; HDMI A-C DJI; Distribuidor StarTech; Interfaz LiDAR / Transmission
- Cableado activo: ctrl-rs4-to-fx3-usbc; pwr-vmount-to-fx3-dummy; pwr-plate-to-smallhd; vid-fx3-to-smallhd; pwr-bg70-to-rs4; pwr-vmount-to-plate-contacts
- Conexiones retiradas: Ninguno
- Conexiones añadidas: Ninguno
- Equilibrio: ~3.23 kg de piezas modeladas; no representa la carga móvil completa. La batería baja reduce altura pero aumenta inercia y exige ajuste vertical/longitudinal y prueba de giro horizontal.
- Flujo de trabajo: Monitor directo, V-mount baja y parasol. LiDAR, motor y RavenEye quedan en reserva: no hay una transmisión dual ni calibración de foco demostrada en gimbal.
- Presupuesto: Perfil de alta gama solicitado, sin precios inventados ni añadir DJI Transmission.
- Complejidad: Alta / montaje físico pendiente
- Dependencias: Medir la pila de placas y el barrido de inclinación/rotación/giro horizontal con los motores apagados.; Pesar conjunto móvil completo; la capacidad nominal no certifica encaje.; 3203B: fijación superior documentada, separación del motor de giro horizontal no probada.; Indie 7 invertido bajo soporte nativo 3026B: verificar inversión de imagen, carga y mano enguantada.
- Subtotal móvil modelado: 3.22 kg, incompleto/aproximado.

## A mano / extracción

- ID: `handheld-quick-release`; modo visual: Ensamblado; estado: Candidato / validación física pendiente.
- Activos: FX3; 16-35 mm GM; Jaula HawkLock; XLR-H1; Mic 2; Micrófono de solapa DJI; Monitor & Control
- Retirados del perfil principal: RS 4 Pro; BG70; Base 1674; Varillas de 8 pulgadas; Parasol Star-Trail; Soporte de monitor; Indie 7; VB99 Pro; Placa V-mount; Adaptador NP-FZ100; Control USB-C DJI; HDMI Kondor Blue; D-Tap a DC SmallHD; Aplicación Ronin
- Añadidos al perfil principal: XLR-H1; Mic 2; Micrófono de solapa DJI; Monitor & Control
- En reserva/condicionales: Ninguno
- Cableado activo: audio-rx-to-xlrhandle; audio-lav-to-tx
- Conexiones retiradas: ctrl-rs4-to-fx3-usbc; pwr-vmount-to-fx3-dummy; pwr-plate-to-smallhd; vid-fx3-to-smallhd; pwr-bg70-to-rs4; pwr-vmount-to-plate-contacts
- Conexiones añadidas: audio-rx-to-xlrhandle; audio-lav-to-tx
- Equilibrio: Sin ejes de gimbal. El peso del asa y NP-FZ100 debe contarse en la carga de mano. Nuevo equilibrado completo al volver.
- Flujo de trabajo: Desconectar los cables que cruzan al gimbal, soltar la placa DJI y retirar el bloque de varillas si hace falta. No se promete extracción de cámara en un clic con 1674 atornillada. Instalar batería interna y XLR-H1.
- Presupuesto: Sin nuevos accesorios si asa y NP-FZ100 están disponibles; el bloque de energía externo queda estacionado.
- Complejidad: Baja / compatibilidad de extracción pendiente
- Dependencias: Batería Sony NP-FZ100 cargada; disponibilidad por confirmar.; Retirar el riel NATO superior de la jaula si interfiere con XLR-H1; tornillería según Sony/SmallRig.; Receptor Mic 2: pinza/soporte y punto de fijación aún no confirmados; no se representa un montaje inexistente.
- Subtotal móvil modelado: 1.85 kg, incompleto/aproximado.

## Esencial / menor presupuesto

- ID: `lower-budget-stripped-down`; modo visual: Ensamblado; estado: Candidato / validación física pendiente.
- Activos: RS 4 Pro; BG70; FX3; 16-35 mm GM; Jaula HawkLock; Control USB-C DJI; Monitor & Control; Mic 2; Micrófono de solapa DJI
- Retirados del perfil principal: Base 1674; Varillas de 8 pulgadas; Parasol Star-Trail; Soporte de monitor; Indie 7; VB99 Pro; Placa V-mount; Adaptador NP-FZ100; HDMI Kondor Blue; D-Tap a DC SmallHD; Aplicación Ronin
- Añadidos al perfil principal: Monitor & Control; Mic 2; Micrófono de solapa DJI
- En reserva/condicionales: Ninguno
- Cableado activo: ctrl-rs4-to-fx3-usbc; pwr-bg70-to-rs4; audio-rx-to-fx3; audio-lav-to-tx
- Conexiones retiradas: pwr-vmount-to-fx3-dummy; pwr-plate-to-smallhd; vid-fx3-to-smallhd; pwr-vmount-to-plate-contacts
- Conexiones añadidas: audio-rx-to-fx3; audio-lav-to-tx
- Equilibrio: Menor carga móvil, pero equilibrio de todos los ejes y bucle USB-C siguen obligatorios.
- Flujo de trabajo: Pantalla FX3 y NP-FZ100 interna; sin monitor, batería externa, varillas ni parasol. Monitor & Control opcional con dispositivo y firmware compatibles; no se dibuja un teléfono sin soporte.
- Presupuesto: Menos compras activas: elimina monitor y bloque V-mount/varillas. No equivale a ahorro monetario cotizado.
- Complejidad: Baja
- Dependencias: Medir la pila de placas y el barrido de inclinación/rotación/giro horizontal con los motores apagados.; Pesar conjunto móvil completo; la capacidad nominal no certifica encaje.; Receptor Mic 2: pinza/soporte y punto de fijación aún no confirmados; no se representa un montaje inexistente.
- Subtotal móvil modelado: 1.55 kg, incompleto/aproximado.

## Vertical / 9:16

- ID: `vertical-916-creator-mode`; modo visual: Vertical; estado: Candidato / validación física pendiente.
- Activos: RS 4 Pro; BG70; FX3; 16-35 mm GM; Jaula HawkLock; Control USB-C DJI; Monitor & Control; Mic 2
- Retirados del perfil principal: Base 1674; Varillas de 8 pulgadas; Parasol Star-Trail; Soporte de monitor; Indie 7; VB99 Pro; Placa V-mount; Adaptador NP-FZ100; HDMI Kondor Blue; D-Tap a DC SmallHD; Aplicación Ronin
- Añadidos al perfil principal: Monitor & Control; Mic 2
- En reserva/condicionales: Ninguno
- Cableado activo: ctrl-rs4-to-fx3-usbc; pwr-bg70-to-rs4; audio-rx-to-fx3
- Conexiones retiradas: pwr-vmount-to-fx3-dummy; pwr-plate-to-smallhd; vid-fx3-to-smallhd; pwr-vmount-to-plate-contacts
- Conexiones añadidas: audio-rx-to-fx3
- Equilibrio: Volver a equilibrar inclinación, rotación y giro horizontal en vertical. Se retiran el bloque de varillas/V-mount y el parasol; el giro visual no garantiza el ajuste.
- Flujo de trabajo: Usar plataforma vertical nativa del RS 4 Pro conforme al manual. El visor rota cámara/jaula como ilustración; no reconstruye la nueva pila de placas ni prueba holguras.
- Presupuesto: Sin soporte vertical de terceros añadido; NP-FZ100 y dispositivo opcional deben existir.
- Complejidad: Media / montaje vertical pendiente
- Dependencias: Medir la pila de placas y el barrido de inclinación/rotación/giro horizontal con los motores apagados.; Pesar conjunto móvil completo; la capacidad nominal no certifica encaje.; Receptor Mic 2: pinza/soporte y punto de fijación aún no confirmados; no se representa un montaje inexistente.; Validar plataforma vertical nativa y disponibilidad de acceso a HDMI/USB-C tras rotación.
- Subtotal móvil modelado: 1.55 kg, incompleto/aproximado.

## Entrevista corporativa

- ID: `corporate-interview`; modo visual: Ensamblado; estado: Candidato / validación física pendiente.
- Activos: FX3; 16-35 mm GM; Jaula HawkLock; XLR-H1; Mic 2; Micrófono de solapa DJI
- Retirados del perfil principal: RS 4 Pro; BG70; Base 1674; Varillas de 8 pulgadas; Parasol Star-Trail; Soporte de monitor; Indie 7; VB99 Pro; Placa V-mount; Adaptador NP-FZ100; Control USB-C DJI; HDMI Kondor Blue; D-Tap a DC SmallHD; Aplicación Ronin
- Añadidos al perfil principal: XLR-H1; Mic 2; Micrófono de solapa DJI
- En reserva/condicionales: Distribuidor StarTech; Indie 7
- Cableado activo: audio-rx-to-xlrhandle; audio-lav-to-tx
- Conexiones retiradas: ctrl-rs4-to-fx3-usbc; pwr-vmount-to-fx3-dummy; pwr-plate-to-smallhd; vid-fx3-to-smallhd; pwr-bg70-to-rs4; pwr-vmount-to-plate-contacts
- Conexiones añadidas: audio-rx-to-xlrhandle; audio-lav-to-tx
- Equilibrio: No es perfil de gimbal. Las masas de batería interna y soporte real aún no están incluidas; verificar la estabilidad en el soporte seleccionado.
- Flujo de trabajo: Audio con XLR-H1 y cámara estática. Monitor y doble HDMI se documentan en banco, no flotando en un trípode inventado. Soporte de cámara/monitor por definir antes de rodaje.
- Presupuesto: Sin precios ni trípode inventados. Soportes estáticos y su capacidad requieren selección/compra si no existen.
- Complejidad: Media / soportes pendientes
- Dependencias: Batería Sony NP-FZ100 cargada; disponibilidad por confirmar.; Retirar el riel NATO superior de la jaula si interfiere con XLR-H1; tornillería según Sony/SmallRig.; Receptor Mic 2: pinza/soporte y punto de fijación aún no confirmados; no se representa un montaje inexistente.; Seleccionar soportes estáticos reales antes de habilitar el monitor/distribuidor.
- Subtotal móvil modelado: 1.85 kg, incompleto/aproximado.

## Cine / narrativa

- ID: `cinema-narrative`; modo visual: Ensamblado; estado: Candidato / validación física pendiente.
- Activos: RS 4 Pro; BG70; FX3; 16-35 mm GM; Jaula HawkLock; Base 1674; Varillas de 8 pulgadas; Parasol Star-Trail; Soporte de monitor; Indie 7; VB99 Pro; Placa V-mount; Adaptador NP-FZ100; Control USB-C DJI; HDMI Kondor Blue; D-Tap a DC SmallHD; Aplicación Ronin; Mic 2
- Retirados del perfil principal: Ninguno
- Añadidos al perfil principal: Mic 2
- En reserva/condicionales: Focus Pro LiDAR; Motor Focus Pro; RavenEye; HDMI A-C DJI; Distribuidor StarTech; Interfaz LiDAR / Transmission
- Cableado activo: ctrl-rs4-to-fx3-usbc; pwr-vmount-to-fx3-dummy; pwr-plate-to-smallhd; vid-fx3-to-smallhd; pwr-bg70-to-rs4; audio-rx-to-fx3; pwr-vmount-to-plate-contacts
- Conexiones retiradas: Ninguno
- Conexiones añadidas: audio-rx-to-fx3
- Equilibrio: Subtotal base igual a Comercial, más RX/cables si se monta. Añadir foco o cambiar óptica implica rediseño y nuevo equilibrado, no activación automática.
- Flujo de trabajo: Mismo bloque de cámara y monitor directo para tomas ensayadas. Mic 2 RX opcional de referencia. Focus Pro/motor requieren lente calibrable y prueba mecánica; siguen estacionados.
- Presupuesto: Configuración de alta gama solicitada; no se presupone foco motorizado ni transmisión operativos.
- Complejidad: Alta / montaje y foco pendientes
- Dependencias: Medir la pila de placas y el barrido de inclinación/rotación/giro horizontal con los motores apagados.; Pesar conjunto móvil completo; la capacidad nominal no certifica encaje.; 3203B: fijación superior documentada, separación del motor de giro horizontal no probada.; Indie 7 invertido bajo soporte nativo 3026B: verificar inversión de imagen, carga y mano enguantada.; Receptor Mic 2: pinza/soporte y punto de fijación aún no confirmados; no se representa un montaje inexistente.
- Subtotal móvil modelado: 3.25 kg, incompleto/aproximado.


Vertical: plataforma nativa DJI, no soporte de terceros inventado. La rotación en el visor no prueba la pila vertical de placas.

Rigs propios con monitor lateral: El cambio vertical de DJI afecta a la plataforma de cámara; 3026B usa el NATO lateral fijo del RS 4 Pro. Se permite representar la misma cadena candidata de monitor lateral, no certificar holguras, rigidez, antitorsión o alimentación. Medir puertos, recorrido HDMI, manos y todos los ejes en vertical; la alimentación del Indie 7 queda pendiente sin una cadena activa. No se activa V-mount en vertical ni se modifica la plantilla vertical existente. Fuentes: [Fabricante](https://dl.djicdn.com/downloads/DJI_RS_4_Pro/UM/DJI_RS_4_User_Manual__v1.0__EN.pdf); [Fabricante](https://static.smallrig.com/mall/img/public/m1twezvd88j-1751250182064_.pdf).
