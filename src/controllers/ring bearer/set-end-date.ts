import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { RingBearerNotFoundError } from '@/use-cases/errors/ring-bearer-not-found-error'
import { makeSetEndDateUseCase } from '@/use-cases/ring_bearers/factories/make-set-end-date'
import { StartDateGreaterThanOrEqualEndDate } from '@/use-cases/errors/start-date-greater-than-or-equal-end-date-error'

export async function setEndDate(request: FastifyRequest, reply: FastifyReply) {
  const setEndDateBodySchema = z.object({
    ringId: z
      .number()
      .nonnegative('Ring id não pode ser um número negativo.')
      .min(1, 'Ring id é obrigatório.'),
    bearerId: z
      .number()
      .nonnegative('Bearer id não pode ser um número negativo.')
      .min(1, 'Bearer id é obrigatório.'),
    endDate: z
      .string()
      .min(1, 'endDate é obrigatório.')
      .transform((val) => (val ? new Date(val) : undefined)),
  })

  try {
    const { ringId, bearerId, endDate } = setEndDateBodySchema.parse(
      request.body,
    )

    const setEndDateUseCase = makeSetEndDateUseCase()

    await setEndDateUseCase.execute({
      ringId,
      bearerId,
      endDate,
    })

    return reply.status(200).send({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Tratar erros de validação Zod
      const errorResponse = {
        error_code: 'INVALID_DATA',
        error_description: error.errors.map((err) => err.message).join(', '),
      }

      return reply.status(400).send(errorResponse)
    }

    if (error instanceof RingBearerNotFoundError) {
      return reply.status(404).send({ message: 'RingBearer not found.' })
    }

    if (error instanceof StartDateGreaterThanOrEqualEndDate) {
      return reply.status(400).send({
        message: 'End date cannot be less than or equal to start date.',
      })
    }

    console.error(error)
    return reply.status(500).send({ message: 'Internal server error.' })
  }
}
