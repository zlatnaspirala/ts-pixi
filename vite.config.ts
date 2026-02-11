import { defineConfig } from "vite";

export default defineConfig({
  base: '/apps/ts-pixi/',
  // base: "./",
  server: {
    port: 8080
  },
  build: {
    minify: false,
    sourcemap: true,

    outDir: "dist"
  }
});
