import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: [
        "favicon-rebocado.svg",
        "favicon-rebocado-32.png",
        "favicon-rebocado-192.png",
        "icon-512.png",
        "icon-maskable-512.png",
        "apple-touch-icon-rebocado.png",
      ],
      manifest: {
        id: "/",
        name: "ReBocado · Rescata un buen bocado",
        short_name: "ReBocado",
        description:
          "Demo de rescate de buena comida en Cochabamba. Explora packs, reserva y recoge en el local.",
        lang: "es",
        start_url: "/app",
        scope: "/",
        display: "standalone",
        background_color: "#f7f8f2",
        theme_color: "#174b35",
        icons: [
          {
            src: "/favicon-rebocado-192.png?v=4",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon-512.png?v=4",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon-maskable-512.png?v=4",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "Explorar packs",
            url: "/app",
            description: "Abre el catálogo de demostración",
          },
          {
            name: "Mis reservas",
            url: "/reservas",
            description: "Tus códigos y horarios de recojo",
          },
          {
            name: "Favoritos",
            url: "/favoritos",
            description: "Tus comercios guardados",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpeg,webp,svg,woff2}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^v$/],
        clientsClaim: true,
        globIgnores: ["**/assets/logo.png"],
        dontCacheBustURLsMatching: /-[A-Za-z0-9_-]{8}\.(?:js|css)$/,
      },
    }),
  ],
  build: { outDir: "dist", emptyOutDir: true },
});
