import type { Either } from '../modules/monads/either'

export type SelectFilePath = () => Promise<Either<Error, string | null>>