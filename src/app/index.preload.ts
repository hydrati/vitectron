import { contextBridge } from 'electron'
import { windowBridge } from './utils/bridge.preload'

// Define event callbacks
const ipc = windowBridge.getIpc()

ipc.on('greet', (...args) => {
  console.log(args);
  (windowBridge as any).set(args)
})

// Expose Window Bridge
contextBridge.exposeInMainWorld(
  'windowBridge',
  windowBridge
)
