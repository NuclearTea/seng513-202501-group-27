import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/UI/",
  resolve: {
    alias: {
      // No alias needed anymore
    },
  },
  server: {
    // No fs.allow needed since all imports are inside /UI
  },
});
