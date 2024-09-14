import { FastifyInstance } from 'fastify'
import { setRingBearer } from './create'

export async function ringBearersRoutes(app: FastifyInstance) {
  app.post('/ring-bearers', setRingBearer)
}
