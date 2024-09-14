import { RingBearersRepository } from '@/repositories/ring-bearers-repository'
import { RingBearerNotFoundError } from '@/use-cases/errors/ring-bearer-not-found-error'

export interface DeleteRingBearerUseCaseRequest {
  ringId: number
  bearerId: number
}

export interface DeleteRingBearerUseCaseResponse {
  success: boolean
}

export class DeleteRingBearerUseCase {
  constructor(private ringBearersRepository: RingBearersRepository) {}

  async execute({
    ringId,
    bearerId,
  }: DeleteRingBearerUseCaseRequest): Promise<DeleteRingBearerUseCaseResponse> {
    // Verifica se o RingBearer existe
    const ringBearer = await this.ringBearersRepository.findByRingAndBearer(
      ringId,
      bearerId,
    )

    if (!ringBearer) {
      throw new RingBearerNotFoundError()
    }

    await this.ringBearersRepository.deleteRingBearer(ringBearer.id)

    return {
      success: true,
    }
  }
}
