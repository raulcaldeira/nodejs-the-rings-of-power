import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryRingBearersRepository } from '@/repositories/in-memory/in-memory-ring-bearers-repository'
import { InMemoryRingsRepository } from '@/repositories/in-memory/in-memory-rings-repository'
import { InMemoryBearersRepository } from '@/repositories/in-memory/in-memory-bearers-repository'
import { Forgers } from '@/database/entities/Ring'
import { Species } from '@/database/entities/Bearer'
import { RingBearerNotFoundError } from '@/use-cases/errors/ring-bearer-not-found-error'
import { UpdateRingBearerUseCase } from '../update'
import { UpdateRingBearerInput } from '@/repositories/ring-bearers-repository'

let ringBearersRepository: InMemoryRingBearersRepository
let ringRepository: InMemoryRingsRepository
let bearerRepository: InMemoryBearersRepository
let sut: UpdateRingBearerUseCase

describe('SetEndDateUseCase', () => {
  beforeEach(async () => {
    ringBearersRepository = new InMemoryRingBearersRepository()
    ringRepository = new InMemoryRingsRepository()
    bearerRepository = new InMemoryBearersRepository()
    sut = new UpdateRingBearerUseCase(ringBearersRepository)

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

  it('should update a ring bearer successfully', async () => {
    const ringId = 1
    const bearerId = 1

    const ring = await ringRepository.findRingById(ringId)
    const bearer = await bearerRepository.findBearerById(bearerId)

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    const startDate = new Date()

    await ringBearersRepository.createRingBearer({ bearer, ring, startDate })

    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))
    const newDate = new Date()
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
    const endDate = new Date()

    const updatedData: UpdateRingBearerInput = {
      startDate: newDate,
      endDate,
    }

    const { ringBearer } = await sut.execute({
      ringId,
      bearerId,
      data: updatedData,
    })

    expect(ringBearer.startDate).toEqual(newDate)
    expect(ringBearer.endDate).toEqual(endDate)
  })

  it('should throw RingBearerNotFoundError if the RingBearer does not exist', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

    const bearer = await bearerRepository.findBearerById(1)

    const data = {
      bearer,
    }

    await expect(() =>
      sut.execute({
        bearerId: 999,
        ringId: 999,
        data,
      }),
    ).rejects.toBeInstanceOf(RingBearerNotFoundError)
  })
})
