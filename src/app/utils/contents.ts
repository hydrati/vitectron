/* eslint-disable no-use-before-define */
/* eslint-disable no-useless-constructor */
import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  WebContents,
  ipcMain,
  IpcMainEvent,
  MessagePortMain,
  OpenDevToolsOptions
} from 'electron'
import { v4 } from 'uuid'
import { IterableWeakMap } from './map'

class ContentManager {
  private _windows = new Map<BrowserWindow, string>()
  private _contents = new IterableWeakMap<WebContents, string>()
  private _names = new Map<PropertyKey, string>()

  createWindow (opts?: BrowserWindowConstructorOptions, name?: PropertyKey): [BrowserWindow, string] {
    const id = v4()
    const win = new BrowserWindow(opts)

    win.once('closed', () => {
      this._windows.delete(win)
    })

    this._windows.set(win, id)
    this._contents.set(win.webContents, id)
    if (name !== undefined) {
      this.setWindowByName(name, win)
    }
    return [win, id]
  }

  setWindowByName (name: PropertyKey, win: BrowserWindow): boolean {
    if (this._windows.has(win)) {
      this._names.set(name, this._windows.get(win)!)
      return true
    } else return false
  }

  getWindowByName (name: PropertyKey) {
    const id = this._names.get(name)
    if (id === undefined) return undefined
    const w = this.getWindowById(id)
    if (w === undefined) {
      this._names.delete(name)
      return undefined
    } else {
      return w
    }
  }

  getWindowIdByName (name: PropertyKey) {
    if (this.getWindowByName(name) !== undefined) {
      return this._names.get(name)!
    }
  }

  removeWindowName (name: PropertyKey) {
    return this._names.delete(name)
  }

  unholdWindow (window: BrowserWindow) {
    return this._windows.delete(window)
  }

  unholdWebContents (contents: WebContents) {
    return this._contents.delete(contents)
  }

  mountWebContents (contents: WebContents): string {
    if (this._contents.has(contents)) {
      return this._contents.get(contents)!
    } else {
      const id = v4()
      this._contents.set(contents, id)
      return id
    }
  }

  mountWindow (win: BrowserWindow): string {
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

  getWindowById (id: string): BrowserWindow | undefined {
    for (const [k, v] of this._windows) {
      if (v === id) return k
    }
  }

  getContentsById (id: string): WebContents | undefined {
    for (const [k, v] of this._contents) {
      if (v === id) return k
    }
  }

  getContentsId (contents: WebContents) {
    return this._contents.get(contents)
  }

  getWindowId (window: BrowserWindow) {
    return this._windows.get(window)
  }

  hasWindowContent (contents: WebContents): boolean {
    if (!this._contents.has(contents)) return false
    if (this.getWindowById(this._contents.get(contents)!) !== undefined) return true
    return false
  }

  send (id: string, channel: string, ...args: any[]): boolean {
    const wc = this.getContentsById(id)
    if (wc !== undefined) {
      wc.send(channel, ...args)
      return true
    }
    return false
  }

  postMessage (id: string, channel: string, message: any, transferable?: MessagePortMain[]) {
    const wc = this.getContentsById(id)
    if (wc !== undefined) {
      wc.postMessage(channel, message, transferable)
      return true
    }
    return false
  }

  openDevTools (id: string, options?: OpenDevToolsOptions): boolean {
    const wc = this.getContentsById(id)
    if (wc !== undefined) {
      wc.openDevTools(options)
      return true
    }
    return false
  }

  on (contentsId: string, channel: string, callback: (ev: IpcMainEvent, id: string, ...args: any[]) => void) {
    const f = (ev: IpcMainEvent, ...args: any[]) => {
      const id = this.getContentsId(ev.sender)
      if (id !== undefined && contentsId === id) {
        callback(ev, id, ...args)
      }
    }
    ipcMain.on(channel, f)
    return () => { ipcMain.removeListener(channel, f) }
  }

  once (contentsId: string, channel: string, callback: (ev: IpcMainEvent, id: string, ...args: any[]) => void) {
    const f = (ev: IpcMainEvent, ...args: any[]) => {
      const id = this.getContentsId(ev.sender)
      if (id !== undefined && contentsId === id) {
        callback(ev, id, ...args)
        dispose()
      }
    }
    ipcMain.on(channel, f)
    const dispose = () => { ipcMain.removeListener(channel, f) }
    return dispose
  }
}

const manager = new ContentManager()

export default manager
export { manager as contentManager }
export type { ContentManager }
