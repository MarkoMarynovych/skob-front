import react from "@vitejs/plugin-react-swc"
import { resolve } from "path"
import { defineConfig } from "vite"
import compression from "vite-plugin-compression"

export default defineConfig({
  publicDir: "public",
  base: "/",
  plugins: [
    react(),
    compression({
      algorithm: "gzip",
      threshold: 10240,
    }),
  ],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
      "~app": resolve(__dirname, "./src/app"),
      "~pages": resolve(__dirname, "./src/pages"),
      "~widgets": resolve(__dirname, "./src/widgets"),
      "~features": resolve(__dirname, "./src/features"),
      "~entities": resolve(__dirname, "./src/entities"),
      "~shared": resolve(__dirname, "./src/shared"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-redux": ["@reduxjs/toolkit", "react-redux"],
          "vendor-ui": ["@nextui-org/react", "framer-motion"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
