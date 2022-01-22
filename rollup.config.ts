import { defineConfig } from 'rollup'
import path from 'path'

import replace from '@rollup/plugin-replace'
import esbuild from 'rollup-plugin-esbuild'
import eslint from '@rollup/plugin-eslint'
import json from '@rollup/plugin-json'
import cjs from '@rollup/plugin-commonjs'
import node from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'

const main = (dev: boolean) => defineConfig({
  input: path.resolve(__dirname, 'src', 'app', 'index.main.ts'),
  plugins: [
    eslint(),
    json(),
    alias({
      entries: [
        { find: 'uuid', replacement: require.resolve('uuid') }
      ]
    }),
    node({
      browser: false,
      mainFields: ['module', 'main']
    }),
    cjs(),
    esbuild({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      minify: !dev,
      minifyIdentifiers: !dev,
      minifyWhitespace: !dev,
      minifySyntax: !dev,
      sourceMap: dev
    }),
    !dev
      ? replace({
        values: {
          'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
          'process.env.VITE_URL': 'null'
        },
        preventAssignment: true
      })
      : undefined
  ],
  output: {
    file: 'dist/main/index.js',
    format: 'cjs',
    sourcemap: dev
  }
})

const preload = (dev: boolean) => defineConfig({
  input: path.resolve(__dirname, 'src', 'app', 'index.preload.ts'),
  plugins: [
    eslint(),
    json(),
    node({
      browser: false
    }),
    cjs({
      
    }),
    alias({
      entries: [
        { find: 'uuid', replacement: require.resolve('uuid') }
      ]
    }),
    esbuild({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      minify: !dev,
      minifyIdentifiers: !dev,
      minifyWhitespace: !dev,
      minifySyntax: !dev,
      sourceMap: dev
    })
  ],
  output: {
    file: 'dist/main/preload_main.js',
    format: 'cjs',
    sourcemap: dev
  }
})

export default { main, preload }
