import { FastifyInstance } from 'fastify'
import { createBearer } from './create'
import { updateBearer } from './update'
import { deleteBearer } from './delete'
import { listAllBearers } from './list-all'

export async function bearersRoutes(app: FastifyInstance) {
  app.get('/bearers', listAllBearers)
  app.post('/bearers', createBearer)
  app.put('/bearers/:id', updateBearer)
  app.delete('/bearers/:id', deleteBearer)
}
