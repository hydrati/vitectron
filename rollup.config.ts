import { defineConfig } from 'rollup'
import path from 'path'

import replace from '@rollup/plugin-replace'
import esbuild from 'rollup-plugin-esbuild'
import eslint from '@rollup/plugin-eslint'
import json from '@rollup/plugin-json'
import cjs from '@rollup/plugin-commonjs'
import node from '@rollup/plugin-node-resolve'

const main = (dev: boolean) => defineConfig({
  input: path.resolve(__dirname, 'src', 'app', 'index.main.ts'),
  plugins: [
    eslint(),
    json(),
    node(),
    cjs(),
    !dev
      ? replace({
        'process.env.NODE_ENV': process.env.NODE_ENV,
        'process.env.VITE_URL': ' '
      })
      : undefined,
    esbuild({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      minify: true,
      minifyIdentifiers: true,
      minifyWhitespace: true,
      minifySyntax: true,
      sourceMap: true
    })
  ]
})

const preload = (_dev: boolean) => defineConfig({
  input: path.resolve(__dirname, 'src', 'app', 'index.preload.ts'),
  plugins: [
    eslint(),
    json(),
    node(),
    cjs(),
    esbuild({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      minify: true,
      minifyIdentifiers: true,
      minifyWhitespace: true,
      minifySyntax: true,
      sourceMap: true
    })
  ]
})

export default { main, preload }
