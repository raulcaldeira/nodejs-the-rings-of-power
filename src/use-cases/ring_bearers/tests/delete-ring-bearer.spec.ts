import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryRingBearersRepository } from '@/repositories/in-memory/in-memory-ring-bearers-repository'
import { InMemoryRingsRepository } from '@/repositories/in-memory/in-memory-rings-repository'
import { InMemoryBearersRepository } from '@/repositories/in-memory/in-memory-bearers-repository'
import { Forgers } from '@/database/entities/Ring'
import { Species } from '@/database/entities/Bearer'
import { RingBearerNotFoundError } from '@/use-cases/errors/ring-bearer-not-found-error'
import { DeleteRingBearerUseCase } from '../delete'

let ringBearersRepository: InMemoryRingBearersRepository
let ringRepository: InMemoryRingsRepository
let bearerRepository: InMemoryBearersRepository
let sut: DeleteRingBearerUseCase

describe('DeleteRingBearerUseCase', () => {
  beforeEach(async () => {
    ringBearersRepository = new InMemoryRingBearersRepository()
    ringRepository = new InMemoryRingsRepository()
    bearerRepository = new InMemoryBearersRepository()
    sut = new DeleteRingBearerUseCase(ringBearersRepository)

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

    const ring = await ringRepository.findRingById(1)
    const bearer = await bearerRepository.findBearerById(1)

    await ringBearersRepository.createRingBearer({
      ring,
      bearer,
      startDate: new Date(),
      endDate: null,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should delete a ring bearer successfully', async () => {
    const ringId = 1
    const bearerId = 1

    const response = await sut.execute({
      ringId,
      bearerId,
    })

    expect(response.success).toBe(true)

    const ringBearer = await ringBearersRepository.findByRingAndBearer(
      ringId,
      bearerId,
    )
    expect(ringBearer).toBeNull()
  })

  it('should throw RingBearerNotFoundError if the RingBearer does not exist', async () => {
    const ringId = 999
    const bearerId = 999

    await expect(() =>
      sut.execute({
        ringId,
        bearerId,
      }),
    ).rejects.toBeInstanceOf(RingBearerNotFoundError)
  })
})
