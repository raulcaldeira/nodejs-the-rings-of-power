import { RingsRepository } from '@/repositories/rings-repository'
import { RingNotFoundError } from '../errors/ring-not-found-error'

export interface DeleteRingUseCaseRequest {
  id: number
}

export interface DeleteRingUseCaseResponse {
  success: boolean
}

export class DeleteRingUseCase {
  constructor(private ringsRepository: RingsRepository) {}

  async execute({
    id,
  }: DeleteRingUseCaseRequest): Promise<DeleteRingUseCaseResponse> {
    const ring = await this.ringsRepository.findRingById(id)

    if (!ring) {
      throw new RingNotFoundError()
    }

    await this.ringsRepository.deleteRing(id)

    return {
      success: true,
    }
  }
}
