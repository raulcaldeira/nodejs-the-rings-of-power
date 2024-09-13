import { Forgers, Ring } from '@/database/entities/Ring'
import { RingsRepository } from '@/repositories/rings-repository'
import { MaxRingsForgedBySpecie } from '../errors/max-rings-forged-by-this-species'

interface CreateRingUseCaseRequest {
  name: string
  power: string
  forgedBy: Forgers
  imageUrl: string
}

interface CreateRingUseCaseResponse {
  ring: Ring
}

export class CreateRingUseCase {
  constructor(private ringsRepository: RingsRepository) {}

  async execute({
    name,
    power,
    forgedBy,
    imageUrl,
  }: CreateRingUseCaseRequest): Promise<CreateRingUseCaseResponse> {
    const maxRingsPerRace = {
      [Forgers.ELFOS]: 3,
      [Forgers.ANOES]: 7,
      [Forgers.HOMENS]: 9,
      [Forgers.SAURON]: 1,
    }

    const countForgers = await this.ringsRepository.countRingsForgedBy(forgedBy)

    const maxAllowed = maxRingsPerRace[forgedBy]

    if (countForgers >= maxAllowed) {
      throw new MaxRingsForgedBySpecie()
    }

    const ring = await this.ringsRepository.createRing({
      name,
      power,
      forgedBy,
      imageUrl,
    })

    return {
      ring,
    }
  }
}
