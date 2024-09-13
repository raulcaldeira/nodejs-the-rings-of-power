import { describe, it, expect, beforeEach } from 'vitest'
import { Species, Bearer } from '@/database/entities/Bearer'
import { InMemoryBearersRepository } from '@/repositories/in-memory/in-memory-bearers-repository'
import { UpdateBearerUseCase } from '../update'
import { BearerNotFoundError } from '@/use-cases/errors/bearer-not-found-error'

let bearersRepository: InMemoryBearersRepository
let sut: UpdateBearerUseCase

describe('UpdateBearerUseCase', () => {
  beforeEach(() => {
    bearersRepository = new InMemoryBearersRepository()
    sut = new UpdateBearerUseCase(bearersRepository)
  })

  it('should update an existing bearer', async () => {
    const initialBearer: Omit<Bearer, 'id'> = {
      name: 'Bearer 1',
      species: Species.HUMAN,
    }

    const createdBearer = await bearersRepository.createBearer(initialBearer)

    const updatedData = {
      name: 'Updated Bearer 1',
      species: Species.ELF,
    }

    const { bearer } = await sut.execute({
      id: createdBearer.id,
      ...updatedData,
    })

    expect(bearer).toEqual(
      expect.objectContaining({
        id: createdBearer.id,
        name: 'Updated Bearer 1',
        species: Species.ELF,
      }),
    )
  })

  it('should return null if the bearer does not exist', async () => {
    await expect(
      sut.execute({
        id: 999,
        name: 'Non-existent Bearer',
      }),
    ).rejects.toThrow(BearerNotFoundError)
  })
})
