import { TypeormRingsRepository } from '@/repositories/typeorm/typeorm-rings-repository'
import { UpdateRingUseCase } from '../update'

export function makeCreateRingUseCase() {
  const ringsRepository = new TypeormRingsRepository()
  const updateRingsUseCase = new UpdateRingUseCase(ringsRepository)

  return updateRingsUseCase
}
