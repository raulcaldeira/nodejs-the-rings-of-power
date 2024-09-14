import {
  CreateRingBearerInput,
  RingBearersRepository,
} from '../ring-bearers-repository'
import { RingBearer } from '@/database/entities/RingBearer'

export class InMemoryRingBearersRepository implements RingBearersRepository {
  public items: RingBearer[] = []

  async createRingBearer(
    data: CreateRingBearerInput,
  ): Promise<RingBearer | null> {
    const ringBearer = {
      id: this.items.length + 1, // Simula a criação de um ID
      ...data,
    }
    this.items.push(ringBearer)
    return ringBearer
  }

  async findByRingAndBearer(
    ringId: number,
    bearerId: number,
  ): Promise<RingBearer | null> {
    const ringBearer = this.items.find(
      (item) => item.ring.id === ringId && item.bearer.id === bearerId,
    )
    return ringBearer || null
  }

  async setEndDate(id: number, endDate: Date): Promise<void> {
    const ringBearer = this.items.find((item) => item.id === id)

    ringBearer.endDate = endDate
  }
}
