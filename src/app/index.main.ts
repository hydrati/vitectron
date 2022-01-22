import { app, protocol } from 'electron'
import path from 'path'
import { getStartupUrl } from './utils'
import { contentManager } from './utils/contents'
import { protocolScheme, registerScheme } from './utils/protocol'

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
      nodeIntegration: true,
      preload: path.resolve(__dirname, 'index.preload.js')
    }
  }, 'main')

  window.loadURL(`${root}/index.html`)

  window.once('ready-to-show', () => window.show())

  contentManager.on(id, 'main-greet', (ev) => {
    console.log(`Hello, from ${id}`)
    ev.reply('greet', id)
  })
}

app.whenReady().then(bootstrap)
