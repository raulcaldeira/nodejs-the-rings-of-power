import { FastifyInstance } from 'fastify'
import { create } from './create'
import { list } from './list'
import { update } from './update'

export async function ringsRoutes(app: FastifyInstance) {
  app.post('/rings', create)
  app.get('/rings', list)
  app.put('/rings/:id', update)
}
