import { ViteDevServer } from 'vite'
import { log, sleep, toArray } from './utils'
import color from 'picocolors'
import path from 'path'
import { ElectronBuilderOptions } from '.'
import { rollupMultiWrite } from './builder'
import { AddressInfo } from 'net'
import type { ExecaChildProcess } from 'execa'

const electronPath = require('electron') as unknown as string
const execaDyn = import('execa')

export function isRelative (p: string, f: string): boolean {
  p = path.resolve(process.cwd(), p); f = path.resolve(process.cwd(), f)
  return f.startsWith(p)
}

export let prs: ExecaChildProcess
let debouce: Promise<unknown> | undefined
let got: boolean = false

export const exitHandler = (code: number) => {
  log(color.gray('[serve]'), `electron exit, code ${code}`)
  process.exit()
}
export let restartHandler: () => Promise<void>

export async function startServe (server: ViteDevServer, opts: ElectronBuilderOptions): Promise<void> {
  log(color.gray('[serve]'), color.bold('start electron preview'))
  const configs = [...toArray(opts.config.main(true)), ...toArray(opts.config.preload(true))].map(
    v => { (v.external = opts.external!); return v }
  )
  const address = server.httpServer!.address() as AddressInfo
  const { execa } = await execaDyn

  restartHandler = async () => {
    log(color.gray('[serve]'), color.bold('refresh electron main modules...'))
    const start = Date.now()
    log(color.gray('[build]'), color.green('transform main modules...'))
    const r = await rollupMultiWrite(configs)
    log(color.gray('[build]'), color.green(color.bold('✓')), color.bold('all main modules transformed.'), color.gray(`(${r.length} modules)`), color.blue(`+${Date.now() - start}ms`))
    prs = execa(electronPath, [...opts.args ?? [], process.cwd()], {
      env: {
        VITE_URL: opts.url ?? `http://localhost:${address.port}`,
        NODE_ENV: 'development'
      },
      stdio: opts.ignoreStdio ? 'ignore' : 'inherit'
    }).on('exit', opts.autostart ? restartHandler : exitHandler)
    log(color.gray('[serve]'), color.green(color.bold('✓')), color.cyan(color.bold('electron launched!')), color.gray(`(pid=${prs.pid})`), color.blue(`+${Date.now() - start}ms`))
    await sleep(500)
  }

  restartHandler()

  server.watcher.on('change', async (file, stat) => {
    // log('[file changed]', color.gray(file))
    // if (isRelative(__dirname, file)) {
    //   log(color.gray('[serve]'), color.bold('scripts changed, restart server...'))
    //   if (prs.pid !== undefined) {
    //     log(color.gray('[serve]'), color.cyan('restart electron...'), color.gray(`(pid=${prs.pid})`))
    //     if (debouce !== undefined) await debouce
    //     await sleep(1500)
    //     prs.removeListener('exit', exitHandler)
    //     process.kill(prs.pid!)
    //   }
    //   server.restart()
    // } else 
    if (isRelative(opts.path, file)) {
      if (debouce !== undefined) {
        log(color.gray('[build]'), color.gray(color.bold('build task running, waiting...')))
        await debouce
      }
      if (prs.pid !== undefined && !got) {
        got = true
        log(color.gray('[serve]'), color.bold('shutdown electron...'))
        await sleep(1000)
        prs.removeListener('exit', opts.autostart ? restartHandler : exitHandler)
        process.kill(prs.pid!)
        debouce = restartHandler()
        await debouce
        debouce = undefined
        got = false
      }
    }
  })
}
