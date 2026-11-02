import { resolve } from "node:path";
import { defineConfig } from "vite";

// Uma entrada para cada página HTML
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        menu: resolve(__dirname, "index.html"),
        perfil: resolve(__dirname, "perfil.html"),
        blog: resolve(__dirname, "blog.html"),
        pessoa: resolve(__dirname, "pessoa.html"),
        algoritmo: resolve(__dirname, "algoritmo.html"),
      },
    },
  },
});
