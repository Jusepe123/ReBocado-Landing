# Instrucciones para agentes: ReBocado

## Alcance y fuentes

Estas instrucciones aplican a todo este repositorio. Comunícate con el usuario en español y conserva el español de Bolivia en la interfaz.

Antes de editar, revisa los archivos afectados, `package.json` y `README.md`. Si está disponible, lee `../ReBocado.md` para decisiones de negocio y contenido. En el workspace original, esta carpeta se llama `site/` y contiene la raíz Git; en un clon independiente, los comandos se ejecutan directamente desde la raíz del clon.

El documento de negocio es una postulación de agosto de 2026: sus cifras y afirmaciones externas no están verificadas ni actualizadas. El código y la configuración determinan qué existe hoy; el documento explica la visión. Si hay discrepancias sobre el estado del piloto, señala la diferencia y confirma el dato antes de publicar nuevas afirmaciones.

## Producto y límites de la demo

- ReBocado conecta negocios con excedentes alimentarios aptos para consumo y consumidores de Cochabamba, Bolivia, mediante packs sorpresa a aproximadamente mitad de precio.
- El contenido depende del excedente del día; el usuario debe conocer tipo de comida, precio, alérgenos y ventana de recojo. El retiro es en el negocio. No ofrecer delivery, logística propia ni almacenamiento.
- El contexto de negocio plantea validar el piloto por WhatsApp y pago en el local, empezando en el entorno de la UMSS. El QR interoperable pertenece a la futura aplicación con pagos reales.
- Este repositorio implementa una PWA de demostración. Los comercios, precios, direcciones, horarios e inventario son ficticios; las fotos de comida son ilustrativas. No se envían pedidos ni se procesa dinero.
- No hay backend, autenticación, base de datos, inventario compartido ni QR bancario pagable. Favoritos, reservas y nombre viven en `localStorage`; no se sincronizan entre dispositivos.
- Mantén visibles los avisos de demostración y las etiquetas de pago simulado. Una reserva local o un estado `simulated` nunca confirma una venta o un pago real.
- Expo/React Native con TypeScript, Next.js, Supabase, PostHog, Sentry y pagos BCB son tecnología prevista en el documento, no integraciones presentes en este repositorio. No incorporarlas sin una tarea explícita.
- Metas de negocios, packs vendidos, recompra, ingresos y expansión a otras ciudades no son logros alcanzados. No inventar testimonios, comercios afiliados, impacto, teléfonos, enlaces ni disponibilidad en tiendas.
- Presupuesto, riesgos y detalles de la postulación son contexto interno; no publicarlos por defecto. La primera versión prevista excluye delivery, chat, puntos, iOS y múltiples ciudades.

## Stack y comandos reales

Aplicación cliente con JavaScript ESM y JSX, React 19, Vite 8, React Router 7, Motion, Lucide y `vite-plugin-pwa`. No hay TypeScript ni scripts de lint o typecheck configurados. No asumir Next.js, Expo ni un framework de tests distinto del existente.

Requiere Node.js >=22.12.0. Usar npm y conservar `package-lock.json`.

| Comando           | Propósito                                               |
| ----------------- | ------------------------------------------------------- |
| `npm ci`          | Instalar exactamente el lockfile cuando sea necesario.  |
| `npm run dev`     | Vite en `http://127.0.0.1:4173`, con puerto estricto.   |
| `npm test`        | Pruebas con `node --test tests/*.test.js`.              |
| `npm run build`   | Compilar a `dist/` y generar manifest y service worker. |
| `npm run preview` | Servir el build en el mismo host y puerto.              |

No ejecutar dev y preview simultáneamente en el mismo puerto. Para otro puerto: `npm run preview -- --port 4174`. En PowerShell, usar `npm.cmd` si la política de ejecución bloquea `npm.ps1`.

## Mapa del código

