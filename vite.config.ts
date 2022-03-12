import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import eslint from 'vite-plugin-eslint'
import electron from '@vitectron/plugin'
import babel from '@rollup/plugin-babel'

import mainConfig from './rollup.config'

export default defineConfig({
  plugins: [
    eslint({
      exclude: ['src/assets/**/*', 'node_modules/**/*'],
      fix: true
    }),
    vue(),
    babel({
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.tsx', '.ts'],
      babelHelpers: 'bundled'
    }),
    jsx(),
    electron({
      config: mainConfig,
      path: 'src/app',
      args: ['--inspect=5858']
    })
  ]
})
