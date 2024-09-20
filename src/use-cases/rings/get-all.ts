import { Ring } from '@/database/entities/Ring'
import { RingsRepository } from '@/repositories/rings-repository'
import { RingBearersRepository } from '@/repositories/ring-bearers-repository'
import { BearersRepository } from '@/repositories/bearers.repository'
import { Bearer } from '@/database/entities/Bearer'

interface BearerWithDate extends Bearer {
  startDate: Date
}

interface RingWithBearer extends Ring {
  bearer: BearerWithDate | null
}

interface GetAllRingsUseCaseResponse {
  rings: RingWithBearer[]
}

export class GetAllRingsUseCase {
  constructor(
    private ringsRepository: RingsRepository,
    private ringBearersRepository: RingBearersRepository,
    private bearersRepository: BearersRepository,
  ) {}

  async execute(search?: string): Promise<GetAllRingsUseCaseResponse> {
    const rings = await this.ringsRepository.getAllRings(search)

    const ringsWithBearer = await Promise.all(
      rings.map(async (ring) => {
        const ringBearer = await this.ringBearersRepository.findByRing(ring.id)

        let bearerWithStartDate: BearerWithDate | null = null
        if (ringBearer) {
          const bearer = await this.bearersRepository.findBearerById(
            ringBearer.bearer.id,
          )

          bearerWithStartDate = {
            ...bearer,
            startDate: ringBearer.startDate,
          }
        }

        return {
          ...ring,
          bearer: bearerWithStartDate,
        }
      }),
    )

    return {
      rings: ringsWithBearer,
    }
  }
}
