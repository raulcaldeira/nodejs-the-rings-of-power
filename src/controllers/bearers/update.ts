import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateBearerUseCase } from '@/use-cases/bearers/factories/make-update-bearer-use-case'
import { Species } from '@/database/entities/Bearer'
import { BearerNotFoundError } from '@/use-cases/errors/bearer-not-found-error'

export async function updateBearer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateBearerBodySchema = z.object({
    name: z.string().optional(),
    species: z
      .enum([Species.ELF, Species.DWARF, Species.HUMAN, Species.MAGE])
      .optional(),
  })

  const updateBearerParamsSchema = z.object({
    id: z.coerce.number(),
  })

  const { id } = updateBearerParamsSchema.parse(request.params)
  const { name, species } = updateBearerBodySchema.parse(request.body)

  const updateBearerUseCase = makeUpdateBearerUseCase()

  try {
    const { bearer } = await updateBearerUseCase.execute({
      id,
      name,
      species,
    })

    return reply.status(200).send({ bearer })
  } catch (error) {
    if (error instanceof BearerNotFoundError) {
      return reply.status(404).send({ message: 'Bearer not found' })
    }
  }
}
