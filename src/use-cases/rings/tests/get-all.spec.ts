import { describe, it, expect, beforeEach } from 'vitest'
import { GetAllRingsUseCase } from '../get-all'
import { InMemoryRingsRepository } from '@/repositories/in-memory/in-memory-rings-repository'
import { Forgers, Ring } from '@/database/entities/Ring'

// Criar uma instância do repositório e do use-case
let ringsRepository: InMemoryRingsRepository
let sut: GetAllRingsUseCase

describe('GetAllRingsUseCase', () => {
  beforeEach(() => {
    // Inicializa o repositório em memória e o use-case
    ringsRepository = new InMemoryRingsRepository()
    sut = new GetAllRingsUseCase(ringsRepository)
  })

  it('should return all rings', async () => {
    // Define alguns anéis para adicionar ao repositório
    const ringOne: Ring = {
      id: 1,
      name: 'Ring of Power',
      power: 'Grants immense power',
      forgedBy: Forgers.SAURON,
      imageUrl: 'http://example.com/ring1.png',
    }

    const ringTwo: Ring = {
      id: 2,
      name: 'Ring of Wisdom',
      power: 'Grants great wisdom',
      forgedBy: Forgers.ELFOS,
      imageUrl: 'http://example.com/ring2.png',
    }

    // Adiciona os anéis ao repositório
    ringsRepository.createRing(ringOne)
    ringsRepository.createRing(ringTwo)

    // Executa o use-case
    const { rings } = await sut.execute()

    // Verifica se os anéis foram retornados corretamente
    expect(rings).toHaveLength(2)
    expect(rings).toContainEqual(ringOne)
    expect(rings).toContainEqual(ringTwo)
  })

  it('should return an empty array if no rings exist', async () => {
    // Executa o use-case sem anéis no repositório
    const { rings } = await sut.execute()

    // Verifica se a resposta é um array vazio
    expect(rings).toHaveLength(0)
  })
})
