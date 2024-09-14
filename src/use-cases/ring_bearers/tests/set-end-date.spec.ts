import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryRingBearersRepository } from '@/repositories/in-memory/in-memory-ring-bearers-repository'
import { InMemoryRingsRepository } from '@/repositories/in-memory/in-memory-rings-repository'
import { InMemoryBearersRepository } from '@/repositories/in-memory/in-memory-bearers-repository'
import { Forgers } from '@/database/entities/Ring'
import { Species } from '@/database/entities/Bearer'
import { SetEndDateUseCase } from '../set-end-date'
import { RingBearerNotFoundError } from '@/use-cases/errors/ring-bearer-not-found-error'
import { StartDateGreaterThanOrEqualEndDate } from '@/use-cases/errors/start-date-greater-than-or-equal-end-date-error'

let ringBearersRepository: InMemoryRingBearersRepository
let ringRepository: InMemoryRingsRepository
let bearerRepository: InMemoryBearersRepository
let sut: SetEndDateUseCase

describe('SetEndDateUseCase', () => {
  beforeEach(async () => {
    ringBearersRepository = new InMemoryRingBearersRepository()
    ringRepository = new InMemoryRingsRepository()
    bearerRepository = new InMemoryBearersRepository()
    sut = new SetEndDateUseCase(ringBearersRepository)

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

  it('should set the end date for an existing RingBearer', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    const bearer = await bearerRepository.findBearerById(1)
    const ring = await ringRepository.findRingById(1)

    await ringBearersRepository.createRingBearer({
      bearer,
      ring,
      startDate: new Date(),
    })

    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

    const input = {
      bearerId: 1,
      ringId: 1,
      endDate: new Date(),
    }

    const response = await sut.execute(input)
    expect(response.success).toBe(true)
  })

  it('should throw RingBearerNotFoundError if the RingBearer does not exist', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

    await expect(() =>
      sut.execute({
        bearerId: 999,
        ringId: 999,
        endDate: new Date(),
      }),
    ).rejects.toBeInstanceOf(RingBearerNotFoundError)
  })

  it('should throw StartDateGreaterThanOrEqualEndDate if endDate is less than or equal to startDate', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    const bearer = await bearerRepository.findBearerById(1)
    const ring = await ringRepository.findRingById(1)

    const startDate = new Date()
    await ringBearersRepository.createRingBearer({
      bearer,
      ring,
      startDate,
    })

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    const invalidEndDate = new Date()

    await expect(() =>
      sut.execute({
        bearerId: 1,
        ringId: 1,
        endDate: invalidEndDate,
      }),
    ).rejects.toBeInstanceOf(StartDateGreaterThanOrEqualEndDate)
  })
})
