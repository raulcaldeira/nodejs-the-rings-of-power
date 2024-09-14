import { FastifyInstance } from 'fastify'
import { createBearer } from './create'

export async function bearersRoutes(app: FastifyInstance) {
  app.post('/bearers', createBearer)
}
