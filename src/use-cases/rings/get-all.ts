import { Ring } from '@/database/entities/Ring'
import { RingsRepository } from '@/repositories/rings-repository'

interface GetAllRingsUseCaseResponse {
  rings: Ring[]
}

export class GetAllRingsUseCase {
  constructor(private ringsRepository: RingsRepository) {}

  async execute(): Promise<GetAllRingsUseCaseResponse> {
    const rings = await this.ringsRepository.getAllRings()

    return {
      rings,
    }
  }
}
