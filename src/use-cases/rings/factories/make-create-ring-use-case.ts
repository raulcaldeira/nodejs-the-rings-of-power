import { TypeormRingsRepository } from '@/repositories/typeorm/typeorm-rings-repository'
import { CreateRingUseCase } from '../create'
import { TypeormBearersRepository } from '@/repositories/typeorm/typeorm-bearers-repository'
import { TypeormRingBearersRepository } from '@/repositories/typeorm/typeorm-ring-bearers-repository'

export function makeCreateRingUseCase() {
  const ringsRepository = new TypeormRingsRepository()
  const bearersRepository = new TypeormBearersRepository()
  const ringBearersRepository = new TypeormRingBearersRepository()

  const createRingUseCase = new CreateRingUseCase(
    ringsRepository,
    bearersRepository,
    ringBearersRepository,
  )

  return createRingUseCase
}
