import { Repository } from 'typeorm'
import { Forgers, Ring } from '@/database/entities/Ring'
import { CreateRingInput, RingsRepository } from '../rings-repository'
import { AppDataSource } from '@/database/data-source' // Sua configuração de DataSource

export class TypeormRingsRepository implements RingsRepository {
  private ormRepository: Repository<Ring>

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Ring)
  }

  async createRing(data: CreateRingInput): Promise<Ring> {
    const ring = this.ormRepository.create(data)

    return await this.ormRepository.save(ring)
  }

  async getAllRings(search?: string): Promise<Ring[]> {
    if (search) {
      const lowercasedSearch = search.toLowerCase()

      const rings = await this.ormRepository
        .createQueryBuilder()
        .select('ring')
        .from(Ring, 'ring')
        .where('LOWER(ring.name) LIKE :search', {
          search: `%${lowercasedSearch}%`,
        })
        .orWhere('LOWER(ring.power) LIKE :search', {
          search: `%${lowercasedSearch}%`,
        })
        .orWhere('LOWER(CAST(ring.forgedBy AS TEXT)) LIKE :search', {
          search: `%${lowercasedSearch}%`,
        }) // Busca na coluna forgedBy
        .getMany()

      return rings
    }

    return await this.ormRepository.find()
  }

  async findRingById(id: number): Promise<Ring | null> {
    const ring = await this.ormRepository.findOne({
      where: { id },
    })
    return ring || null
  }

  async countRingsForgedBy(forger: Forgers): Promise<number> {
    return await this.ormRepository.count({ where: { forgedBy: forger } })
  }

  async updateRing(
    id: number,
    data: Partial<CreateRingInput>,
  ): Promise<Ring | null> {
    const ring = await this.ormRepository.findOne({
      where: { id },
    })

    if (!ring) {
      return null
    }

    this.ormRepository.merge(ring, data)

    return await this.ormRepository.save(ring)
  }

  async deleteRing(id: number): Promise<void> {
    await this.ormRepository.delete(id)
  }
}
