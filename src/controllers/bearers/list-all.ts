import { FastifyReply, FastifyRequest } from 'fastify'
import { makeListAllBearersUseCase } from '@/use-cases/bearers/factories/make-list-all-use-case'

interface ListBearersQuery {
  search?: string
}

export async function listAllBearers(
  request: FastifyRequest<{ Querystring: ListBearersQuery }>,
  reply: FastifyReply,
) {
  const listAllBearersUseCase = makeListAllBearersUseCase()

  const { search } = request.query

  try {
    const { bearers } = await listAllBearersUseCase.execute(search)

    return reply.status(200).send(bearers)
  } catch (error) {
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
