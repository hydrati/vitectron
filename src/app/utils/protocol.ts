import { protocol, CustomScheme, ProtocolRequest, ProtocolResponse } from 'electron'
import { createReadStream, constants } from 'fs'
import { access } from 'fs/promises'
import { getType } from 'mime'
import path from 'path'

export const PROTOCOL_PREFIX = 'app'
export const protocolScheme: CustomScheme = {
  scheme: PROTOCOL_PREFIX,
  privileges: {
    allowServiceWorkers: true,
    bypassCSP: true,
    corsEnabled: true,
    secure: true,
    standard: true,
    stream: true,
    supportFetchAPI: true
  }
}

async function handleRequest (request: ProtocolRequest): Promise<ProtocolResponse> {
  const url = new URL(request.url)
  let pathname = decodeURIComponent(url.pathname)
  if (pathname === '/') {
    // SPA Fallback
    pathname = '/index.html'
  }

  const toPath = path.resolve(__dirname, '..', '.' + pathname)

  try {
    await access(toPath, constants.R_OK | constants.F_OK)
  } catch {
    pathname = '/index.html'
  }

  return {
    mimeType: getType(toPath) ?? 'text/plain',
    data: createReadStream(toPath)
  }
}

export function registerScheme () {
  protocol.registerStreamProtocol(
    PROTOCOL_PREFIX,
    (req, callback) => handleRequest(req).then(callback)
  )
}
