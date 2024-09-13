import { TypeormRingsRepository } from '@/repositories/typeorm/typeorm-rings-repository'
import { CreateRingUseCase } from '../create'

export function makeCreateRingUseCase() {
  const ringsRepository = new TypeormRingsRepository()
  const createGymUseCase = new CreateRingUseCase(ringsRepository)

  return createGymUseCase
}
