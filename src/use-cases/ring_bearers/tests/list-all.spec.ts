import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryRingBearersRepository } from '@/repositories/in-memory/in-memory-ring-bearers-repository'

import { RingBearer } from '@/database/entities/RingBearer'
import { Species } from '@/database/entities/Bearer'
import { Forgers } from '@/database/entities/Ring'
import { ListAllRingBearersUseCase } from '../list-all'

let ringBearersRepository: InMemoryRingBearersRepository
let sut: ListAllRingBearersUseCase

describe('ListAllRingBearersUseCase', () => {
  beforeEach(() => {
    ringBearersRepository = new InMemoryRingBearersRepository()
    sut = new ListAllRingBearersUseCase(ringBearersRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should list all ring bearers successfully', async () => {
    const bearer = {
      id: 1,
      name: 'Raul',
      species: Species.MAGE,
    }

    const ring = {
      id: 1,
      imageUrl: 'example.com',
      name: 'Anél teste',
      power: 'Poder teste',
      forgedBy: Forgers.DWARF,
    }

    const ringTwo = {
      id: 2,
      imageUrl: 'example.com',
      name: 'Anél teste',
      power: 'Poder teste',
      forgedBy: Forgers.DWARF,
    }

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const bearerOne: RingBearer = {
      id: 1,
      bearer,
      ring,
      startDate: new Date(),
      endDate: null,
    }

    const bearerTwo: RingBearer = {
      id: 1,
      bearer,
      ring: ringTwo,
      startDate: new Date(),
      endDate: null,
    }

    await ringBearersRepository.createRingBearer(bearerOne)
    await ringBearersRepository.createRingBearer(bearerTwo)

    const response = await sut.execute()

    expect(response.ringBearers).toHaveLength(2)
    expect(response.ringBearers).toEqual(
      expect.arrayContaining([bearerOne, bearerTwo]),
    )
  })

  it('should return an empty array if no ring bearers exist', async () => {
    const response = await sut.execute()

    expect(response.ringBearers).toHaveLength(0)
  })
})
