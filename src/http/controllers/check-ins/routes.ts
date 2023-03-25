import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../../middlewares/verify-jwt'
import { createCheckIn } from './create-check-in.controller'
import { checkInsHistory } from './get-check-ins-history.controller'
import { getMetrics } from './get-metrics.controller'
import { validateCheckIn } from './validate-check-in.controller'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/check-ins/history', checkInsHistory)
  app.get('/check-ins/metrics', getMetrics)

  app.post('/gyms/:gymId/check-ins', createCheckIn)
  app.patch('/check-ins/:checkInId/validate', validateCheckIn)
}
