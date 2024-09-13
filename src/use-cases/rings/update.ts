import { Forgers, Ring } from '@/database/entities/Ring'
import { RingsRepository } from '@/repositories/rings-repository'
import { MaxRingsForgedBySpecie } from '../errors/max-rings-forged-by-this-species-error'
import { RingNotFoundError } from '../errors/ring-not-found-error'

interface UpdateRingUseCaseRequest {
  id: number
  name?: string
  power?: string
  forgedBy?: Forgers
  imageUrl?: string
}

interface UpdateRingUseCaseResponse {
  ring: Ring | null
}

export class UpdateRingUseCase {
  constructor(private ringsRepository: RingsRepository) {}

  async execute({
    id,
    name,
    power,
    forgedBy,
    imageUrl,
  }: UpdateRingUseCaseRequest): Promise<UpdateRingUseCaseResponse> {
    const existingRing = await this.ringsRepository.findRingById(id)

    if (!existingRing) {
      throw new RingNotFoundError()
    }

    if (forgedBy && existingRing.forgedBy !== forgedBy) {
      const countForgers =
        await this.ringsRepository.countRingsForgedBy(forgedBy)
      const maxRingsPerRace = {
        [Forgers.ELF]: 3,
        [Forgers.DWARF]: 7,
        [Forgers.HUMAN]: 9,
        [Forgers.SAURON]: 1,
      }
      const maxAllowed = maxRingsPerRace[forgedBy]

      if (countForgers >= maxAllowed) {
        throw new MaxRingsForgedBySpecie()
      }
    }

    const updatedRing = await this.ringsRepository.updateRing(id, {
      name,
      power,
      forgedBy,
      imageUrl,
    })

    return {
      ring: updatedRing,
    }
  }
}
