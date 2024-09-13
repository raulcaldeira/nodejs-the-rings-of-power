import { TypeormRingsRepository } from '@/repositories/typeorm/typeorm-rings-repository'
import { CreateRingUseCase } from '../create'

export function makeCreateRingUseCase() {
  const ringsRepository = new TypeormRingsRepository()
  const createRingUseCase = new CreateRingUseCase(ringsRepository)

  return createRingUseCase
}
