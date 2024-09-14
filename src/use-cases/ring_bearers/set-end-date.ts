import { RingBearersRepository } from '@/repositories/ring-bearers-repository'
import { RingBearerNotFoundError } from '@/use-cases/errors/ring-bearer-not-found-error'
import { StartDateGreaterThanOrEqualEndDate } from '../errors/start-date-greater-than-or-equal-end-date-error'

interface SetEndDateUseCaseRequest {
  ringId: number
  bearerId: number
  endDate: Date
}

interface SetEndDateUseCaseResponse {
  success: boolean
}

export class SetEndDateUseCase {
  constructor(private ringBearersRepository: RingBearersRepository) {}

  async execute({
    ringId,
    bearerId,
    endDate,
  }: SetEndDateUseCaseRequest): Promise<SetEndDateUseCaseResponse> {
    const existingRingBearer =
      await this.ringBearersRepository.findByRingAndBearer(ringId, bearerId)

    if (!existingRingBearer) {
      throw new RingBearerNotFoundError()
    }

    if (endDate <= new Date(existingRingBearer.startDate)) {
      throw new StartDateGreaterThanOrEqualEndDate()
    }

    await this.ringBearersRepository.setEndDate(existingRingBearer.id, endDate)

    return {
      success: true,
    }
  }
}
