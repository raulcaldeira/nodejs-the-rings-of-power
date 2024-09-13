import { TypeormRingsRepository } from '@/repositories/typeorm/typeorm-rings-repository'
import { DeleteRingUseCase } from '../delete'

export function makeCreateRingUseCase() {
  const ringsRepository = new TypeormRingsRepository()
  const deleteRingsUseCase = new DeleteRingUseCase(ringsRepository)

  return deleteRingsUseCase
}
