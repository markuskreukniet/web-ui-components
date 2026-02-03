import type { Either } from '../monads/either'

export type VoidFunction = () => void

// TODO: string | null should be filePath type?
export type SelectFilePath = () => Promise<Either<Error, string | null>>

export type SelectFilePathProps = {
  selectFilePath: SelectFilePath
}

export type IsLoadingProps = {
  isLoading: boolean
}