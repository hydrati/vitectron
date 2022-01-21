/* eslint-disable no-use-before-define */
/* eslint-disable no-useless-constructor */
import { BrowserWindow, BrowserWindowConstructorOptions, WebContents } from 'electron'
import { v4 } from 'uuid'
import { IterableWeakMap } from './utils'

export class ContentManager {
  private static _windows = new Map<BrowserWindow, string>()
  private static _contents = new IterableWeakMap<WebContents, string>()

  static createWindow (opts?: BrowserWindowConstructorOptions): [BrowserWindow, string] {
    const id = v4()
    const win = new BrowserWindow(opts)

    win.once('closed', () => this._windows.delete(win))

    this._windows.set(win, id)
    this._contents.set(win.webContents, id)

    return [win, id]
  }

  static unholdWindow (window: BrowserWindow) {
    return this._windows.delete(window)
  }

  static mountWebContents (contents: WebContents): string {
    if (this._contents.has(contents)) {
      return this._contents.get(contents)!
    } else {
      const id = v4()
      this._contents.set(contents, id)
      return id
    }
  }

  static mountWindow (win: BrowserWindow): string {
    if (this._windows.has(win)) {
      return this._windows.get(win)!
    } else {
      if (this._contents.has(win.webContents)) {
        const id = this._contents.get(win.webContents)!
        this._windows.set(win, id)
        return id
      } else {
        const id = v4()
        this._windows.set(win, id)
        this._contents.set(win.webContents, id)
        return id
      }
    }
  }

  static getWindowById (id: string): BrowserWindow | undefined {
    for (const [k, v] of this._windows) {
      if (v === id) return k
    }
  }

  static getContentsById (id: string): WebContents | undefined {
    for (const [k, v] of this._contents) {
      if (v === id) return k
    }
  }

  static getContentsId (contents: WebContents) {
    return this._contents.get(contents)
  }

  static getWindowId (window: BrowserWindow) {
    return this._windows.get(window)
  }

  static hasWindowContent (contents: WebContents): boolean {
    if (!this._contents.has(contents)) return false
    if (this.getWindowById(this._contents.get(contents)!) !== undefined) return true
    return false
  }
}
