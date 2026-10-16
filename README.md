# ReBocado · Landing y PWA en React

Landing de ReBocado y aplicación instalable de demostración para Cochabamba. React + Vite, Motion y Lucide. La entrada principal `/` presenta la idea; el catálogo de prueba está en `/app`.

## Rutas y experiencia

- `/`: landing con fondo blanco, identidad verde y Boco, un rostro SVG ampliado con gorra blanca y contornos verdes. Sus diálogos permanecen visibles mientras se lee cada sección, sin cierre por temporizador. En escritorio mantiene un recorrido continuo y se reduce durante los trayectos; en móvil aparece dentro del contenido. El control de pausa y la preferencia de movimiento reducido conservan las escenas estáticas y sus mensajes.
- `/conoce-rebocado`: alias compatible de la misma landing.
- `/app`: catálogo PWA de demostración; los enlaces de la landing permiten abrirlo.
- `/favoritos`, `/reservas`, `/perfil`, `/comercios/:id` y `/reservar/:id`: conservan los flujos de la demo.

El manifest conserva `id: "/"` para mantener la identidad de instalaciones existentes, con `start_url: "/app"` y un acceso directo al catálogo. Abrir el dominio en un navegador muestra la landing; abrir la app instalada entra a la demo.

## Qué incluye

- Explicación destacada del piloto: packs a aproximadamente mitad de precio, reserva por WhatsApp y recojo/pago en el local. Tres pasos visibles y una lista de precio, horario y alérgenos que revisar antes de reservar.
- Catálogo de restaurantes, panaderías y cafeterías; búsqueda, categorías y orden por precio u horario.
- Fichas con tipo de pack, valor de referencia, horarios, recojo y advertencia de alérgenos.
- Favoritos, elección de día y cantidad, reserva con código y control de disponibilidad local.
- Pago al recoger o pago digital **simulado**, cancelación, simulación de pago/recojo e historial.
- Perfil local, ayuda y contactos reales de José Andrés y Matt.
- Manifest, iconos normales y maskable, instalación, funcionamiento offline y aviso de actualización.
- Diseño responsive, navegación móvil, soporte de teclado y respeto por movimiento reducido.

**Es un prototipo, no un marketplace operativo.** Los tres comercios, sus precios, direcciones y disponibilidad son ficticios; las imágenes de comida son ilustrativas. No se envían pedidos ni se procesan cobros. No existe un QR bancario pagable, autenticación o backend.

Las reservas y favoritos se guardan en `localStorage`, únicamente en ese navegador. El inventario es local: no se sincroniza entre usuarios, no tiene transacciones de servidor y no evita conflictos entre dispositivos. El día se calcula en `America/La_Paz`. Los horarios de ejemplo no restringen las reservas de prueba.

## Desarrollo local

Requiere Node.js 22.12 o superior. Desde la raíz de este repositorio (la carpeta `site/` en el workspace original):

```sh
npm ci
npm run dev
```

Abre **http://127.0.0.1:4173**. Para probar la PWA real, incluida la caché offline:

```sh
npm run build
npm run preview
```

`npm test` ejecuta las pruebas de fechas, stock, reservas, pagos de prueba y recuperación de datos locales, además de la continuidad y reversibilidad del recorrido del personaje.

El desarrollo no registra un service worker para evitar cachés de versiones viejas. Si anteriormente probaste la versión de producción en ese mismo puerto, elimina su service worker y caché desde DevTools → Application, o usa otro puerto para el preview:

```sh
npm run preview -- --port 4174
```

En Chrome/Edge/Android utiliza “Instalar app”. En iOS abre en Safari → Compartir → Añadir a pantalla de inicio. Necesita HTTPS en producción o localhost. Carga la app una vez antes de desconectarte. Las fuentes externas pueden usar la fuente de respaldo offline; el catálogo y las reservas no dependen de ellas.

## Desplegar en Vercel

