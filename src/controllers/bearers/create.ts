import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateBearerUseCase } from '@/use-cases/bearers/factories/make-create-bearer-use-case'
import { Species } from '@/database/entities/Bearer'

export async function createBearer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createBearerBodySchema = z.object({
    name: z.string(),
    species: z.enum([Species.ELF, Species.DWARF, Species.HUMAN, Species.MAGE]),
  })

  const { name, species } = createBearerBodySchema.parse(request.body)

  const createBearerUseCase = makeCreateBearerUseCase()

  try {
    const { bearer } = await createBearerUseCase.execute({
      name,
      species,
    })

    return reply.status(201).send(bearer)
  } catch (error) {
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
