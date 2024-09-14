import { TypeormRingsRepository } from '@/repositories/typeorm/typeorm-rings-repository'
import { GetAllRingsUseCase } from '../get-all'

export function makeGetAllRingsUseCase() {
  const ringsRepository = new TypeormRingsRepository()
  const getAllRingsUseCase = new GetAllRingsUseCase(ringsRepository)

  return getAllRingsUseCase
}
