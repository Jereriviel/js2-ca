import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode }) => ({
  base: "/js2-ca/",
  plugins: [tailwindcss()],
}));
