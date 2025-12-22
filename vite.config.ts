import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

import tsconfigPaths from 'vite-tsconfig-paths'

import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
// svg icon 
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons-ng'
import path from "node:path" //import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_APP_BASE_PATH || '/',
    server: {
      open: true,
      host: true,
      port: 1111,
      proxy: {
        "/api": {
          target: env.VITE_APP_PROXY_URL,
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ""),
          secure: false,
        },
      },
    },

    plugins: [
      react(),
      tailwindcss(),

      tsconfigPaths(), // add {resolve.alias} from tsconfig {paths} automatically 

      vanillaExtractPlugin({
        identifiers: ({ debugId }) => `${debugId}`,
      }),

      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')], // Specify the icon folder to be cached
        symbolId: 'icon-[dir]-[name]', // Specify symbolId format
      }),
    ],

  }
})