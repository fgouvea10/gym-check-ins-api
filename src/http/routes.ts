import { FastifyInstance } from 'fastify'

import { authenticate } from './controllers/authenticate.controller'
import { profile } from './controllers/profile.controller'
import { register } from './controllers/register.controller'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.get('/me', profile)
  app.post('/sessions', authenticate)
}
