import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
    assetsInclude: ["**/*.glb"],
    // depending on your application, base can also be "/"
    base: '',
    plugins: [
        svgr({
            svgrOptions: { exportType: 'named', ref: true, svgo: false, titleProp: true },
            include: '**/*.svg',
        }),
        react(), 
        viteTsconfigPaths()
    ],
    server: {
        port: 3000,
        host: true,
        strictPort: true,
        hmr: {
          port: 3010,
        },
        watch: {
          usePolling: true,
          // useFsEvents: true,
          // interval: 100,
        },
        proxy: {
            '/api': {
                target: 'http://backend:8000',
                changeOrigin: false,
                rewrite: (path) => path.replace(/^\/api/, ''),
              },
        }
    },
    esbuild: {
        target: 'esnext',
    }
})