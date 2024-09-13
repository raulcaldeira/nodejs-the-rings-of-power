import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryBearersRepository } from '@/repositories/in-memory/in-memory-bearers-repository'
import { DeleteBearerUseCase } from '../delete'
import { Bearer, Species } from '@/database/entities/Bearer'
import { BearerNotFoundError } from '@/use-cases/errors/bearer-not-found-error'

let bearersRepository: InMemoryBearersRepository
let sut: DeleteBearerUseCase

describe('DeleteRingUseCase', () => {
  beforeEach(() => {
    bearersRepository = new InMemoryBearersRepository()
    sut = new DeleteBearerUseCase(bearersRepository)
  })

  it('should delete an existing bearer', async () => {
    // Arrange
    const initialBearer: Omit<Bearer, 'id' | 'createdAt'> = {
      name: 'Bearer 1',
      species: Species.HUMAN,
    }

    const createdBearer = await bearersRepository.createBearer(initialBearer)

    const result = await sut.execute({ id: createdBearer!.id })

    expect(result).toEqual({ success: true })
    expect(await bearersRepository.findBearerById(createdBearer!.id)).toBeNull()
  })

  it('should throw a BearerNotFoundError if the ring does not exist', async () => {
    await expect(sut.execute({ id: 999 })).rejects.toThrow(BearerNotFoundError)
  })
})
