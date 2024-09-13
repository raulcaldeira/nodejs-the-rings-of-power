import { InMemoryRingsRepository } from '../../../repositories/in-memory/in-memory-rings-repository'

import { Forgers } from '../../../database/entities/Ring'
import { expect, describe, it, beforeEach } from 'vitest'
import { MaxRingsForgedBySpecie } from '../../errors/max-rings-forged-by-this-species-error'
import { CreateRingUseCase } from '../create'

let ringsRepository: InMemoryRingsRepository
let createRingUseCase: CreateRingUseCase

describe('Create Ring Use Case', () => {
  beforeEach(() => {
    ringsRepository = new InMemoryRingsRepository()
    createRingUseCase = new CreateRingUseCase(ringsRepository)
  })

  it('should be able to create a ring', async () => {
    const { ring } = await createRingUseCase.execute({
      name: 'One Ring',
      power: 'Invisibility',
      forgedBy: Forgers.SAURON,
      imageUrl: 'http://example.com/one_ring.png',
    })

    expect(ring.id).toEqual(expect.any(Number))
    expect(ring.name).toBe('One Ring')
  })

  it('should not be able to create more than the allowed rings for Elves', async () => {
    await createRingUseCase.execute({
      name: 'Nenya',
      power: 'Water',
      forgedBy: Forgers.ELFOS,
      imageUrl: 'http://example.com/nenya.png',
    })

    await createRingUseCase.execute({
      name: 'Narya',
      power: 'Fire',
      forgedBy: Forgers.ELFOS,
      imageUrl: 'http://example.com/narya.png',
    })

    await createRingUseCase.execute({
      name: 'Vilya',
      power: 'Air',
      forgedBy: Forgers.ELFOS,
      imageUrl: 'http://example.com/vilya.png',
    })

    await expect(() =>
      createRingUseCase.execute({
        name: 'Extra Elven Ring',
        power: 'Unknown',
        forgedBy: Forgers.ELFOS,
        imageUrl: 'http://example.com/extra.png',
      }),
    ).rejects.toBeInstanceOf(MaxRingsForgedBySpecie)
  })

  it('should not be able to create more than the allowed rings for Sauron', async () => {
    await createRingUseCase.execute({
      name: 'One Ring',
      power: 'Invisibility',
      forgedBy: Forgers.SAURON,
      imageUrl: 'http://example.com/one_ring.png',
    })

    await expect(() =>
      createRingUseCase.execute({
        name: 'Another Ring',
        power: 'Unknown',
        forgedBy: Forgers.SAURON,
        imageUrl: 'http://example.com/another_ring.png',
      }),
    ).rejects.toBeInstanceOf(MaxRingsForgedBySpecie)
  })
})
