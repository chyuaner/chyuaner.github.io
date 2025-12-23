// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
    },
    image: {
      domains: ["astro.build", "raw.githubusercontent.com", "barian0517.github.io"],
    },

    server: {
      port: 4321,
      host: true,
    },
});
