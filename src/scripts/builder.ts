/* eslint-disable no-useless-constructor */

import { RollupBuild, rollup, OutputOptions } from 'rollup'
import { ElectronBuilderRollupOptions } from '.'

export class Builder {
  private _main_bundler: RollupBuild | undefined
  private _preload_bundler: RollupBuild | undefined

  constructor (
    private _opts: ElectronBuilderRollupOptions,
    private _dev: boolean = true
  ) {}

  async init () {
    this._main_bundler ??= await rollup(this._opts.main(this._dev))
    this._preload_bundler ??= await rollup(this._opts.preload(this._dev))
  }

  async generate (outputOptsMain: OutputOptions, outputOptsPreload: OutputOptions) {
    await this.init()
    return await Promise.all([this._main_bundler!.generate(outputOptsMain), this._preload_bundler?.generate(outputOptsPreload)])
  }

  async write (outputOptsMain: OutputOptions, outputOptsPreload: OutputOptions) {
    await this.init()
    return await Promise.all([this._main_bundler!.write(outputOptsMain), this._preload_bundler?.write(outputOptsPreload)])
  }

  get writeFiles () {
    return [this._main_bundler?.watchFiles, this._preload_bundler?.watchFiles]
  }
}
