import { FastifyInstance } from 'fastify'
import { setRingBearer } from './create'
import { setEndDate } from './set-end-date'
import { updateRingBearer } from './update'
import { deleteRingBearer } from './delete'

export async function ringBearersRoutes(app: FastifyInstance) {
  app.post('/ring-bearers', setRingBearer)
  app.patch('/ring-bearers/set-end-date', setEndDate)
  app.put('/ring-bearers', updateRingBearer)
  app.delete('/ring-bearers', deleteRingBearer)
}
