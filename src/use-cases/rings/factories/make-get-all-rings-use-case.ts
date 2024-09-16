import { TypeormRingsRepository } from '@/repositories/typeorm/typeorm-rings-repository'
import { TypeormRingBearersRepository } from '@/repositories/typeorm/typeorm-ring-bearers-repository'
import { TypeormBearersRepository } from '@/repositories/typeorm/typeorm-bearers-repository'
import { GetAllRingsUseCase } from '../get-all'

export function makeGetAllRingsUseCase() {
  const ringsRepository = new TypeormRingsRepository()
  const ringBearersRepository = new TypeormRingBearersRepository()
  const bearersRepository = new TypeormBearersRepository()

  const getAllRingsUseCase = new GetAllRingsUseCase(
    ringsRepository,
    ringBearersRepository,
    bearersRepository,
  )

  return getAllRingsUseCase
}
