import { TypeormRingsRepository } from '@/repositories/typeorm/typeorm-rings-repository'
import { UpdateRingUseCase } from '../update'

export function makeUpdateRingUseCase() {
  const ringsRepository = new TypeormRingsRepository()
  const updateRingsUseCase = new UpdateRingUseCase(ringsRepository)

  return updateRingsUseCase
}
