# ReBocado: landing narrativa con Boco

**Objetivo:** abrir la landing al visitar `/`, conservar la demo en `/app` y crear una experiencia blanca y verde con un niño que acompaña el scroll.

**Autorización:** el usuario solicitó la rama `jose`, un rediseño completo y libertad creativa. Se trabaja en esa rama dentro del checkout existente, sin despliegue.

**Diseño:** blanco cálido, verde bosque y lima; Manrope y DM Sans; titulares editoriales grandes, fotografías recortadas y elementos gráficos de bolsa/ticket. Boco será un SVG original blanco y verde con gorra, sonrisa, parpadeo y boca animada. Tendrá espacios reservados por sección para acompañar la explicación sin tapar controles. Móvil y movimiento reducido mantienen todo el contenido legible sin depender de animación.

**Arquitectura:** React/Vite/Motion existentes. Landing en `src/App.jsx` con CSS aislado en `src/landing/landing.css`. Ilustración y guía en `src/landing/Boco.jsx` y `Boco.css`. Rutas y manifest en archivos actuales. Sin cambios en almacenamiento, reservas, pagos o servicios externos.

- [x] Rutas: reproducir la entrada actual; `/` y `/conoce-rebocado` muestran landing, `/app` catálogo; conservar rutas profundas y enlaces internos. Actualizar manifest sin cambiar identidad de instalación.
- [x] Ilustración: rostro vectorial original, guía contextual por scroll, animación de boca y alternativa con movimiento reducido.
- [x] Landing: hero, cómo funciona, ejemplos de packs, comercios, preguntas y contacto. Menú móvil accesible; enlaces reales desde `content.js`; acceso visible a demo. No inventar resultados ni comercios reales.
- [x] Verificación: `npm test`, `npm run build`; navegador escritorio/móvil, scroll del guía, teclado/FAQ/contacto, acceso a demo y retorno, recarga de rutas profundas y PWA offline.
- [x] Revisión: agentes de pruebas y revisión de código; corregir hallazgos antes de entregar. Actualizar README y AGENTS con arquitectura final.

**Límites:** sin commit/push/despliegue automático; `rebocado.store` cambiará cuando se publique esta rama. Los comercios y pagos continúan siendo simulados. La ilustración es un asistente, no sustituye el logo.

## Evidencia de verificación

- npm test: 6 pruebas, 0 fallos, 0 omitidas.
- npm run build: build Vite y generación PWA correctos, sin advertencias.
- Navegador Edge: 23 comprobaciones funcionales y 3 de movimiento reducido/ilustraciones, sin errores JavaScript; anchos 390, 768 y 1440.
- Producción local: manifest id / y start_url /app; service worker controla la demo; recarga offline de landing, catálogo y ficha profunda; actualización pide confirmación y permite cargar la nueva versión.
- Revisión de código: sin hallazgos críticos o altos. Corregidos recorte de titular móvil, tipografía de botones y limpieza del temporizador de habla.
- El flujo nativo de instalación en un dispositivo físico no se ejecutó; se verificaron manifest, iconos y service worker.

## Refinamiento del personaje solicitado por el usuario

El diseño actual sustituye los bocadillos y la boca de hablar por expresiones suaves, solo rostro y gorra lisa, sin hombros. El recorrido conserva un único personaje y usa una miniatura lateral entre anclas; pausa y movimiento reducido muestran las caras estáticas dentro del contenido.

Verificación del refinamiento: 12 pruebas unitarias correctas, incluidas 6 nuevas regresiones de continuidad, tamaño y reversibilidad. En un recorrido real de 391 fotogramas no hubo desapariciones ni reemplazos del nodo del guía. Build correcto y revisión de código aprobada.

## Iteración: diálogos, claridad y uso móvil

El usuario pidió recuperar los diálogos, ampliar el rostro y usar gorra blanca con contornos verdes. La versión actual conserva una zona de lectura alrededor de cada ancla, sin temporizador que cierre mensajes; el personaje sigue siendo uno solo durante los traslados. Los bocadillos usan altura natural y tipografía propia para no tapar texto ni controles en pantallas pequeñas.

La portada resalta el precio aproximado, la reserva por WhatsApp y el pago/recojo en el local. Incluye pasos destacados, condiciones previas y una separación clara entre piloto y demo. El favicon y los iconos PWA ahora son una bolsa mordida con sonrisa y hoja.

Verificación: 15 pruebas unitarias correctas (3 nuevas sobre permanencia, mensajes y tamaño), build y generación PWA correctos. En producción local, la landing y los seis iconos versionados cargan offline tras activar el service worker. Corregido y observado el solapamiento de bocadillos a 320 px; revisión de código aprobada.
