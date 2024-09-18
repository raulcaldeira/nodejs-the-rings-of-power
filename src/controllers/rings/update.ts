import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { Forgers } from '@/database/entities/Ring'
import { makeUpdateRingUseCase } from '@/use-cases/rings/factories/make-update-ring-use-case'
import { RingNotFoundError } from '@/use-cases/errors/ring-not-found-error'
import { MaxRingsForgedBySpecie } from '@/use-cases/errors/max-rings-forged-by-this-species-error'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateRingParamsSchema = z.object({
    id: z.coerce.number(),
  })

  const updateRingBodySchema = z.object({
    name: z.string().optional(),
    power: z.string().optional(),
    forgedBy: z
      .enum([Forgers.ELF, Forgers.DWARF, Forgers.HUMAN, Forgers.SAURON])
      .optional(),
    imageUrl: z.string().url().optional(),
  })

  const { id } = updateRingParamsSchema.parse(request.params)
  const { name, power, forgedBy, imageUrl } = updateRingBodySchema.parse(
    request.body,
  )

  try {
    const updateRingUseCase = makeUpdateRingUseCase()

    const { ring } = await updateRingUseCase.execute({
      id,
      name,
      power,
      forgedBy,
      imageUrl,
    })

    if (!ring) {
      return reply.status(404).send({ message: 'Ring not found' })
    }

    return reply.status(200).send(ring)
  } catch (error) {
    if (error instanceof RingNotFoundError) {
      return reply.status(404).send({ message: 'Ring not found' })
    }

    if (error instanceof MaxRingsForgedBySpecie) {
      return reply.status(400).send({
        errorCode: 'MaxRingsForgedBySpecie',
        message:
          'O número máximo de anéis forjados por essa spécie já foi atingido.',
      })
    }

    return reply.status(500).send({ message: 'Internal server error' })
  }
}
