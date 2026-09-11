// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // EDITAR: dominio real de Origen Chemical (igual que `dominio` en src/data/site.ts)
  site: "https://quiet-travesseiro-9a9569.netlify.app",
  vite: {
    plugins: [tailwindcss()],
  },
});
