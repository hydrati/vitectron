import { builtinModules } from 'module'
import { RollupOptions } from 'rollup'
import { PluginOption } from 'vite'
import { DEBUG, log, toArray } from './utils'
import { exitHandler, prs, restartHandler, startServe } from './serve'
import path from 'path'
import { rollupMultiGen } from './builder'
import color from 'picocolors'
export interface ElectronBuilderRollupOptions {
  main (dev: boolean): RollupOptions;
  preload (dev: boolean): RollupOptions;
}

export interface ElectronBuilderOptions {
  url?: string;
  config: ElectronBuilderRollupOptions;
  path: string;
  external?: string[];
  defaultExternal?: boolean;
  args?: string[];
  autostart?: boolean;
  ignoreStdio?: boolean;
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
  opts.autostart ??= false
  opts.ignoreStdio ??= false

  if (DEBUG) log(color.gray('[build]'), 'using options', opts)
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
      if (server.httpServer === null && opts.url === undefined) {
        throw new TypeError('electron-builder needs `opts.url` field in middleware mode')
      }
      if (server.httpServer === null) {
        startServe(server, opts)
      } else {
        server.httpServer.once('listening', () => startServe(server, opts))
      }
    },
    buildStart: () => console.log('build start'),
    buildEnd: () => {
      if (typeof prs.pid === 'number') {
        log(color.gray('[serve]'), color.bold('shutdown electron...'))
        prs.removeListener('exit', opts.autostart ? restartHandler : exitHandler)
        process.kill(prs.pid!)
      }
    }
  }, {
    name: 'vite:electron-builder',
    apply: 'build',
    enforce: 'pre',
    async generateBundle (o, er) {
      const start = Date.now()
      console.log('')
      log(color.gray('[build]'), color.green('transform main modules...'))
      const configs = [...toArray(opts.config.main(false)), ...toArray(opts.config.preload(false))].map(
        v => { (v.external = opts.external!); return v }
      )
      const r = await rollupMultiGen(configs)
      for (const [n, ri] of r.entries()) {
        const j = toArray(configs[n])
        for (const [c, rj] of ri.entries()) {
          const o = toArray(j[c].output)
          for (const [u, rk] of rj.output.entries()) {
            if (o[u] === undefined || o[u]?.file === undefined) {
              throw new Error('electron-builder needs `output.file` field')
            }

            rk.fileName = path.posix.join('main', rk.fileName)
            er[path.posix.relative('dist', o[u]!.file!)] = rk
          }
        }
      }
      log(color.gray('[build]'), color.green(color.bold('✓')), color.bold('all main modules transformed.'), color.gray(`(${r.length} modules)`), color.blue(`+${Date.now() - start}ms`))
    }
  }]
}

export { pluginEntry as default }
