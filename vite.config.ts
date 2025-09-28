import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode }) => ({
  base: mode === "production" ? "/js2-ca/" : "/",
  plugins: [tailwindcss()],
}));
