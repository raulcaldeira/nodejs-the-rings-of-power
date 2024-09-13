import { RingBearer } from '@/database/entities/RingBearer'
import { RingBearersRepository } from '@/repositories/ring-bearers-repository'
import { RingNotFoundError } from '@/use-cases/errors/ring-not-found-error'
import { BearerNotFoundError } from '@/use-cases/errors/bearer-not-found-error'
import { RingsRepository } from '@/repositories/rings-repository'
import { BearersRepository } from '@/repositories/bearers.repository'

interface SetRingBearerUseCaseRequest {
  ringId: number
  bearerId: number
  startDate: Date
  endDate?: Date
}

interface SetRingBearerUseCaseResponse {
  ringBearer: RingBearer
}

export class SetRingBearerUseCase {
  constructor(
    private ringBearersRepository: RingBearersRepository,
    private ringRepository: RingsRepository,
    private bearerRepository: BearersRepository,
  ) {}

  async execute({
    ringId,
    bearerId,
    startDate,
    endDate,
  }: SetRingBearerUseCaseRequest): Promise<SetRingBearerUseCaseResponse> {
    // Verifica se o Ring e o Bearer existem
    const existingRing = await this.ringRepository.findRingById(ringId)
    const existingBearer = await this.bearerRepository.findBearerById(bearerId)

    if (!existingRing) {
      throw new RingNotFoundError()
    }

    if (!existingBearer) {
      throw new BearerNotFoundError()
    }

    const ringBearer = await this.ringBearersRepository.createRingBearer({
      ring: existingRing,
      bearer: existingBearer,
      startDate,
      endDate,
    })

    return {
      ringBearer,
    }
  }
}
