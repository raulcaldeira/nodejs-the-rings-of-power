import { TypeormRingBearersRepository } from '@/repositories/typeorm/typeorm-ring-bearers-repository'
import { ListAllRingBearersUseCase } from '../list-all'

export function makeListAllRingBearersUseCase() {
  const ringBearersRepository = new TypeormRingBearersRepository()
  const listAllRingBearerUseCase = new ListAllRingBearersUseCase(
    ringBearersRepository,
  )

  return listAllRingBearerUseCase
}
