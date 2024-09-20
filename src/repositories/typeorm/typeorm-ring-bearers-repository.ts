import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm'
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

  async listAllRingBearers(): Promise<RingBearer[]> {
    const ringBearers = this.ormRepository.find({ order: { startDate: 'ASC' } })

    return ringBearers
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

  async findByRing(ringId: number): Promise<RingBearer | null> {
    const ringBearer = await this.ormRepository.findOne({
      where: {
        ring: { id: ringId },
        endDate: null,
      },
      order: {
        id: 'DESC',
      },
    })

    console.log('RingBearer found:', ringBearer)

    if (ringBearer && !ringBearer.endDate) {
      return ringBearer
    }

    return null
  }

  async findByBearer(bearer: number): Promise<RingBearer[] | null> {
    const ringBearer = await this.ormRepository.find({
      where: {
        bearer: { id: bearer },
        endDate: null,
      },
      order: {
        id: 'DESC',
      },
    })

    if (ringBearer.length > 0) {
      ringBearer.filter((rb) => !!rb.endDate)

      return ringBearer
    }

    return null
  }

  async findActiveRingBearersByStartDate(
    ringId: number,
    startDate: Date,
  ): Promise<RingBearer[]> {
    const ringBearers = await this.ormRepository.find({
      where: [
        {
          ring: { id: ringId },
          startDate: LessThanOrEqual(startDate),
          endDate: null,
        },
        {
          ring: { id: ringId },
          startDate: LessThanOrEqual(startDate),
          endDate: MoreThanOrEqual(startDate),
        },
      ],
      order: {
        startDate: 'ASC',
      },
    })

    return ringBearers
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

  async deleteAllByRingId(ring: number): Promise<void> {
    await this.ormRepository
      .createQueryBuilder()
      .delete()
      .from(RingBearer)
      .where('ringId = :ringId', { ringId: ring })
      .execute()
  }
}
