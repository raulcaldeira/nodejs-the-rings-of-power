import { CreateBearerUseCase } from '../create'
import { TypeormBearersRepository } from '@/repositories/typeorm/typeorm-bearers-repository'

export function makeCreateRingUseCase() {
  const bearersRepository = new TypeormBearersRepository()
  const createBearerUseCase = new CreateBearerUseCase(bearersRepository)

  return createBearerUseCase
}
