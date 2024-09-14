import { makeGetAllRingsUseCase } from '@/use-cases/rings/factories/make-get-all-rings-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const getAllRingsUseCase = makeGetAllRingsUseCase()

  const rings = await getAllRingsUseCase.execute()

  return reply.status(200).send(rings)
}
