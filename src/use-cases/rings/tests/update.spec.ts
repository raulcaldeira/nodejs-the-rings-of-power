import { describe, it, expect, beforeEach } from 'vitest'

import { RingsRepository } from '@/repositories/rings-repository'
import { Ring, Forgers } from '@/database/entities/Ring'
import { UpdateRingUseCase } from '../update'
import { MaxRingsForgedBySpecie } from '@/use-cases/errors/max-rings-forged-by-this-species-error'
import { RingNotFoundError } from '@/use-cases/errors/ring-not-found-error'

class InMemoryRingsRepository implements RingsRepository {
  private rings: Ring[] = []

  async createRing(data: Omit<Ring, 'id' | 'createdAt'>): Promise<Ring | null> {
    const ring = { ...data, id: this.rings.length + 1 } as Ring
    this.rings.push(ring)
    return ring
  }

  async getAllRings(): Promise<Ring[]> {
    return this.rings
  }

  async countRingsForgedBy(forgedBy: Forgers): Promise<number> {
    return this.rings.filter((ring) => ring.forgedBy === forgedBy).length
  }

  async updateRing(
    id: number,
    data: Partial<Omit<Ring, 'id' | 'createdAt'>>,
  ): Promise<Ring | null> {
    const ringIndex = this.rings.findIndex((ring) => ring.id === id)
    if (ringIndex === -1) return null

    const updatedRing = { ...this.rings[ringIndex], ...data }
    this.rings[ringIndex] = updatedRing
    return updatedRing
  }

  async findRingById(id: number): Promise<Ring | null> {
    return this.rings.find((ring) => ring.id === id) || null
  }
}

describe('UpdateRingUseCase', () => {
  let ringsRepository: InMemoryRingsRepository
  let updateRingUseCase: UpdateRingUseCase

  beforeEach(() => {
    ringsRepository = new InMemoryRingsRepository()
    updateRingUseCase = new UpdateRingUseCase(ringsRepository)
  })

  it('should update an existing ring', async () => {
    const initialRing: Omit<Ring, 'id' | 'createdAt'> = {
      name: 'Ring 1',
      power: 'Power 1',
      forgedBy: Forgers.ELFOS,
      imageUrl: 'http://example.com/ring1.png',
    }

    const createdRing = await ringsRepository.createRing(initialRing)

    const updatedData = {
      name: 'Updated Ring 1',
      power: 'Updated Power 1',
      forgedBy: Forgers.ANOES,
    }

    const { ring } = await updateRingUseCase.execute({
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
      updateRingUseCase.execute({
        id: 999,
        name: 'Non-existent Ring',
      }),
    ).rejects.toThrow(RingNotFoundError)
  })

  it('should throw an error if the new forgedBy exceeds the limit', async () => {
    const initialRing: Omit<Ring, 'id' | 'createdAt'> = {
      name: 'Ring 1',
      power: 'Power 1',
      forgedBy: Forgers.ANOES,
      imageUrl: 'http://example.com/ring1.png',
    }

    await ringsRepository.createRing(initialRing)

    await Promise.all([
      ringsRepository.createRing({ ...initialRing, forgedBy: Forgers.ELFOS }),
      ringsRepository.createRing({ ...initialRing, forgedBy: Forgers.ELFOS }),
      ringsRepository.createRing({ ...initialRing, forgedBy: Forgers.ELFOS }),
    ])

    await expect(
      updateRingUseCase.execute({
        id: 1,
        forgedBy: Forgers.ELFOS,
      }),
    ).rejects.toThrow(MaxRingsForgedBySpecie)
  })
})
