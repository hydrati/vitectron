import { ipcMain } from 'electron'
import { contentManager as manager } from './contents'

ipcMain.on(
  'content-bindings:send_byid',
  (ev, to: string, channel: string, ...args: any[]) => {
    return manager.send(to, channel, ...args)
  }
)

ipcMain.on(
  'content-bindings:post_byid',
  (ev, { ch, to, message }: { ch: string, to: string, message: any }) => {
    return manager.postMessage(to, ch, message, ev.ports)
  }
)

ipcMain.on(
  'content-bindings:send_byname',
  (ev, to: string, channel: string, ...args: any[]) => {
    const win = manager.getWindowByName(to)
    if (win === undefined) return undefined
    win.webContents.send(channel, ...args)
  }
)

ipcMain.on(
  'content-bindings:post_byname',
  (ev, { ch, to, message }: { ch: string, to: string, message: any }) => {
    const win = manager.getWindowByName(to)
    if (win === undefined) return undefined
    win.webContents.postMessage(ch, message, ev.ports)
  }
)

ipcMain.handle(
  'content-bindings:get_id_byname',
  (ev, name: string) => manager.getWindowIdByName(name)
)

ipcMain.handle(
  'content-bindings:get_id',
  ev => manager.getContentsId(ev.sender)
)
