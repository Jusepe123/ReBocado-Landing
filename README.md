# ReBocado · PWA en React

Una aplicación instalable de rescate de comida para Cochabamba. React + Vite, Motion y Lucide. Conserva la landing en `/conoce-rebocado`.

## Qué incluye

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

`npm test` ejecuta las pruebas de fechas, stock, reservas, pagos de prueba y recuperación de datos locales.

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
| Node.js Version      | `24.x` (predeterminado actual)    |
| Variables de entorno | Ninguna para esta demo           |

1. Inicia sesión en Vercel con GitHub y elige **Add New → Project** (o **New Project**).
2. En **Import Git Repository**, busca `Jusepe123/ReBocado-Landing` y pulsa **Import**. Si no aparece, concede acceso a ese repositorio en la integración de GitHub.
3. Usa los ajustes de la tabla. No selecciones `site/`: `package.json` ya está en la raíz del repositorio publicado. La rama de producción es `main`.
4. Pulsa **Deploy**. Cuando finalice, abre la URL que te entregue Vercel y comprueba `/`, `/reservas` y `/conoce-rebocado`.
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
- `src/App.jsx`, `src/styles.css`, `src/brand.css`: landing original conservada.
- `src/content.js`: contactos y mensajes de WhatsApp.
- `vite.config.js`: manifest y service worker con precaché.
- `public/assets/`: logo y retratos proporcionados, fotografías ilustrativas WebP. Los prompts de las fotos están en `IMAGE.md`.

Los iconos PWA se derivan del emblema circular suministrado; el maskable incluye margen de seguridad. Los enlaces a WhatsApp solo abren un mensaje preparado, no lo envían automáticamente.

## Antes de lanzar con usuarios reales

Conecta un backend con autenticación, inventario compartido y reservas atómicas; agrega comercios verificados y contenido/horarios reales. Para cobrar, integra una pasarela autorizada y verifica pagos en servidor mediante webhooks. El cliente no debe poder declarar un pago real como completado. Define políticas de seguridad alimentaria, alérgenos, cancelaciones y privacidad con los negocios antes de operar. No utilices esta demo para cobrar o confirmar pedidos reales.
