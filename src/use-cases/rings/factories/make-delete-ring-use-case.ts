import { TypeormRingsRepository } from '@/repositories/typeorm/typeorm-rings-repository'
import { DeleteRingUseCase } from '../delete'

export function makeDeleteRingUseCase() {
  const ringsRepository = new TypeormRingsRepository()
  const deleteRingsUseCase = new DeleteRingUseCase(ringsRepository)

  return deleteRingsUseCase
}
