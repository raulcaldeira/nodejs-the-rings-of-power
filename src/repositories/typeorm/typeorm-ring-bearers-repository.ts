import { Repository } from 'typeorm'
import { AppDataSource } from '@/database/data-source' // Sua configuração de DataSource
import {
  CreateRingBearerInput,
  RingBearersRepository,
  UpdateRingBearerInput,
} from '../ring-bearers-repository'
import { RingBearer } from '@/database/entities/RingBearer'
import { RingBearerNotFoundError } from '@/use-cases/errors/ring-bearer-not-found-error'

export class TypeormRingBearersRepository implements RingBearersRepository {
  private ormRepository: Repository<RingBearer>

  constructor() {
    this.ormRepository = AppDataSource.getRepository(RingBearer)
  }

  async createRingBearer(data: CreateRingBearerInput): Promise<RingBearer> {
    const ringBearer = this.ormRepository.create(data)

    return await this.ormRepository.save(ringBearer)
  }

  async findByRingAndBearer(
    ringId: number,
    bearerId: number,
  ): Promise<RingBearer | null> {
    const ringBearer = await this.ormRepository.findOne({
      where: {
        ring: { id: ringId },
        bearer: { id: bearerId },
      },
    })
    return ringBearer || null
  }

  async findByRing(ring: number): Promise<RingBearer | null> {
    const ringBearer = await this.ormRepository.findOne({
      where: {
        ring: { id: ring },
        endDate: null,
      },
    })
    return ringBearer || null
  }

  async setEndDate(id: number, endDate: Date): Promise<void> {
    const ringBearer = await this.ormRepository.findOne({
      where: { id },
    })

    if (!ringBearer) {
      throw new RingBearerNotFoundError()
    }

    this.ormRepository.merge(ringBearer, { endDate })

    await this.ormRepository.save(ringBearer)
  }

  async updateRingBearer(
    ringBearerId: number,
    data: UpdateRingBearerInput,
  ): Promise<void> {
    await this.ormRepository.update(ringBearerId, data)
  }

  async deleteRingBearer(ringBearerId: number): Promise<void> {
    await this.ormRepository.delete(ringBearerId)
  }
}
