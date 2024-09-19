import { FastifyReply, FastifyRequest } from 'fastify'
import { makeListAllRingBearersUseCase } from '@/use-cases/ring_bearers/factories/make-list-all-ring-bearers'

export async function listAllRingBearers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const setRingBearerUseCase = makeListAllRingBearersUseCase()

  try {
    const ringBearers = await setRingBearerUseCase.execute()

    return reply.status(200).send(ringBearers)
  } catch (error) {
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
