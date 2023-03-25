import { FastifyInstance } from 'fastify'
import { verifyUserRole } from '~/http/middlewares/verify-user-role'

import { verifyJWT } from '../../middlewares/verify-jwt'
import { createGym } from './create-gym.controller'
import { fetchNearbyGyms } from './fetch-nearby-gyms.controller'
import { searchGyms } from './search-gyms.controller'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/gyms/search', searchGyms)
  app.get('/gyms/nearby', fetchNearbyGyms)

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, createGym)
}
