import { Repository } from 'typeorm'
import { AppDataSource } from '@/database/data-source' // Sua configuração de DataSource
import { BearersRepository, CreateBearerInput } from '../bearers.repository'
import { Bearer } from '@/database/entities/Bearer'

export class TypeormBearersRepository implements BearersRepository {
  private ormRepository: Repository<Bearer>

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Bearer)
  }

  async createBearer(data: CreateBearerInput): Promise<Bearer> {
    const bearer = this.ormRepository.create(data)

    return await this.ormRepository.save(bearer)
  }
}
