import { FastifyReply, FastifyRequest } from 'fastify'
import { makeListAllBearersUseCase } from '@/use-cases/bearers/factories/make-list-all-use-case'

export async function listAllBearers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listAllBearersUseCase = makeListAllBearersUseCase()

  try {
    const { bearers } = await listAllBearersUseCase.execute()

    return reply.status(201).send(bearers)
  } catch (error) {
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
