import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "server/cloudflare-worker.ts"),
      name: "worker",
      fileName: "cloudflare-worker",
      formats: ["es"],
    },
    outDir: "dist/server",
    target: "esnext",
    ssr: true,
    rollupOptions: {
      external: [
        "hono",
        "dotenv",
      ],
      output: {
        format: "es",
        entryFileNames: "[name].mjs",
      },
    },
    minify: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
