/* eslint-disable no-unused-vars */
import type { IpcWindowBridge } from './app/utils/bridge.preload'

declare global {
  const windowBridge: IpcWindowBridge
}
