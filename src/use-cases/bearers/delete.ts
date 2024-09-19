import { BearersRepository } from '@/repositories/bearers.repository'
import { BearerNotFoundError } from '../errors/bearer-not-found-error'
import { RingBearersRepository } from '@/repositories/ring-bearers-repository'
import { BearerIsRingBearerError } from '../errors/bearer-is-ring-bearer-error'

interface DeleteBearerUseCaseRequest {
  id: number
}

interface DeleteBearerUseCaseResponse {
  success: boolean
}

export class DeleteBearerUseCase {
  constructor(
    private bearersRepository: BearersRepository,
    private ringBearersRepository: RingBearersRepository,
  ) {}

  async execute({
    id,
  }: DeleteBearerUseCaseRequest): Promise<DeleteBearerUseCaseResponse> {
    // Verifica se o Bearer existe
    const existingBearer = await this.bearersRepository.findBearerById(id)

    if (!existingBearer) {
      throw new BearerNotFoundError()
    }

    const isRingBearer = await this.ringBearersRepository.findByBearer(id)

    if (isRingBearer.length > 0) {
      throw new BearerIsRingBearerError()
    }

    // Deleta o Bearer
    await this.bearersRepository.deleteBearer(id)

    return {
      success: true,
    }
  }
}
