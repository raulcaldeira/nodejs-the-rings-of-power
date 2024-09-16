import { Ring } from '@/database/entities/Ring'
import { RingsRepository } from '@/repositories/rings-repository'
import { RingBearersRepository } from '@/repositories/ring-bearers-repository'
import { BearersRepository } from '@/repositories/bearers.repository'

interface RingWithBearer extends Ring {
  bearer: string | null
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

  async execute(): Promise<GetAllRingsUseCaseResponse> {
    // Passo 1: Buscar todos os Rings
    const rings = await this.ringsRepository.getAllRings()

    // Passo 2: Para cada Ring, buscar o bearer associado
    const ringsWithBearer = await Promise.all(
      rings.map(async (ring) => {
        // Buscar o RingBearer pelo ringId
        const ringBearer = await this.ringBearersRepository.findByRing(ring.id)

        let bearerName: string | null = null
        if (ringBearer) {
          // Passo 3: Buscar os detalhes do bearer pelo bearerId
          const bearer = await this.bearersRepository.findBearerById(
            ringBearer.bearer.id,
          )
          bearerName = bearer?.name || null
        }

        // Retornar o ring com o nome do bearer associado
        return {
          ...ring,
          bearer: bearerName,
        }
      }),
    )

    return {
      rings: ringsWithBearer,
    }
  }
}
