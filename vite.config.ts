import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // keep CRA's output folder so the Pages workflow is unchanged
  build: { outDir: "build" },
});
