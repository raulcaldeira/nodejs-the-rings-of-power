import { FastifyInstance } from 'fastify'
import { setRingBearer } from './create'
import { setEndDate } from './set-end-date'
import { updateRingBearer } from './update'
import { deleteRingBearer } from './delete'
import { listAllRingBearers } from './list'

export async function ringBearersRoutes(app: FastifyInstance) {
  app.post('/ring-bearers', setRingBearer)
  app.get('/ring-bearers', listAllRingBearers)
  app.patch('/ring-bearers/set-end-date', setEndDate)
  app.put('/ring-bearers', updateRingBearer)
  app.delete('/ring-bearers', deleteRingBearer)
}
