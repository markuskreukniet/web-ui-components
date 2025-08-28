export function isArrayEmpty<T>(array: T[]): boolean {
  return isStrictEqual0(array.length)
}

export function isMapEmpty<K, V>(map: Map<K, V>): boolean {
  return isStrictEqual0(map.size)
}

function isStrictEqual0(n: number): boolean {
  return n === 0
}