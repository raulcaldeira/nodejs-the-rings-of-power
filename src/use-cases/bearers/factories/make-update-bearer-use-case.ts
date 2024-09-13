import { TypeormBearersRepository } from '@/repositories/typeorm/typeorm-bearers-repository'
import { UpdateBearerUseCase } from '../update'

export function makeCreateRingUseCase() {
  const bearersRepository = new TypeormBearersRepository()
  const updateBearerUseCase = new UpdateBearerUseCase(bearersRepository)

  return updateBearerUseCase
}
