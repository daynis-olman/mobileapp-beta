import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // Set base to your GitHub Pages repo name. If deploying to
  // https://<user>.github.io/mobileapp-beta/, use "/mobileapp-beta/".
  // If deploying to a custom domain or root, use "/".
  base: "/mobileapp-beta/",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    outDir: "dist",
  },
});
