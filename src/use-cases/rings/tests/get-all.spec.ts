import { describe, it, expect, beforeEach } from 'vitest'
import { GetAllRingsUseCase } from '../get-all'
import { InMemoryRingsRepository } from '@/repositories/in-memory/in-memory-rings-repository'
import { Forgers, Ring } from '@/database/entities/Ring'

let ringsRepository: InMemoryRingsRepository
let sut: GetAllRingsUseCase

describe('GetAllRingsUseCase', () => {
  beforeEach(() => {
    ringsRepository = new InMemoryRingsRepository()
    sut = new GetAllRingsUseCase(ringsRepository)
  })

  it('should return all rings', async () => {
    const ringOne: Ring = {
      id: 1,
      name: 'Ring of Power',
      power: 'Grants immense power',
      forgedBy: Forgers.SAURON,
      imageUrl: 'http://example.com/ring1.png',
    }

    const ringTwo: Ring = {
      id: 2,
      name: 'Ring of Wisdom',
      power: 'Grants great wisdom',
      forgedBy: Forgers.ELF,
      imageUrl: 'http://example.com/ring2.png',
    }

    ringsRepository.createRing(ringOne)
    ringsRepository.createRing(ringTwo)

    const { rings } = await sut.execute()

    expect(rings).toHaveLength(2)
    expect(rings).toContainEqual(ringOne)
    expect(rings).toContainEqual(ringTwo)
  })

  it('should return an empty array if no rings exist', async () => {
    const { rings } = await sut.execute()

    expect(rings).toHaveLength(0)
  })
})
