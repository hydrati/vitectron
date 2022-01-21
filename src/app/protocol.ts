import { protocol, CustomScheme, ProtocolRequest, ProtocolResponse } from 'electron'
import { createReadStream, constants } from 'fs'
import { access } from 'fs/promises'
import { getType } from 'mime'

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

  try {
    await access(pathname, constants.R_OK | constants.F_OK)
  } catch {
    pathname = '/index.html'
  }

  return {
    mimeType: getType(pathname) ?? 'text/plain',
    data: createReadStream(pathname)
  }
}

protocol.registerStreamProtocol(
  PROTOCOL_PREFIX,
  (req, callback) => handleRequest(req).then(callback)
)
