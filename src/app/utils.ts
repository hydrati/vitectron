export class IterableWeakMap<K extends object, V> extends WeakMap<K, V> {
  #keys: Set<WeakRef<K>>

  constructor (entries?: readonly [K, V][] | null) {
    super()
    this.#keys = new Set<WeakRef<K>>()
    if (entries !== undefined && entries !== null) {
      for (const [k, v] of entries) {
        if (!this.has(k)) {
          this.#keys.add(new WeakRef(k))
          this.set(k, v)
        }
      }
    }
  }

  set (key: K, val: V): this {
    if (this.has(key) && key === null) return this
    this.#keys.add(new WeakRef(key))
    super.set(key, val)
    return this
  }

  delete (key: K): boolean {
    if (this.has(key)) {
      for (const k of this.#keys) {
        const v = k.deref()
        if (v === undefined) {
          this.#keys.delete(k)
          continue
        } else if (v === key) {
          this.#keys.delete(k)
          break
        }
      }
    }

    return super.delete(key)
  }

  * keys (): IterableIterator<K> {
    for (const k of this.#keys) {
      const o = k.deref()
      if (o !== undefined) {
        if (this.has(o)) yield o
        else this.#keys.delete(k)
      }
    }
  }

  * values (): IterableIterator<V> {
    for (const k of this.keys()) {
      yield this.get(k)!
    }
  }

  * entries (): IterableIterator<readonly [K, V]> {
    for (const k of this.keys()) {
      yield [k, this.get(k)!]
    }
  }

  [Symbol.iterator] () {
    return this.entries()
  }
}
