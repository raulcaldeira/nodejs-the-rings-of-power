import { Forgers } from '@/database/entities/Ring'
import { makeCreateRingUseCase } from '@/use-cases/rings/factories/make-create-ring-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { MaxRingsForgedBySpecie } from '@/use-cases/errors/max-rings-forged-by-this-species-error'
import { BearerNotFoundError } from '@/use-cases/errors/bearer-not-found-error'

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
    bearerId: z.number().optional(),
    startDate: z
      .string()
      .optional()
      .transform((val) => new Date(val)),
    endDate: z
      .string()
      .optional()
      .transform((val) => (val ? new Date(val) : undefined)),
  })

  const { name, power, forgedBy, imageUrl, bearerId, startDate, endDate } =
    createRingBodySchema.parse(request.body)

  const createRingUseCase = makeCreateRingUseCase()

  try {
    await createRingUseCase.execute({
      name,
      power,
      forgedBy,
      imageUrl,
      bearerId,
      startDate,
      endDate,
    })

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof MaxRingsForgedBySpecie) {
      return reply.status(400).send({
        errorCode: 'MaxRingsForgedBySpecie',
        message:
          'O número máximo de anéis forjados por essa spécie já foi atingido.',
      })
    }

    if (error instanceof BearerNotFoundError) {
      return reply.status(404).send({
        errorCode: 'BearerNotFoundError',
        message: 'Portador não encontrado.',
      })
    }

    // Handle other unknown errors
    return reply.status(500).send({
      message: 'Internal server error.',
    })
  }
}
