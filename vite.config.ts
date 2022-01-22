import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import eslint from 'vite-plugin-eslint'
import electron from './src/scripts'

import mainConfig from './rollup.config'

export default defineConfig({
  plugins: [
    eslint({
      exclude: ['src/assets/**/*', 'node_modules/**/*'],
      fix: true
    }),
    vue(),
    jsx(),
    electron({
      config: mainConfig,
      path: 'src/app',
      args: ['--inspect=5858']
    })
  ]
})
