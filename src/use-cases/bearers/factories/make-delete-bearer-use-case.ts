import { TypeormBearersRepository } from '@/repositories/typeorm/typeorm-bearers-repository'
import { DeleteBearerUseCase } from '../delete'

export function makeDeleteBearerUseCase() {
  const bearersRepository = new TypeormBearersRepository()
  const deleteBearerUseCase = new DeleteBearerUseCase(bearersRepository)

  return deleteBearerUseCase
}
