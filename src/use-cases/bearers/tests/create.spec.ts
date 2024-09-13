import { describe, it, expect, beforeEach } from 'vitest'
import { Species } from '@/database/entities/Bearer'

import { InMemoryBearersRepository } from '@/repositories/in-memory/in-memory-bearers-repository' // Supondo que você tenha esse repositório
import { CreateBearerUseCase } from '../create'

let bearersRepository: InMemoryBearersRepository
let sut: CreateBearerUseCase

describe('CreateBearerUseCase', () => {
  beforeEach(() => {
    bearersRepository = new InMemoryBearersRepository()
    sut = new CreateBearerUseCase(bearersRepository)
  })

  it('should create a new bearer successfully', async () => {
    const requestData = {
      name: 'Aragorn',
      species: Species.HUMAN,
    }

    const { bearer } = await sut.execute(requestData)

    expect(bearer).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: 'Aragorn',
        species: Species.HUMAN,
      }),
    )
  })
})
