import { isStrictEqual0, isStrictEqual1 } from './utils'

export function isArrayEmpty<T>(array: T[]): boolean {
  return isStrictEqual0(array.length)
}

export function isMapEmpty<K, V>(map: Map<K, V>): boolean {
  return isStrictEqual0(map.size)
}

export function hasArraySingleElement<T>(array: T[]): boolean {
  return isStrictEqual1(array.length)
}

export function hasMapSingleEntry<K, V>(map: Map<K, V>): boolean {
  return isStrictEqual1(map.size)
}