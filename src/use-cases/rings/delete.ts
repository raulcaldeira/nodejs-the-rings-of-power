import { RingsRepository } from '@/repositories/rings-repository'
import { RingNotFoundError } from '../errors/ring-not-found-error'
import { RingBearersRepository } from '@/repositories/ring-bearers-repository'

export interface DeleteRingUseCaseRequest {
  id: number
}

export interface DeleteRingUseCaseResponse {
  success: boolean
}

export class DeleteRingUseCase {
  constructor(
    private ringsRepository: RingsRepository,
    private ringBearersRepository: RingBearersRepository,
  ) {}

  async execute({
    id,
  }: DeleteRingUseCaseRequest): Promise<DeleteRingUseCaseResponse> {
    const ring = await this.ringsRepository.findRingById(id)

    if (!ring) {
      throw new RingNotFoundError()
    }

    await this.ringBearersRepository.deleteAllByRingId(id)

    await this.ringsRepository.deleteRing(id)

    return {
      success: true,
    }
  }
}
