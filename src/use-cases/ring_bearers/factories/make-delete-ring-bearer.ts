import { TypeormRingBearersRepository } from '@/repositories/typeorm/typeorm-ring-bearers-repository'
import { DeleteRingBearerUseCase } from '../delete'

export function makeDeleteRingBearerUseCase() {
  const ringBearersRepository = new TypeormRingBearersRepository()
  const deleteRingBearerUseCase = new DeleteRingBearerUseCase(
    ringBearersRepository,
  )

  return deleteRingBearerUseCase
}
