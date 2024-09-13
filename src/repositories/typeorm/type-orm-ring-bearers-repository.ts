import { Repository } from 'typeorm'
import { AppDataSource } from '@/database/data-source' // Sua configuração de DataSource
import {
  CreateRingBearerInput,
  RingBearersRepository,
} from '../ring-bearers-repository'
import { RingBearer } from '@/database/entities/RingBearer'

export class TypeormRingBearersRepository implements RingBearersRepository {
  private ormRepository: Repository<RingBearer>

  constructor() {
    this.ormRepository = AppDataSource.getRepository(RingBearer)
  }

  async createRingBearer(data: CreateRingBearerInput): Promise<RingBearer> {
    const ringBearer = this.ormRepository.create(data)

    return await this.ormRepository.save(ringBearer)
  }
}
