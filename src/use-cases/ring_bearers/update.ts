import { RingBearer } from '@/database/entities/RingBearer'
import {
  RingBearersRepository,
  UpdateRingBearerInput,
} from '@/repositories/ring-bearers-repository'
import { RingBearerNotFoundError } from '@/use-cases/errors/ring-bearer-not-found-error'

export interface UpdateRingBearerUseCaseRequest {
  ringId: number
  bearerId: number
  data: UpdateRingBearerInput
}

export interface UpdateRingBearerUseCaseResponse {
  ringBearer: RingBearer
}

export class UpdateRingBearerUseCase {
  constructor(private ringBearersRepository: RingBearersRepository) {}

  async execute({
    ringId,
    bearerId,
    data,
  }: UpdateRingBearerUseCaseRequest): Promise<UpdateRingBearerUseCaseResponse> {
    // Verifica se o RingBearer existe
    const ringBearer = await this.ringBearersRepository.findByRingAndBearer(
      ringId,
      bearerId,
    )

    if (!ringBearer) {
      throw new RingBearerNotFoundError()
    }

    // Atualiza o RingBearer
    await this.ringBearersRepository.updateRingBearer(ringBearer.id, data)

    // Busca o RingBearer atualizado
    const updatedRingBearer =
      await this.ringBearersRepository.findByRingAndBearer(ringId, bearerId)

    if (!updatedRingBearer) {
      throw new RingBearerNotFoundError()
    }

    return {
      ringBearer: updatedRingBearer,
    }
  }
}
