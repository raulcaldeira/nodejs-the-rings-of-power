import { FastifyInstance } from 'fastify'
import { create } from './create'

export async function ringsRoutes(app: FastifyInstance) {
  app.post('/rings', create)
}
