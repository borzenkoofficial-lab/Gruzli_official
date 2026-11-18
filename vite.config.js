import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  build: {
    target: "es2020",
    sourcemap: false,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        app: fileURLToPath(new URL("./app/index.html", import.meta.url))
      }
    }
  }
});