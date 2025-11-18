import { isStrictEqual0 } from './utils'

export function isArrayEmpty<T>(array: T[]): boolean {
  return isStrictEqual0(array.length)
}

export function isMapEmpty<K, V>(map: Map<K, V>): boolean {
  return isStrictEqual0(map.size)
}

export function isSetEmpty<T>(set: Set<T>): boolean {
  return isStrictEqual0(set.size)
}