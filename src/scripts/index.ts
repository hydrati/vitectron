import { builtinModules } from 'module'
import { RollupOptions } from 'rollup'
import { PluginOption } from 'vite'

export interface ElectronBuilderRollupOptions {
  main (dev: boolean): RollupOptions;
  preload (dev: boolean): RollupOptions;
}

export interface ElectronBuilderOptions {
  config: ElectronBuilderRollupOptions;
  external?: string[];
  defaultExternal?: boolean;
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
  console.log(opts)
  return [{
    name: 'vite:electron-builder',
    apply: 'serve',
    enforce: 'post',
    configureServer (server) {
      server.watcher.on('change', (p) => console.log('changed', p))
      server.httpServer?.once('listening', () => {
        console.log('server', server.httpServer?.address())
      })
    }
  }]
}

export { pluginEntry as default }
