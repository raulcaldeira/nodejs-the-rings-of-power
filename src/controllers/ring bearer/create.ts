import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { RingNotFoundError } from '@/use-cases/errors/ring-not-found-error'
import { BearerNotFoundError } from '@/use-cases/errors/bearer-not-found-error'
import { makeSetRingBearerUseCase } from '@/use-cases/ring_bearers/factories/make-set-ring-bearer'
import { StartDateGreaterThanOrEqualEndDate } from '@/use-cases/errors/start-date-greater-than-or-equal-end-date-error'
import { BearerAlreadyExistsForThisRingError } from '@/use-cases/errors/bearer-already-exists-for-this-ring-error'

export async function setRingBearer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Definindo o schema de validação do corpo da requisição
  const setRingBearerBodySchema = z.object({
    ringId: z.number(),
    bearerId: z.number(),
    startDate: z.string().transform((val) => new Date(val)),
    endDate: z
      .string()
      .optional()
      .transform((val) => (val ? new Date(val) : undefined)),
  })

  const { ringId, bearerId, startDate, endDate } =
    setRingBearerBodySchema.parse(request.body)

  const setRingBearerUseCase = makeSetRingBearerUseCase()

  try {
    const { ringBearer } = await setRingBearerUseCase.execute({
      ringId,
      bearerId,
      startDate,
      endDate,
    })

    return reply.status(201).send(ringBearer)
  } catch (error) {
    if (error instanceof RingNotFoundError) {
      return reply.status(404).send({ message: 'Ring not found.' })
    }

    if (error instanceof BearerNotFoundError) {
      return reply.status(404).send({ message: 'Bearer not found.' })
    }

    if (error instanceof StartDateGreaterThanOrEqualEndDate) {
      return reply
        .status(400)
        .send({ message: 'End date less than or equal start date.' })
    }

    if (error instanceof BearerAlreadyExistsForThisRingError) {
      return reply
        .status(400)
        .send({ message: 'A bearer already exists for this ring.' })
    }

    return reply.status(500).send({ message: 'Internal server error' })
  }
}