| Archivo o carpeta                              | Responsabilidad                                                                                                                                     |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/main.jsx`                                 | Entrada: StrictMode, BrowserRouter, PwaApp y orden de importación de CSS.                                                                           |
| `src/app/PwaApp.jsx`                           | Contexto local, navegación, catálogo, fichas, checkout de prueba, reservas, perfil, instalación y actualización PWA.                                |
| `src/app/catalog.js`                           | Comercios ficticios, categorías, formato monetario, fechas y stock local.                                                                           |
| `src/app/store.js`                             | Sanitización, carga de estado y transiciones de reservas.                                                                                           |
| `src/app/app.css`                              | Estilos de aplicación con selectores `.pwa-app` y `.app-*`.                                                                                         |
| `src/App.jsx`                                  | Landing principal, cargada de forma diferida en `/` y en el alias `/conoce-rebocado`; rostro con gorra lisa y expresiones animadas al hacer scroll. |
| `src/content.js`                               | Contactos existentes, mensajes/enlaces de WhatsApp, ejemplos y preguntas frecuentes.                                                                |
| `src/landing/landing.css`                      | Nuevo diseño de landing aislado con selectores `rb-*`; no modificar el diseño PWA desde aquí.                                                       |
| `src/landing/Boco.jsx`, `src/landing/Boco.css` | Rostro SVG original sin hombros, guía de scroll y expresiones; anclas `data-guide-anchor` reservan espacio sin tapar controles.                     |
| `src/styles.css`, `src/brand.css`              | Estilos base compartidos; ajustes de marca y retratos.                                                                                              |
| `tests/store.test.js`                          | Fechas, stock, validación, reservas, pagos simulados y recuperación del estado.                                                                     |
| `public/assets/`, `IMAGE.md`                   | Marca, retratos y fotos ilustrativas; procedencia y prompts de las fotos.                                                                           |
| `vite.config.js`                               | React, manifest, iconos, precaché y configuración PWA.                                                                                              |
| `vercel.json`                                  | Build, fallback SPA y cabeceras de caché/seguridad para Vercel.                                                                                     |
| `server.mjs`                                   | Servidor estático auxiliar de dist, sin fallback SPA; no es un backend de negocio.                                                                  |

La trayectoria pura está en `src/landing/guideMotion.js`, con regresiones en `tests/guideMotion.test.js`. Mantén un solo guía montado durante el recorrido: no filtrar anclas por visibilidad ni remontar el personaje al cambiar de sección. Las medidas se cachean y el scroll actualiza transformaciones mediante MotionValues, sin animar ancho/alto ni renderizar React en cada fotograma.

Rutas que deben conservarse: `/` (landing), `/conoce-rebocado` (alias de la landing), `/app` (catálogo PWA), `/favoritos`, `/reservas`, `/perfil`, `/comercios/:id` y `/reservar/:id`. Los enlaces de regreso al catálogo apuntan a `/app`; los de información sobre ReBocado apuntan a `/`. Mantén la pantalla de ruta desconocida.

## Reglas de implementación

- Reutiliza componentes, helpers y dependencias existentes. Conserva el estilo del archivo editado; evita reformateos masivos o migraciones de stack incidentales.
- Mantén la lógica de fechas, disponibilidad y reservas en `catalog.js` y `store.js`, con pruebas independientes de React. Evita duplicar reglas en la interfaz.
- El día comercial se calcula en `America/La_Paz`, no en la zona horaria del navegador ni usando directamente el día UTC. Usa herramientas del sistema para cálculos manuales de fechas y horas; en pruebas, usa instantes explícitos.
- El stock se calcula por comercio y fecha. Las reservas canceladas liberan stock; las recogidas siguen consumiéndolo. La cancelación repetida no debe incrementar existencias.
- Reserva de prueba: comercio válido, hoy o mañana en Bolivia, cantidad entera dentro del stock, método `cash` o `qr-demo` y aceptación de horario/alérgenos.
- Solo las reservas `reserved` admiten transiciones. El recojo exige pago `simulated`; los pedidos `collected` y `cancelled` no se modifican. Los horarios de ejemplo no restringen las reservas de prueba; no cambiarlo sin un requisito explícito.
- Conserva la recuperación ante JSON corrupto, datos desconocidos y almacenamiento bloqueado, además del aviso cuando no se pueden persistir cambios. La clave actual es `rebocado.demo.v1`: si cambia el formato, define compatibilidad o migración antes de modificarla.
- Preserva la sincronización entre pestañas mediante el evento `storage`. Esto no aporta transacciones ni stock seguro entre usuarios.
- Usa `src/content.js` como fuente de contactos y `whatsappUrl` para componer mensajes. Abrir WhatsApp prepara un texto; no envía mensajes automáticamente.

## Diseño, accesibilidad y PWA

- Mantén la identidad cercana: verde bosque, blanco, menta y lima, Manrope para títulos y DM Sans para texto; Georgia en cursiva para acentos editoriales de la landing. Reutiliza las variables CSS, emblema e iconos existentes.
- Preserva diseño responsive, navegación móvil, etiquetas de controles, texto alternativo, foco visible, enlaces para saltar al contenido, uso con teclado y diálogos accesibles. Respeta movimiento reducido en CSS y Motion.
- La landing y la PWA comparten estilos base: comprueba ambas al modificar CSS global. Conserva el orden de importación en `main.jsx` salvo necesidad justificada.
- La landing destaca precio aproximado, reserva por WhatsApp y pago/recojo en el local. Conserva los tres pasos, el recuadro “Antes de reservar” con precio/horario/alérgenos, y la separación entre piloto y demo.
- Boco es un rostro SVG ampliado, sin hombros, con gorra blanca y contornos verdes. `BocoScene` muestra diálogos que permanecen durante la lectura, sin cierre por temporizador. `ScrollGuide` conserva una trayectoria continua, con zonas de permanencia junto a cada ancla y una miniatura lateral durante los traslados. En móvil `GuideDock` muestra las escenas dentro del contenido; pausa y movimiento reducido conservan las escenas estáticas con sus mensajes.
- El bocadillo necesita altura automática sin encogerse; el retrato usa el espacio restante. Sus párrafos tienen tipografía y márgenes propios para no heredar estilos de las secciones. Comprueba en 320px y con pausa que ningún diálogo tape texto o botones.
- El favicon vectorial es `public/favicon-rebocado.svg`: bolsa mordida con sonrisa y hoja, verde y lima. Mantén variantes PNG, el área segura maskable y la versión de iconos coherente entre HTML/manifest/precaché offline.
- Abrir el dominio muestra la landing. La app instalada abre `/app`: conserva `id: "/"` en el manifest para no cambiar la identidad de instalaciones existentes, y `start_url: "/app"`. Mantén el acceso al catálogo desde la landing.
- La PWA se verifica con build y preview; desarrollo no registra service worker. Si una caché anterior interfiere, elimina el registro/caché local de prueba o usa un puerto nuevo.
- Conserva la actualización con confirmación (`registerType: "prompt"`); no recargar automáticamente durante una reserva. Mantén la exclusión de `/api/` del fallback de navegación y las cabeceras de `sw.js` y manifest.
- Manifest y service worker se generan durante el build: no editar `dist/` manualmente. No versionar `node_modules/`, `dist/`, `.openai/` ni `.sites-runtime/`.
- En Vercel, la raíz es la del repositorio Git, sin prefijo `site/` en un clon. La demo no requiere variables de entorno. No desplegar ni modificar servicios externos por una tarea local de código o documentación.

## Seguridad y forma de trabajo

- Inspecciona el estado Git antes de editar; preserva cambios ajenos. Planifica y delega tareas independientes con propiedad clara de archivos cuando aporte valor; revisa el resultado antes de darlo por válido.
- No incluir secretos, tokens o claves en código, commits, documentación o logs. Usa variables de entorno y errores claros cuando una futura integración requiera credenciales. Las variables expuestas al cliente no pueden contener secretos.
- Una futura operación real debe validar entradas, autorización, stock y pagos en servidor. El cliente y `localStorage` no son autoridades de inventario ni de pago; los cobros requieren verificación de servidor mediante una integración autorizada.
- Antes de aplicar cambios de datos, autenticación, dinero o migraciones, prepara una propuesta revisable, verifica lo posible sin aplicarla y solicita confirmación explícita del usuario.
- Cualquier SQL, migración, esquema o política RLS debe pasar por el agente `database-reviewer` antes de aplicarse. Nunca ejecutar `DROP`, `TRUNCATE` ni `DELETE` sin `WHERE` sin confirmación explícita.
- Antes de commits, revisar secretos, validación de entradas y, donde corresponda, SQL parametrizado, HTML seguro, CSRF, autenticación/autorización, límites de peticiones y errores sin datos sensibles. Si aparece un problema de seguridad, detenerse y usar `security-reviewer`. No añadir al agente como coautor o colaborador en commits.

## Verificación antes de entregar

- No declarar un cambio terminado, corregido o funcionando sin evidencia de la sesión actual. Informar qué se comprobó y cualquier limitación; no inventar comandos ni afirmar pruebas omitidas.
- Documentación o texto trivial: releer el resultado, contrastarlo con fuentes/rutas/scripts y revisar el diff. No hacen falta pruebas nuevas que solo repliquen el texto.
- Cambios de lógica: ejecutar las pruebas afectadas; para funcionalidades y correcciones, ejecutar `npm test` y `npm run build`. Reproducir primero los bugs y añadir una regresión cuando sea práctico. Resolver o explicar advertencias y pruebas omitidas.
- Cambios de interfaz: además del build, observar el flujo afectado en móvil y escritorio, teclado y diálogos; comprobar la landing cuando se toquen estilos compartidos.
- Cambios en reservas: comprobar cantidad/fecha inválidas, falta de stock, cancelación, pago/recojo de prueba, recarga y recuperación del almacenamiento.
- Cambios PWA o despliegue: con build y preview, verificar rutas profundas al recargar, instalación, carga inicial seguida de uso offline y aviso de actualización. Las pruebas unitarias no demuestran estas funciones.
- Actualizar `README.md` y estas instrucciones si cambian comandos, rutas, arquitectura o límites de la demo.
