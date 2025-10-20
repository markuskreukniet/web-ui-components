export function isStrictEqual0(n: number): boolean {
  return isStrictEqual(n, 0)
}

export function isStrictEqual1(n: number): boolean {
  return isStrictEqual(n, 1)
}

function isStrictEqual(i: number, j: number): boolean {
  return i === j
}