import { FastifyInstance } from 'fastify'
import { create } from './create'
import { list } from './list'

export async function ringsRoutes(app: FastifyInstance) {
  app.post('/rings', create)
  app.get('/rings', list)
}
