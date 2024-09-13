import { Species, Bearer } from '@/database/entities/Bearer'
import { BearersRepository } from '@/repositories/bearers.repository'

interface CreateBearerUseCaseRequest {
  name: string
  species: Species
}

interface CreateBearerUseCaseResponse {
  bearer: Bearer
}

export class CreateBearerUseCase {
  constructor(private bearersRepository: BearersRepository) {}

  async execute({
    name,
    species,
  }: CreateBearerUseCaseRequest): Promise<CreateBearerUseCaseResponse> {
    const bearer = await this.bearersRepository.createBearer({
      name,
      species,
    })

    return {
      bearer,
    }
  }
}
