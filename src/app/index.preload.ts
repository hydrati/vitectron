import { contextBridge } from 'electron'
import { windowBridge } from './utils/bridge.preload'

// Define event callbacks
const ipc = windowBridge._getIpc()

ipc.on('greet', (...args) => {
  console.log('greet', args)
})

// Expose Window Bridge
contextBridge.exposeInMainWorld(
  'windowBridge',
  windowBridge
)
