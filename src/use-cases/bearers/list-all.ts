import { BearersRepository } from '@/repositories/bearers.repository'
import { Bearer } from '@/database/entities/Bearer'

interface GetAllRingsUseCaseResponse {
  bearers: Bearer[]
}

export class ListAllBearersUseCase {
  constructor(private bearersRepository: BearersRepository) {}

  async execute(): Promise<GetAllRingsUseCaseResponse> {
    const bearers = await this.bearersRepository.getAll()

    return {
      bearers,
    }
  }
}
