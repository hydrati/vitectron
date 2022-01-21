import { app, protocol } from 'electron'
import { ContentManager } from './contents'
import { protocolScheme } from './protocol'

const bootstrap = async () => {
  protocol.registerSchemesAsPrivileged([
    protocolScheme
  ])

  const [window] = ContentManager.createWindow({
    width: 1280,
    height: 768,
    webPreferences: {
      devTools: true
    }
  })

  window.loadURL('http://baidu.com/')
}

app.whenReady().then(bootstrap)