Importa [Jusepe123/ReBocado-Landing](https://github.com/Jusepe123/ReBocado-Landing).

| Ajuste               | Valor                            |
| -------------------- | -------------------------------- |
| Framework Preset     | Vite                             |
| Root Directory       | Raíz del repositorio, sin `site` |
| Install Command      | `npm ci`                         |
| Build Command        | `npm run build`                  |
| Output Directory     | `dist`                           |
| Node.js Version      | `24.x` (predeterminado actual)   |
| Variables de entorno | Ninguna para esta demo           |

1. Inicia sesión en Vercel con GitHub y elige **Add New → Project** (o **New Project**).
2. En **Import Git Repository**, busca `Jusepe123/ReBocado-Landing` y pulsa **Import**. Si no aparece, concede acceso a ese repositorio en la integración de GitHub.
3. Usa los ajustes de la tabla. No selecciones `site/`: `package.json` ya está en la raíz del repositorio publicado. La rama de producción es `main`.
4. Pulsa **Deploy**. Cuando finalice, abre la URL que te entregue Vercel y comprueba la landing en `/`, el catálogo en `/app`, `/reservas` y el alias `/conoce-rebocado`.
5. Carga la app una vez, instálala desde el navegador y prueba el modo sin conexión. Las futuras subidas a `main` generarán un nuevo despliegue mientras la integración Git siga activa.

Referencias de configuración: [importar un repositorio y despliegues Git](https://vercel.com/docs/git) y [versiones de Node.js](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

`vercel.json` contiene la reescritura SPA para abrir directamente fichas y reservas, y evita cachear el service worker como un archivo permanente. Vercel publica los archivos estáticos existentes antes del fallback a `index.html`. El plugin genera `/manifest.webmanifest`, `/sw.js` y la precaché durante el build. Cuando hay una actualización se pide confirmación, para no recargar durante una reserva.

Referencias: [Vite en Vercel y rutas SPA](https://vercel.com/docs/frameworks/frontend/vite), [Vite PWA](https://vite-pwa-org.netlify.app/guide/).

Se retiraron los dos archivos `amplify.yml` y las instrucciones de Amplify. **Esto no elimina una aplicación, dominio o despliegue existente en AWS**: desactívalo o elimínalo desde tu cuenta de Amplify si ya lo habías creado. No se ejecuta ningún despliegue desde este proyecto.

## Archivos principales

- `src/app/PwaApp.jsx`: navegación, catálogo, fichas, reservas, pagos de prueba, perfil e instalación.
- `src/app/catalog.js`: datos ficticios y fechas/stock de ejemplo.
- `src/app/store.js`: validación, persistencia y transiciones de reservas.
- `src/app/app.css`: diseño de aplicación.
- `src/App.jsx`, `src/landing/landing.css`: landing, selector de ejemplos, preguntas, contacto y estilos aislados `rb-*`.
- `src/landing/Boco.jsx`, `src/landing/Boco.css`: ilustración vectorial, escenas con diálogos persistentes y guía de scroll; sin imágenes externas ni librerías adicionales.
- `src/landing/guideMotion.js`, `tests/guideMotion.test.js`: recorrido continuo entre anclas, miniatura lateral y pruebas de regresión para evitar desapariciones y saltos de posición o tamaño.
- `src/styles.css`, `src/brand.css`: estilos base compartidos y ajustes de marca existentes.
- `src/content.js`: contactos y mensajes de WhatsApp.
- `vite.config.js`: manifest y service worker con precaché.
- `public/assets/`: logo y retratos proporcionados, fotografías ilustrativas WebP. Los prompts de las fotos están en `IMAGE.md`.

El favicon y los iconos PWA representan una bolsa mordida con sonrisa y hoja, en verde y lima. La fuente vectorial está en `public/favicon-rebocado.svg`, con variantes PNG y un maskable con margen de seguridad. Las URLs usan `?v=4` para renovar iconos anteriores; la precaché admite esa versión también offline. Los enlaces a WhatsApp solo abren un mensaje preparado, no lo envían automáticamente.

## Antes de lanzar con usuarios reales

Conecta un backend con autenticación, inventario compartido y reservas atómicas; agrega comercios verificados y contenido/horarios reales. Para cobrar, integra una pasarela autorizada y verifica pagos en servidor mediante webhooks. El cliente no debe poder declarar un pago real como completado. Define políticas de seguridad alimentaria, alérgenos, cancelaciones y privacidad con los negocios antes de operar. No utilices esta demo para cobrar o confirmar pedidos reales.
