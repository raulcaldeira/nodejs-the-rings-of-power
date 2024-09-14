import { TypeormRingsRepository } from '@/repositories/typeorm/typeorm-rings-repository'
import { SetRingBearerUseCase } from '../set-ring-bearer'
import { TypeormRingBearersRepository } from '@/repositories/typeorm/typeorm-ring-bearers-repository'
import { TypeormBearersRepository } from '@/repositories/typeorm/typeorm-bearers-repository'

export function makeSetRingBearerUseCase() {
  const ringBearersRepository = new TypeormRingBearersRepository()
  const ringsRepository = new TypeormRingsRepository()
  const bearersRepository = new TypeormBearersRepository()
  const setRingBearerUseCase = new SetRingBearerUseCase(
    ringBearersRepository,
    ringsRepository,
    bearersRepository,
  )

  return setRingBearerUseCase
}
