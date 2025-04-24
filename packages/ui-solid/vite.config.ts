import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [solid()],
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UiSolid',
      fileName: 'ui-solid',
      formats: ['es', 'cjs']
    },
    outDir: 'dist/vite',
    rollupOptions: {
      external: ['solid-js'],
      output: {
        globals: {
          'solid-js': 'SolidJs',
        },
      },
    },
  },
})