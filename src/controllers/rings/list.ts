import { makeGetAllRingsUseCase } from '@/use-cases/rings/factories/make-get-all-rings-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

interface ListRingsQuery {
  search?: string // Define o tipo para o parâmetro de busca
}

export async function list(
  request: FastifyRequest<{ Querystring: ListRingsQuery }>,
  reply: FastifyReply,
) {
  const getAllRingsUseCase = makeGetAllRingsUseCase()

  // Obtendo o parâmetro de busca da query string
  const { search } = request.query

  const { rings } = await getAllRingsUseCase.execute(search)

  return reply.status(200).send(rings)
}
