import { RingNotFoundError } from '@/use-cases/errors/ring-not-found-error'
import { makeDeleteRingUseCase } from '@/use-cases/rings/factories/make-delete-ring-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteRing(request: FastifyRequest, reply: FastifyReply) {
  const deleteRingParamsSchema = z.object({
    id: z.coerce.number(),
  })

  const { id } = deleteRingParamsSchema.parse(request.params)

  try {
    const deleteRingUseCase = makeDeleteRingUseCase()

    const { success } = await deleteRingUseCase.execute({ id })

    if (success) {
      return reply.status(200).send()
    }
  } catch (error) {
    if (error instanceof RingNotFoundError) {
      return reply.status(404).send({ message: 'Ring not found' })
    }

    return reply.status(500).send({ message: 'Internal server error' })
  }
}
