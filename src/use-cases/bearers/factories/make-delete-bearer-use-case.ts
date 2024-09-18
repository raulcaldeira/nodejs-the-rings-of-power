import { TypeormBearersRepository } from '@/repositories/typeorm/typeorm-bearers-repository'
import { DeleteBearerUseCase } from '../delete'
import { TypeormRingBearersRepository } from '@/repositories/typeorm/typeorm-ring-bearers-repository'

export function makeDeleteBearerUseCase() {
  const bearersRepository = new TypeormBearersRepository()
  const ringBearersRepository = new TypeormRingBearersRepository()
  const deleteBearerUseCase = new DeleteBearerUseCase(
    bearersRepository,
    ringBearersRepository,
  )

  return deleteBearerUseCase
}
