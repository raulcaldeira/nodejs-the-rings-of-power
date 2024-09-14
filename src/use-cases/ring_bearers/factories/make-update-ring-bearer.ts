import { TypeormRingBearersRepository } from '@/repositories/typeorm/typeorm-ring-bearers-repository'
import { UpdateRingBearerUseCase } from '../update'

export function makeSetEndDateUseCase() {
  const ringBearersRepository = new TypeormRingBearersRepository()
  const updateRingBearerUseCase = new UpdateRingBearerUseCase(
    ringBearersRepository,
  )

  return updateRingBearerUseCase
}
