import { describe, it, expect, beforeEach } from 'vitest'

import { Ring, Forgers } from '@/database/entities/Ring'
import { UpdateRingUseCase } from '../update'
import { MaxRingsForgedBySpecie } from '@/use-cases/errors/max-rings-forged-by-this-species-error'
import { RingNotFoundError } from '@/use-cases/errors/ring-not-found-error'
import { InMemoryRingsRepository } from '@/repositories/in-memory/in-memory-rings-repository'

let ringsRepository: InMemoryRingsRepository
let sut: UpdateRingUseCase

describe('UpdateRingUseCase', () => {
  beforeEach(() => {
    ringsRepository = new InMemoryRingsRepository()
    sut = new UpdateRingUseCase(ringsRepository)
  })

  it('should update an existing ring', async () => {
    const initialRing: Omit<Ring, 'id' | 'createdAt'> = {
      name: 'Ring 1',
      power: 'Power 1',
      forgedBy: Forgers.ELF,
      imageUrl: 'http://example.com/ring1.png',
    }

    const createdRing = await ringsRepository.createRing(initialRing)

    const updatedData = {
      name: 'Updated Ring 1',
      power: 'Updated Power 1',
      forgedBy: Forgers.DWARF,
    }

    const { ring } = await sut.execute({
      id: createdRing!.id,
      ...updatedData,
    })

    expect(ring).toEqual(
      expect.objectContaining({
        id: createdRing!.id,
        name: 'Updated Ring 1',
        power: 'Updated Power 1',
        forgedBy: 'anões',
      }),
    )
  })

  it('should return null if the ring does not exist', async () => {
    await expect(
      sut.execute({
        id: 999,
        name: 'Non-existent Ring',
      }),
    ).rejects.toThrow(RingNotFoundError)
  })

  it('should throw an error if the new forgedBy exceeds the limit', async () => {
    const initialRing: Omit<Ring, 'id' | 'createdAt'> = {
      name: 'Ring 1',
      power: 'Power 1',
      forgedBy: Forgers.DWARF,
      imageUrl: 'http://example.com/ring1.png',
    }

    await ringsRepository.createRing(initialRing)

    await Promise.all([
      ringsRepository.createRing({ ...initialRing, forgedBy: Forgers.ELF }),
      ringsRepository.createRing({ ...initialRing, forgedBy: Forgers.ELF }),
      ringsRepository.createRing({ ...initialRing, forgedBy: Forgers.ELF }),
    ])

    await expect(
      sut.execute({
        id: 1,
        forgedBy: Forgers.ELF,
      }),
    ).rejects.toThrow(MaxRingsForgedBySpecie)
  })
})
