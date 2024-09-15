import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateRingBearerUseCase } from '@/use-cases/ring_bearers/factories/make-update-ring-bearer'
import { RingBearerNotFoundError } from '@/use-cases/errors/ring-bearer-not-found-error'

export async function updateRingBearer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateRingBearerBodySchema = z.object({
    ringId: z.number().min(1, 'Ring ID é obrigatório.'),
    bearerId: z.number().min(1, 'Bearer ID é obrigatório.'),
    data: z.object({
      startDate: z
        .string()
        .transform((val) => new Date(val))
        .optional(),
      endDate: z
        .string()
        .transform((val) => (val ? new Date(val) : undefined))
        .optional(),
    }),
  })

  try {
    const { ringId, bearerId, data } = updateRingBearerBodySchema.parse(
      request.body,
    )

    const updateRingBearerUseCase = makeUpdateRingBearerUseCase()
    const { ringBearer } = await updateRingBearerUseCase.execute({
      ringId,
      bearerId,
      data,
    })

    return reply.status(200).send({ success: true, ringBearer })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse = {
        error_code: 'INVALID_DATA',
        error_description: error.errors
          .map((err) => `${err.path.join('.')} - ${err.message}`)
          .join(', '),
      }
      return reply.status(400).send(errorResponse)
    }

    if (error instanceof RingBearerNotFoundError) {
      return reply.status(404).send({ message: 'Ring Bearer não encontrado.' })
    }

    console.error(error)
    return reply.status(500).send({ message: 'Erro interno do servidor.' })
  }
}
