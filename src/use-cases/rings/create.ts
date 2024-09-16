import { Forgers, Ring } from '@/database/entities/Ring'
import { RingsRepository } from '@/repositories/rings-repository'
import { MaxRingsForgedBySpecie } from '../errors/max-rings-forged-by-this-species-error'
import { BearersRepository } from '@/repositories/bearers.repository'
import { RingBearersRepository } from '@/repositories/ring-bearers-repository'
import { BearerNotFoundError } from '../errors/bearer-not-found-error'
import { Bearer } from '@/database/entities/Bearer'

interface CreateRingUseCaseRequest {
  name: string
  power: string
  forgedBy: Forgers
  imageUrl: string
  bearerId?: number
  startDate?: Date
  endDate?: Date
}

interface RingWithBearer extends Ring {
  bearer: Bearer | null
}

interface CreateRingUseCaseResponse {
  ring: RingWithBearer
}

export class CreateRingUseCase {
  constructor(
    private ringsRepository: RingsRepository,
    private bearerRepository: BearersRepository,
    private ringBearersRepository: RingBearersRepository,
  ) {}

  async execute({
    name,
    power,
    forgedBy,
    imageUrl,
    bearerId,
    startDate,
    endDate,
  }: CreateRingUseCaseRequest): Promise<CreateRingUseCaseResponse> {
    const maxRingsPerRace = {
      [Forgers.ELF]: 3,
      [Forgers.DWARF]: 7,
      [Forgers.HUMAN]: 9,
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

    let bearer = null

    if (bearerId) {
      const existingBearer =
        await this.bearerRepository.findBearerById(bearerId)

      if (existingBearer) {
        const newRingBearer = {
          ring,
          bearer: existingBearer,
          startDate,
          ...(endDate && { endDate }),
        }

        await this.ringBearersRepository.createRingBearer(newRingBearer)

        bearer = await this.bearerRepository.findBearerById(bearerId)
      } else {
        throw new BearerNotFoundError()
      }
    }

    const responseData = {
      ...ring,
      bearer,
    }
    return { ring: responseData }
  }
}
