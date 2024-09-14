import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { RingNotFoundError } from '@/use-cases/errors/ring-not-found-error'
import { BearerNotFoundError } from '@/use-cases/errors/bearer-not-found-error'
import { SetRingBearerUseCase } from '../set-ring-bearer'
import { InMemoryRingBearersRepository } from '@/repositories/in-memory/in-memory-ring-bearers-repository'
import { InMemoryRingsRepository } from '@/repositories/in-memory/in-memory-rings-repository'
import { InMemoryBearersRepository } from '@/repositories/in-memory/in-memory-bearers-repository'
import { Forgers } from '@/database/entities/Ring'
import { Species } from '@/database/entities/Bearer'

let ringBearersRepository: InMemoryRingBearersRepository
let ringRepository: InMemoryRingsRepository
let bearerRepository: InMemoryBearersRepository
let sut: SetRingBearerUseCase

describe('SetRingBearerUseCase', () => {
  beforeEach(async () => {
    ringBearersRepository = new InMemoryRingBearersRepository()
    ringRepository = new InMemoryRingsRepository()
    bearerRepository = new InMemoryBearersRepository()
    sut = new SetRingBearerUseCase(
      ringBearersRepository,
      ringRepository,
      bearerRepository,
    )

    await ringRepository.createRing({
      name: 'Narya',
      power: 'Fire',
      forgedBy: Forgers.ELF,
      imageUrl: 'http://example.com/narya.png',
    })

    await bearerRepository.createBearer({
      name: 'Aragorn',
      species: Species.HUMAN,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should create a ring bearer association successfully', async () => {
    const ringId = 1
    const bearerId = 1
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    const startDate = new Date()
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
    const endDate = new Date()

    const ring = await ringRepository.findRingById(ringId)
    const bearer = await bearerRepository.findBearerById(bearerId)

    const dataRingBearer = {
      id: 1,
      ring,
      bearer,
      startDate,
      endDate,
    }

    const { ringBearer } = await sut.execute({
      ringId,
      bearerId,
      startDate,
      endDate,
    })

    expect(ringBearer).toEqual(dataRingBearer)
  })

  it('should throw an error if the ring does not exist', async () => {
    const ringId = 999
    const bearerId = 1
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
    const startDate = new Date()

    await expect(
      sut.execute({
        ringId,
        bearerId,
        startDate,
      }),
    ).rejects.toThrow(RingNotFoundError)
  })

  it('should throw an error if the bearer does not exist', async () => {
    const ringId = 1
    const bearerId = 999
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
    const startDate = new Date()

    await expect(
      sut.execute({
        ringId,
        bearerId,
        startDate,
      }),
    ).rejects.toThrow(BearerNotFoundError)
  })
})
