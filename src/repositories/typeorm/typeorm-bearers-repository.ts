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

  async getAll(): Promise<Bearer[]> {
    const bearers = await this.ormRepository.find()

    return bearers
  }

  async findBearerById(id: number): Promise<Bearer | null> {
    const bearer = await this.ormRepository.findOne({
      where: { id },
    })
    return bearer || null
  }

  async updateBearer(
    id: number,
    data: Partial<CreateBearerInput>,
  ): Promise<Bearer | null> {
    const bearer = await this.ormRepository.findOne({
      where: { id },
    })

    if (!bearer) {
      return null
    }

    this.ormRepository.merge(bearer, data)

    return await this.ormRepository.save(bearer)
  }

  async deleteBearer(id: number): Promise<void> {
    await this.ormRepository.delete(id)
  }
}
