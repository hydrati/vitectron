import { app, protocol, dialog } from 'electron'
import { getStartupUrl } from './utils'
import { contentManager } from './utils/contents'
import { protocolScheme, registerScheme } from './utils/protocol'

import path from 'path'
import os from 'os'
import process from 'process'
import './utils/bridge'

protocol.registerSchemesAsPrivileged([
  protocolScheme
])

const bootstrap = async () => {
  registerScheme()
  const root = getStartupUrl()

  const [window, id] = contentManager.createWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      devTools: true,
      preload: path.resolve(__dirname, 'preload_main.js')
    }
  }, 'main')

  window.loadURL(`${root}/index.html`)

  window.once('ready-to-show', () => window.show())

  contentManager.on(id, 'show-app-version', () => {
    const detail = `App Version: ${app.getVersion()}
Electron: ${process.versions.electron}
Chromium: ${process.versions.chrome}
V8: ${process.versions.v8}
Node: ${process.versions.node}
OpenSSL: ${process.versions.openssl}
Zlib: ${process.versions.zlib}
OS: ${os.version()} (${os.arch()})`

    dialog.showMessageBox(window, {
      title: 'Vitectron',
      detail,
      message: 'Vitectron',
      type: 'info'
    })
  })
}

app.whenReady().then(bootstrap)
