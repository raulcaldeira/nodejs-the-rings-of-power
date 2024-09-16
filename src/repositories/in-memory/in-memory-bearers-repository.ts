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

  async getAll(): Promise<Bearer[]> {
    const bearers = this.items

    return bearers
  }

  async findBearerById(id: number): Promise<Bearer | null> {
    return this.items.find((bearer) => bearer.id === id) || null
  }

  async updateBearer(
    id: number,
    data: Partial<Omit<Bearer, 'id' | 'createdAt'>>,
  ): Promise<Bearer | null> {
    const bearerIndex = this.items.findIndex((bearer) => bearer.id === id)
    if (bearerIndex === -1) return null

    const updatedRing = { ...this.items[bearerIndex], ...data }
    this.items[bearerIndex] = updatedRing
    return updatedRing
  }

  async deleteBearer(id: number): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id)
  }
}
