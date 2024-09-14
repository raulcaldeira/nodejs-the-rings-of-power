import { TypeormRingBearersRepository } from '@/repositories/typeorm/type-orm-ring-bearers-repository'
import { SetEndDateUseCase } from '../set-end-date'

export function makeSetEndDateUseCase() {
  const ringBearersRepository = new TypeormRingBearersRepository()
  const setEndDateUseCase = new SetEndDateUseCase(ringBearersRepository)

  return setEndDateUseCase
}
