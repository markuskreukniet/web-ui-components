type Left<L> = { type: 'Left', value: L }
type Right<R> = { type: 'Right', value: R }
export type Either<L, R> = Left<L> | Right<R>

export const left = <L, R = never>(value: L): Either<L, R> => ({ type: 'Left', value })
export const right = <R, L = never>(value: R): Either<L, R> => ({ type: 'Right', value })

export const isLeft = <L, R>(e: Either<L, R>): e is Left<L> => e.type === 'Left'
export const isRight = <L, R>(e: Either<L, R>): e is Right<R> => e.type === 'Right'

export const mapRight = <L, R, U>(e: Either<L, R>, f: (r: R) => U): Either<L, U> =>
  isRight(e) ? right(f(e.value)) : e

export const flatMapRight = <L, R, U>(e: Either<L, R>, f: (r: R) => Either<L, U>): Either<L, U> =>
  isRight(e) ? f(e.value) : e