import {
  RingsRepository,
  CreateRingInput,
} from '@/repositories/rings-repository'
import { Ring, Forgers } from '@/database/entities/Ring'

export class InMemoryRingsRepository implements RingsRepository {
  public items: Ring[] = []

  async createRing(data: CreateRingInput): Promise<Ring | null> {
    const ring = {
      id: this.items.length + 1, // Simula a criação de um ID
      ...data,
    }
    this.items.push(ring)
    return ring
  }

  async countRingsForgedBy(forger: Forgers): Promise<number> {
    return this.items.filter((ring) => ring.forgedBy === forger).length
  }
}
