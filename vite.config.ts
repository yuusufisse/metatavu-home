import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(()=>({
  plugins: [react()],
  server: {
    open: true
  },
  optimizeDeps: {
    include: ["@mui/material/Tooltip"]
  },
  resolve: {
    alias: {
      "src/components": "/src/components",
      "src/atoms": "/src/atoms",
      "src/hooks": "/src/hooks",
      "src/localization": "/src/localization",
      "src/app": "/src/app",
      "src/generated": "/src/generated",
      "src/utils": "/src/utils",
      "src/types": "/src/types",
      "src/theme": "/src/theme",
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
  }
}));
