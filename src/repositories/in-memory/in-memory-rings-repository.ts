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

  async getAllRings(): Promise<Ring[]> {
    const rings = this.items

    return rings
  }

  async findRingById(id: number): Promise<Ring | null> {
    return this.items.find((ring) => ring.id === id) || null
  }

  async countRingsForgedBy(forger: Forgers): Promise<number> {
    return this.items.filter((ring) => ring.forgedBy === forger).length
  }

  async updateRing(
    id: number,
    data: Partial<Omit<Ring, 'id' | 'createdAt'>>,
  ): Promise<Ring | null> {
    const ringIndex = this.items.findIndex((ring) => ring.id === id)
    if (ringIndex === -1) return null

    const updatedRing = { ...this.items[ringIndex], ...data }
    this.items[ringIndex] = updatedRing
    return updatedRing
  }

  async deleteRing(id: number): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id)
  }
}
