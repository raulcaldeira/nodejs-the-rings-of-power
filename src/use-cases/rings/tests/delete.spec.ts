import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteRingUseCase } from '../delete'
import { RingNotFoundError } from '@/use-cases/errors/ring-not-found-error'
import { InMemoryRingsRepository } from '@/repositories/in-memory/in-memory-rings-repository'
import { Forgers, Ring } from '@/database/entities/Ring'

let ringsRepository: InMemoryRingsRepository
let sut: DeleteRingUseCase

describe('DeleteRingUseCase', () => {
  beforeEach(() => {
    ringsRepository = new InMemoryRingsRepository()
    sut = new DeleteRingUseCase(ringsRepository)
  })

  it('should delete an existing ring', async () => {
    // Arrange
    const initialRing: Omit<Ring, 'id' | 'createdAt'> = {
      name: 'Ring 1',
      power: 'Power 1',
      forgedBy: Forgers.ELF,
      imageUrl: 'http://example.com/ring1.png',
    }

    const createdRing = await ringsRepository.createRing(initialRing)

    const result = await sut.execute({ id: createdRing!.id })

    expect(result).toEqual({ success: true })
    expect(await ringsRepository.findRingById(createdRing!.id)).toBeNull()
  })

  it('should throw a RingNotFoundError if the ring does not exist', async () => {
    await expect(sut.execute({ id: 999 })).rejects.toThrow(RingNotFoundError)
  })
})
