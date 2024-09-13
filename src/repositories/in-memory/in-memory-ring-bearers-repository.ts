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
}
