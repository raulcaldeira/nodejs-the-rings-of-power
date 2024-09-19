import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryBearersRepository } from '@/repositories/in-memory/in-memory-bearers-repository'
import { DeleteBearerUseCase } from '../delete'
import { Bearer, Species } from '@/database/entities/Bearer'
import { BearerNotFoundError } from '@/use-cases/errors/bearer-not-found-error'
import { InMemoryRingBearersRepository } from '@/repositories/in-memory/in-memory-ring-bearers-repository'
import { BearerIsRingBearerError } from '@/use-cases/errors/bearer-is-ring-bearer-error'
import { Forgers } from '@/database/entities/Ring'

let bearersRepository: InMemoryBearersRepository
let ringBearersRepository: InMemoryRingBearersRepository
let sut: DeleteBearerUseCase

describe('DeleteBearerUseCase', () => {
  beforeEach(() => {
    bearersRepository = new InMemoryBearersRepository()
    ringBearersRepository = new InMemoryRingBearersRepository()
    sut = new DeleteBearerUseCase(bearersRepository, ringBearersRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should delete an existing bearer', async () => {
    const initialBearer = {
      name: 'Bearer 1',
      species: Species.HUMAN,
    }

    const createdBearer = await bearersRepository.createBearer(initialBearer)

    const result = await sut.execute({ id: 1 })

    expect(result).toEqual({ success: true })
    expect(await bearersRepository.findBearerById(createdBearer!.id)).toBeNull()
  })

  it('should throw a BearerNotFoundError if the bearer does not exist', async () => {
    await expect(sut.execute({ id: 999 })).rejects.toThrow(BearerNotFoundError)
  })

  it('should throw BearerIsRingBearerError if the bearer is a ring bearer', async () => {
    // Arrange
    const initialBearer: Omit<Bearer, 'id' | 'createdAt'> = {
      name: 'Bearer 2',
      species: Species.ELF,
    }
    const createdBearer = await bearersRepository.createBearer(initialBearer)

    const ring = {
      id: 1,
      imageUrl: 'example.com',
      name: 'Anél teste',
      power: 'Poder teste',
      forgedBy: Forgers.DWARF,
    }

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await ringBearersRepository.createRingBearer({
      bearer: createdBearer,
      ring,
      startDate: new Date(),
      endDate: null,
    })

    // Act & Assert
    await expect(sut.execute({ id: createdBearer.id })).rejects.toThrow(
      BearerIsRingBearerError,
    )
  })
})
