import { AppDataSource } from './data-source'
import { Bearer, Species } from './entities/Bearer'
import { Forgers, Ring } from './entities/Ring'
import { RingBearer } from './entities/RingBearer'

async function seed() {
  // Inicializa a conexão com o banco de dados
  await AppDataSource.initialize()

  const bearerRepo = AppDataSource.getRepository(Bearer)
  const ringRepo = AppDataSource.getRepository(Ring)
  const ringBearerRepo = AppDataSource.getRepository(RingBearer)

  // Cria Bearers
  const bearers = [
    { name: 'Aragorn', species: Species.HUMAN },
    { name: 'Legolas', species: Species.ELF },
    { name: 'Gimli', species: Species.DWARF },
    { name: 'Frodo', species: Species.HUMAN },
  ]

  const savedBearers = await bearerRepo.save(bearers)

  // Cria Rings
  const rings = [
    {
      name: 'Um Anel',
      power: 'Dominar todos',
      forgedBy: Forgers.SAURON,
      imageUrl:
        'https://res.cloudinary.com/dkjjibl2o/image/upload/v1726685523/ring_of_power_j9kpl6.png',
    },
    {
      name: 'Anel de Gimli',
      power: 'Força',
      forgedBy: Forgers.DWARF,
      imageUrl:
        'https://res.cloudinary.com/dkjjibl2o/image/upload/v1726685523/ring_of_power_j9kpl6.png',
    },
    {
      name: 'Anel de Legolas',
      power: 'Visão',
      forgedBy: Forgers.ELF,
      imageUrl:
        'https://res.cloudinary.com/dkjjibl2o/image/upload/v1726685523/ring_of_power_j9kpl6.png',
    },
  ]

  const savedRings = await ringRepo.save(rings)

  // Cria RingBearers
  const ringBearers = [
    {
      ring: savedRings[0],
      bearer: savedBearers[0],
      startDate: new Date(),
      endDate: null,
    },
    {
      ring: savedRings[1],
      bearer: savedBearers[1],
      startDate: new Date(),
      endDate: null,
    },
    {
      ring: savedRings[2],
      bearer: savedBearers[2],
      startDate: new Date(),
      endDate: null,
    },
  ]

  await ringBearerRepo.save(ringBearers)

  console.log('Seed completed!')
}

seed()
  .catch((error) => console.log(error))
  .finally(() => AppDataSource.destroy())
