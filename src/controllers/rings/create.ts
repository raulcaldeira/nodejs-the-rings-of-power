import { Forgers } from '@/database/entities/Ring'
import { makeCreateRingUseCase } from '@/use-cases/rings/factories/make-create-ring-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createRingBodySchema = z.object({
    name: z.string(),
    power: z.string(),
    forgedBy: z.enum([
      Forgers.ELF,
      Forgers.DWARF,
      Forgers.HUMAN,
      Forgers.SAURON,
    ]),
    imageUrl: z.string().url(),
  })

  const { name, power, forgedBy, imageUrl } = createRingBodySchema.parse(
    request.body,
  )

  const createRingUseCase = makeCreateRingUseCase()

  await createRingUseCase.execute({
    name,
    power,
    forgedBy,
    imageUrl,
  })

  return reply.status(201).send()
}
