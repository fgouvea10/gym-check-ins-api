import { FastifyInstance } from 'fastify'

import { authenticate } from './authenticate.controller'
import { profile } from './profile.controller'
import { register } from './register.controller'
import { verifyJWT } from '../../middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.get('/me', { onRequest: [verifyJWT] }, profile)
  app.post('/sessions', authenticate)
}
