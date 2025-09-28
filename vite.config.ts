import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/js2-ca/",
  plugins: [tailwindcss()],
});
