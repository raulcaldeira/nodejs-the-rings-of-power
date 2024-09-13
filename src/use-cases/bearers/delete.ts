import { BearersRepository } from '@/repositories/bearers.repository'
import { BearerNotFoundError } from '../errors/bearer-not-found-error'

interface DeleteBearerUseCaseRequest {
  id: number
}

interface DeleteBearerUseCaseResponse {
  success: boolean
}

export class DeleteBearerUseCase {
  constructor(private bearersRepository: BearersRepository) {}

  async execute({
    id,
  }: DeleteBearerUseCaseRequest): Promise<DeleteBearerUseCaseResponse> {
    // Verifica se o Bearer existe
    const existingBearer = await this.bearersRepository.findBearerById(id)

    if (!existingBearer) {
      throw new BearerNotFoundError()
    }

    // Deleta o Bearer
    await this.bearersRepository.deleteBearer(id)

    return {
      success: true,
    }
  }
}
