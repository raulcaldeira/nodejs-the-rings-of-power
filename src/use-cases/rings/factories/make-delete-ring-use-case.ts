import { TypeormRingsRepository } from '@/repositories/typeorm/typeorm-rings-repository'
import { DeleteRingUseCase } from '../delete'
import { TypeormRingBearersRepository } from '@/repositories/typeorm/typeorm-ring-bearers-repository'

export function makeDeleteRingUseCase() {
  const ringsRepository = new TypeormRingsRepository()
  const ringBearersRepository = new TypeormRingBearersRepository()
  const deleteRingsUseCase = new DeleteRingUseCase(
    ringsRepository,
    ringBearersRepository,
  )

  return deleteRingsUseCase
}
