import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryBearersRepository } from '@/repositories/in-memory/in-memory-bearers-repository'
import { Species, Bearer } from '@/database/entities/Bearer'
import { ListAllBearersUseCase } from '../list-all'

let bearersRepository: InMemoryBearersRepository
let sut: ListAllBearersUseCase

describe('GetAllBearersUseCase', () => {
  beforeEach(() => {
    bearersRepository = new InMemoryBearersRepository()

    sut = new ListAllBearersUseCase(bearersRepository)
  })

  it('should return all bearers', async () => {
    const bearerOne: Bearer = {
      id: 1,
      name: 'Raul',
      species: Species.HUMAN,
    }

    const bearerTwo: Bearer = {
      id: 2,
      name: 'Aragorn',
      species: Species.HUMAN,
    }

    bearersRepository.createBearer(bearerOne)
    bearersRepository.createBearer(bearerTwo)

    const { bearers } = await sut.execute()

    expect(bearers).toHaveLength(2)
    expect(bearers).toContainEqual(bearerOne)
    expect(bearers).toContainEqual(bearerTwo)
  })

  it('should return an empty array if no bearers exist', async () => {
    const { bearers } = await sut.execute()

    expect(bearers).toHaveLength(0)
  })
})
