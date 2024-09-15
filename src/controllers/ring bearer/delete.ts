import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeDeleteRingBearerUseCase } from '@/use-cases/ring_bearers/factories/make-delete-ring-bearer'
import { RingBearerNotFoundError } from '@/use-cases/errors/ring-bearer-not-found-error'

export async function deleteRingBearer(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Definindo o schema de validação para o corpo da requisição
  const deleteRingBearerBodySchema = z.object({
    ringId: z.number().min(1, 'Ring ID é obrigatório.'),
    bearerId: z.number().min(1, 'Bearer ID é obrigatório.'),
  })

  try {
    // Validando os dados do corpo da requisição
    const { ringId, bearerId } = deleteRingBearerBodySchema.parse(request.body)

    // Chamando o use case para deletar o Ring Bearer
    const deleteRingBearerUseCase = makeDeleteRingBearerUseCase()

    await deleteRingBearerUseCase.execute({
      ringId,
      bearerId,
    })

    // Retornando a resposta de sucesso
    return reply.status(200).send({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Tratando erros de validação dos parâmetros
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
