import { Bearer } from '@/database/entities/Bearer'
import { BearersRepository, CreateBearerInput } from '../bearers.repository'

export class InMemoryBearersRepository implements BearersRepository {
  public items: Bearer[] = []

  async createBearer(data: CreateBearerInput): Promise<Bearer | null> {
    const bearer = {
      id: this.items.length + 1,
      ...data,
    }
    this.items.push(bearer)
    return bearer
  }
}
