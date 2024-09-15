import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateRingBearerUseCase } from '@/use-cases/ring_bearers/factories/make-update-ring-bearer'
import { RingBearerNotFoundError } from '@/use-cases/errors/ring-bearer-not-found-error'

export async function updateRingBearer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Definindo o schema de validação para os dados de entrada
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
    // Validando os dados da requisição
    const { ringId, bearerId, data } = updateRingBearerBodySchema.parse(
      request.body,
    )

    // Chamando o use case para atualizar o Ring Bearer
    const updateRingBearerUseCase = makeUpdateRingBearerUseCase()
    const { ringBearer } = await updateRingBearerUseCase.execute({
      ringId,
      bearerId,
      data,
    })

    // Retornando a resposta de sucesso
    return reply.status(200).send({ success: true, ringBearer })
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Tratando erros de validação do Zod
      const errorResponse = {
        error_code: 'INVALID_DATA',
        error_description: error.errors
          .map((err) => `${err.path.join('.')} - ${err.message}`)
          .join(', '),
      }
      return reply.status(400).send(errorResponse)
    }

    if (error instanceof RingBearerNotFoundError) {
      // Tratando erro de Ring Bearer não encontrado
      return reply.status(404).send({ message: 'Ring Bearer não encontrado.' })
    }

    // Tratando erros internos do servidor
    console.error(error)
    return reply.status(500).send({ message: 'Erro interno do servidor.' })
  }
}
