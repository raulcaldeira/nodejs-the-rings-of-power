import { TypeormRingBearersRepository } from '@/repositories/typeorm/typeorm-ring-bearers-repository'
import { UpdateRingBearerUseCase } from '../update'

export function makeUpdateRingBearerUseCase() {
  const ringBearersRepository = new TypeormRingBearersRepository()
  const updateRingBearerUseCase = new UpdateRingBearerUseCase(
    ringBearersRepository,
  )

  return updateRingBearerUseCase
}
