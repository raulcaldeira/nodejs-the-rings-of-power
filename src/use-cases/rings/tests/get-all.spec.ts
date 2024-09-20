import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { GetAllRingsUseCase } from '../get-all'
import { InMemoryRingsRepository } from '@/repositories/in-memory/in-memory-rings-repository'
import { Forgers, Ring } from '@/database/entities/Ring'
import { InMemoryRingBearersRepository } from '@/repositories/in-memory/in-memory-ring-bearers-repository'
import { InMemoryBearersRepository } from '@/repositories/in-memory/in-memory-bearers-repository'
import { Species } from '@/database/entities/Bearer'

let ringsRepository: InMemoryRingsRepository
let ringBearersRepository: InMemoryRingBearersRepository
let bearersRepository: InMemoryBearersRepository
let sut: GetAllRingsUseCase

describe('GetAllRingsUseCase', () => {
  beforeEach(() => {
    ringsRepository = new InMemoryRingsRepository()
    ringBearersRepository = new InMemoryRingBearersRepository()
    bearersRepository = new InMemoryBearersRepository()

    sut = new GetAllRingsUseCase(
      ringsRepository,
      ringBearersRepository,
      bearersRepository,
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return all rings', async () => {
    bearersRepository.createBearer({
      name: 'Raul',
      species: Species.HUMAN,
    })

    const bearer = {
      id: 1,
      name: 'Raul',
      species: Species.HUMAN,
    }

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

    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    ringBearersRepository.createRingBearer({
      ring: ringTwo,
      bearer,
      startDate: new Date(),
    })

    const { rings } = await sut.execute()

    expect(rings).toHaveLength(2)
    expect(rings).toContainEqual({
      ...ringOne,
      bearer: null,
    })
    expect(rings).toContainEqual({
      ...ringTwo,
      bearer: {
        id: bearer.id,
        name: bearer.name,
        species: bearer.species,
        startDate: new Date(),
      },
    })
  })

  it('should return an empty array if no rings exist', async () => {
    const { rings } = await sut.execute()

    expect(rings).toHaveLength(0)
  })

  it('should return filtered rings based on search', async () => {
    bearersRepository.createBearer({
      name: 'Raul',
      species: Species.HUMAN,
    })

    const bearer = {
      id: 1,
      name: 'Raul',
      species: Species.HUMAN,
    }

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

    const ringThree: Ring = {
      id: 3,
      name: 'Simple Band',
      power: 'A basic ring',
      forgedBy: Forgers.HUMAN,
      imageUrl: 'http://example.com/ring3.png',
    }

    ringsRepository.createRing(ringOne)
    ringsRepository.createRing(ringTwo)
    ringsRepository.createRing(ringThree)

    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    ringBearersRepository.createRingBearer({
      ring: ringTwo,
      bearer,
      startDate: new Date(),
    })

    const { rings: allRings } = await sut.execute()
    expect(allRings).toHaveLength(3)

    // Teste de pesquisa
    const { rings: filteredRings } = await sut.execute('Power')
    expect(filteredRings).toHaveLength(1)
    expect(filteredRings).toContainEqual({
      ...ringOne,
      bearer: null,
    })

    const { rings: filteredRingsNoMatch } = await sut.execute('Nonexistent')
    expect(filteredRingsNoMatch).toHaveLength(0)
  })
})
