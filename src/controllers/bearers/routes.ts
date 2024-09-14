import { FastifyInstance } from 'fastify'
import { createBearer } from './create'
import { updateBearer } from './update'

export async function bearersRoutes(app: FastifyInstance) {
  app.post('/bearers', createBearer)
  app.put('/bearers/:id', updateBearer)
}
