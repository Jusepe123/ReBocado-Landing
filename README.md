# ReBocado · Landing en React

Landing de ReBocado construida con React y Vite. Incluye los contactos del equipo y botones que abren WhatsApp con mensajes para consumidores o negocios. No requiere backend ni variables de entorno.

## Desarrollo local

Requiere Node.js 22.12 o superior. Desde `site/`:

```sh
npm ci
npm run dev
```

Abre `http://127.0.0.1:4173`. Para compilar y revisar la versión de producción:

```sh
npm run build
npm run preview
```

## Despliegue en AWS Amplify Hosting

El archivo `amplify.yml` instala Node 22, ejecuta `npm ci` y `npm run build`, y publica `dist/`.

Si conectas un repositorio cuya raíz sea esta carpeta, Amplify usará el `amplify.yml` de esta carpeta. Si el repositorio contiene `site/` dentro de `Landing/`, usa el `amplify.yml` de `Landing/`, indica `site` como raíz de la aplicación y configura `AMPLIFY_MONOREPO_APP_ROOT=site`.

La versión para publicar se genera en `dist/` con `npm run build`. El proyecto se entrega sin archivo ZIP.

La landing usa navegación mediante anclas y no necesita reglas adicionales de reescritura.

Documentación: [compilación de Amplify](https://docs.aws.amazon.com/amplify/latest/userguide/yml-specification-syntax.html) y [configuración de monorepos](https://docs.aws.amazon.com/amplify/latest/userguide/monorepo-configuration.html).

## Contenido y contactos

- `src/App.jsx`: secciones, menú móvil, filtros de ejemplos y diálogo de contacto.
- `src/content.js`: contactos, mensajes de WhatsApp, ejemplos y preguntas frecuentes.
- `src/styles.css`: estilos y adaptación a móviles.
- `public/assets/`: emblema circular de ReBocado, fotos reales de José Andrés y Matt, y cuatro fotografías de comida ilustrativas optimizadas a WebP. Los prompts de las imágenes generadas se documentan en `IMAGE.md`.
- `public/favicon-rebocado-32.png`, `public/favicon-rebocado-192.png` y `public/apple-touch-icon-rebocado.png`: versiones del emblema para la pestaña y accesos directos.

Los consumidores pueden contactar a José Andrés (+591 63923958) y los negocios a Matt (+591 75499689). Ambos contactos incluyen correo y teléfono. Los botones muestran enlaces directos a WhatsApp, sin enviar mensajes automáticamente.

La primera prueba se realizará con un restaurante en Cochabamba. Los packs son ejemplos y no ofertas disponibles. La landing diferencia el piloto de la aplicación prevista.
