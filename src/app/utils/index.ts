import { PROTOCOL_PREFIX } from './protocol'

export function getStartupUrl (): string {
  if (process.env.NODE_ENV === 'development') {
    return `${process.env.VITE_URL}`
  } else {
    return `${PROTOCOL_PREFIX}://.`
  }
}
