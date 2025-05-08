import type { Either } from '../monads/either'

export type SelectFilePath = () => Promise<Either<Error, string | null>>