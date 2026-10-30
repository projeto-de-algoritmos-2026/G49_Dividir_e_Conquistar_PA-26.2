import { resolve } from "node:path";
import { defineConfig } from "vite";

// Duas páginas: menu (index.html) e perfil (perfil.html)
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        menu: resolve(__dirname, "index.html"),
        perfil: resolve(__dirname, "perfil.html"),
      },
    },
  },
});
