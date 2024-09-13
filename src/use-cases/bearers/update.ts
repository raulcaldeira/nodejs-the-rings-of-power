import { Species, Bearer } from '@/database/entities/Bearer'
import { BearersRepository } from '@/repositories/bearers.repository'
import { BearerNotFoundError } from '../errors/bearer-not-found-error'

interface UpdateBearerUseCaseRequest {
  id: number
  name?: string
  species?: Species
}

interface UpdateBearerUseCaseResponse {
  bearer: Bearer | null
}

export class UpdateBearerUseCase {
  constructor(private bearersRepository: BearersRepository) {}

  async execute({
    id,
    name,
    species,
  }: UpdateBearerUseCaseRequest): Promise<UpdateBearerUseCaseResponse> {
    // Verifica se o Bearer existe
    const existingBearer = await this.bearersRepository.findBearerById(id)

    if (!existingBearer) {
      throw new BearerNotFoundError()
    }

    const updatedBearer = await this.bearersRepository.updateBearer(id, {
      name,
      species,
    })

    return {
      bearer: updatedBearer,
    }
  }
}
