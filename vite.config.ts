/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react({
        jsxImportSource: "@emotion/react",
      }),
      tsconfigPaths(),
    ],
    define: {
      "process.env": env,
    },
    test: {
      environment: "jsdom",
    },
  };
});
