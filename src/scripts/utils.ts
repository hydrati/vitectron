import color from 'picocolors'

const PREFIX = color.bold(color.cyan('vite:electron-builder'))
export const DEBUG = process.argv.includes('--debug') || process.argv.includes('-d')
export function log (...args: any[]): void {
  if (DEBUG) {
    console.log('  ' + PREFIX, ...args)
  } else {
    console.log(...args)
  }
}

export function toArray<T> (o: T | T[]): T[] {
  return o instanceof Array ? o : [o]
}

export function sleep (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
