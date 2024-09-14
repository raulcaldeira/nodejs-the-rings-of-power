import { FastifyInstance } from 'fastify'
import { create } from './create'
import { list } from './list'
import { update } from './update'
import { deleteRing } from './delete'

export async function ringsRoutes(app: FastifyInstance) {
  app.post('/rings', create)
  app.get('/rings', list)
  app.put('/rings/:id', update)
  app.delete('/rings/:id', deleteRing)
}
