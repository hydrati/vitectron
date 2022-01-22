import { RollupOptions, RollupBuild, rollup, RollupOutput } from 'rollup'
import { log, toArray } from './utils'
import color from 'picocolors'
import path from 'path'

export async function rollupMulti (config: RollupOptions | RollupOptions[]): Promise<RollupBuild[]> {
  config = toArray(config)
  return await Promise.all(config.map(inputOptions => {
    // let inputFiles: string = '[unknown]'
    // if (inputFiles === undefined) {
    //   throw new Error('Not found input')
    // } else if (typeof inputOptions.input === 'string') {
    //   inputFiles = path.relative(process.cwd(), inputOptions.input as string)
    // } else if (inputOptions.input instanceof Array) {
    //   inputFiles = (inputOptions.input as string[]).map(v => path.relative(process.cwd(), v)).join(', ')
    // } else if (typeof inputOptions.input === 'object' && inputOptions.input !== null) {
    //   inputFiles = Object.values(inputOptions.input as object).map(v => path.relative(process.cwd(), v)).join(', ')
    // }

    return rollup(inputOptions)
  }))
}

export async function rollupMultiWrite (config: RollupOptions | RollupOptions[]): Promise<RollupOutput[][]> {
  const configs: RollupOptions[] = toArray(config)
  const start = Date.now()
  const roll = await rollupMulti(config)
  return await Promise.all(roll.map(
    (r, i) => {
      let inputFiles: string = '[unknown]'
      if (inputFiles === undefined) {
        throw new Error('Not found input')
      } else if (typeof configs[i].input === 'string') {
        inputFiles = path.relative(process.cwd(), configs[i].input as string)
      } else if (configs[i].input instanceof Array) {
        inputFiles = (configs[i].input as string[]).map(v => path.relative(process.cwd(), v)).join(', ')
      } else if (typeof configs[i].input === 'object' && configs[i].input !== null) {
        inputFiles = Object.values(configs[i].input as object).map(v => path.relative(process.cwd(), v)).join(', ')
      }
      
      return Promise.all(toArray(configs[i].output).map(v => { 
        if (v === undefined) { throw new Error('not found output') }
        return r.write(v)
      })).then(async v => {
        log(color.gray('[build]'), color.green(color.bold('✓')), color.bold(color.blue('module transformed!')), color.cyan(inputFiles), color.bold('->'), color.green(toArray(configs[i].output).map(v => v !== undefined ? v.file ?? v.dir ?? '[unknown]' : '[unknown]').join(', ')), color.blue(`+${Date.now() - start}ms`))
        return v
      })
    }
  )).then(r => {
    return r
  })
}
