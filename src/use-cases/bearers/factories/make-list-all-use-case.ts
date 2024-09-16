import { TypeormBearersRepository } from '@/repositories/typeorm/typeorm-bearers-repository'
import { ListAllBearersUseCase } from '../list-all'

export function makeListAllBearersUseCase() {
  const bearersRepository = new TypeormBearersRepository()
  const listAllBearerUseCase = new ListAllBearersUseCase(bearersRepository)

  return listAllBearerUseCase
}
