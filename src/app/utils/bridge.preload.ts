import { ipcRenderer, IpcRenderer } from 'electron'

export interface IpcWindowBridge {
  getId (): Promise<string | undefined>;
  getIdByName (name: string): Promise<string | undefined>;
  send (id: string, channel: string, ...args: any[]): void;
  postMessage (id: string, channel: string, message: any, transferable?: MessagePort[]): void;
  sendByName (name: string, channel: string, ...args: any[]): void;
  postMessageByName (name: string, channel: string, message: any, transferable?: MessagePort[]): void;

  sendToMain (channel: string, ...args: any[]): void;
  invokeMain <T>(channel: string, ...args: any[]): Promise<T>;
  postMessageToMain (channel: string, message: any, transferable?: MessagePort[]): void;
  sendToHost (channel: string, ...args: any[]): void;
  sendTo (webContentsId: number, ...args: any[]): void;
  getIpc (): IpcRenderer
}

export interface IpcWindowBridgePreload extends IpcWindowBridge {
  getIpc (): IpcRenderer
}

namespace IpcWindowBridgeStatic {
  export function getId (): Promise<string | undefined> {
    return ipcRenderer.invoke('content-bindings:get_id')
  }

  export function getIdByName (name: string): Promise<string | undefined> {
    return ipcRenderer.invoke('content-bindings:get_id_byname', name)
  }

  export function send (id: string, channel: string, ...args: any[]) {
    ipcRenderer.send(
      'content-bindings:send_byid',
      id,
      channel,
      ...args
    )
  }

  export function postMessage (id: string, channel: string, message: any, transferable?: MessagePort[]) {
    ipcRenderer.postMessage(
      'content-bindings:post_byid',
      { to: id, ch: channel, message },
      transferable
    )
  }

  export function sendByName (name: string, channel: string, ...args: any[]) {
    ipcRenderer.send(
      'content-bindings:send_byname',
      name,
      channel,
      ...args
    )
  }

  export function postMessageByName (name: string, channel: string, message: any, transferable?: MessagePort[]) {
    ipcRenderer.postMessage(
      'content-bindings:post_byname',
      { to: name, ch: channel, message },
      transferable
    )
  }

  const {
    sendToHost: _sendToHost, sendTo: _sendTo, send: _sendToMain,
    invoke: _invokeMain, postMessage: _postMessageToMain
  } = ipcRenderer

  export const sendToHost = _sendToHost.bind(ipcRenderer)
  export const sendTo = _sendTo.bind(ipcRenderer)
  export const sendToMain = _sendToMain.bind(ipcRenderer)
  export const invokeMain = _invokeMain.bind(ipcRenderer)
  export const postMessageToMain = _postMessageToMain.bind(ipcRenderer)

  export function getIpc () {
    return ipcRenderer
  }
}

const bridge: IpcWindowBridgePreload = IpcWindowBridgeStatic

export default bridge
export { bridge as windowBridge }
