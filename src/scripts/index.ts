import { builtinModules } from 'module'
import { RollupOptions } from 'rollup'
import { PluginOption } from 'vite'
import { DEBUG, log, toArray } from './utils'
import { startServe } from './serve'
import path from 'path'
import { rollupMultiWrite } from './builder'
import color from 'picocolors'
export interface ElectronBuilderRollupOptions {
  main (dev: boolean): RollupOptions;
  preload (dev: boolean): RollupOptions;
}

export interface ElectronBuilderOptions {
  config: ElectronBuilderRollupOptions;
  path: string;
  external?: string[];
  defaultExternal?: boolean;
  args?: string[]
}

const EXTERNAL = [
  ...builtinModules,
  'electron'
]

function pluginEntry (opts: ElectronBuilderOptions): PluginOption[] {
  opts.external ??= []
  opts.defaultExternal ??= true
  if (opts.defaultExternal) {
    opts.external = [...opts.external, ...EXTERNAL]
  }
  opts.path = path.resolve(process.cwd(), opts.path)
  if (DEBUG) log('using options', opts)
  return [{
    name: 'vite:electron-builder',
    apply: 'serve',
    enforce: 'post',
    config (config) {
      config.server ??= {}
      config.server.watch ??= {}
      config.server.watch.ignored ??= []
      config.server.watch.ignored = [...toArray(config.server.watch.ignored), 'dist/**/*', 'release/**/*', 'resources/**/*']
    },
    async configureServer (server) {
      log('waiting server listen...')
      server.httpServer?.once?.('listening', () => startServe(server, opts))
    }
  }, {
    name: 'vite:electron-builder',
    apply: 'build',
    enforce: 'pre',
    async buildStart (o) {
      console.log('')
      const start = Date.now()
      log(color.gray('[build]'), 'build main modules from source...')
      const configs = [...toArray(opts.config.main(false)), ...toArray(opts.config.preload(false))].map(
        v => { (v.external = opts.external!); return v }
      )
      const r = await rollupMultiWrite(configs)
      log(color.gray('[build]'), color.green(color.bold('✓')), color.bold('all main modules transformed.'), color.gray(`(${r.length} modules)`), color.blue(`+${Date.now() - start}ms`))
    }
  }]
}

export { pluginEntry as default }
