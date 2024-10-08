import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeDeleteBearerUseCase } from '@/use-cases/bearers/factories/make-delete-bearer-use-case'
import { BearerNotFoundError } from '@/use-cases/errors/bearer-not-found-error'
import { BearerIsRingBearerError } from '@/use-cases/errors/bearer-is-ring-bearer-error'

export async function deleteBearer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteBearerParamsSchema = z.object({
    id: z.coerce.number(),
  })

  const { id } = deleteBearerParamsSchema.parse(request.params)

  const deleteBearerUseCase = makeDeleteBearerUseCase()

  try {
    const { success } = await deleteBearerUseCase.execute({ id })

    if (success) {
      return reply.status(200).send({ message: 'Bearer deleted successfully' })
    }
  } catch (error) {
    if (error instanceof BearerNotFoundError) {
      return reply.status(404).send({ message: 'Bearer not found' })
    }

    if (error instanceof BearerIsRingBearerError) {
      return reply.status(400).send({
        errorCode: 'BearerIsRingBearer',
        message: 'O personagem está portando um anél.',
      })
    }

    return reply.status(500).send({ message: 'Internal server error' })
  }
}
