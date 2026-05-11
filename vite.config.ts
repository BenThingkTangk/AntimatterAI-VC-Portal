import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      "@nirmata/dtom-brand-system/styles": path.resolve(
        import.meta.dirname,
        "packages/dtom-brand-system/src/styles/dtom-brand-system.css"
      ),
      "@nirmata/dtom-brand-system": path.resolve(
        import.meta.dirname,
        "packages/dtom-brand-system/src/index.ts"
      ),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  base: "./",
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
