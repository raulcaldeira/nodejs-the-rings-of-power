import { BearersRepository } from '@/repositories/bearers.repository'
import { Bearer } from '@/database/entities/Bearer'

interface GetAllBearersUseCaseResponse {
  bearers: Bearer[]
}

export class ListAllBearersUseCase {
  constructor(private bearersRepository: BearersRepository) {}

  async execute(search?: string): Promise<GetAllBearersUseCaseResponse> {
    const bearers = await this.bearersRepository.getAll(search) // Passa o parâmetro de busca

    return {
      bearers,
    }
  }
}
