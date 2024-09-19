import { RingBearer } from '@/database/entities/RingBearer'
import { RingBearersRepository } from '@/repositories/ring-bearers-repository'

export interface ListAllRingBearersUseCaseResponse {
  ringBearers: RingBearer[]
}

export class ListAllRingBearersUseCase {
  constructor(private ringBearersRepository: RingBearersRepository) {}

  async execute(): Promise<ListAllRingBearersUseCaseResponse> {
    // Verifica se o RingBearer existe
    const ringBearers = await this.ringBearersRepository.listAllRingBearers()

    return {
      ringBearers,
    }
  }
}
