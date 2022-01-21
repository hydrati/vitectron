import { ipcMain } from 'electron'
import { ContentManager } from './contents'

ipcMain.handle('contents:get-id', async ev => {
  return ContentManager.getContentsId(ev.sender)
})
