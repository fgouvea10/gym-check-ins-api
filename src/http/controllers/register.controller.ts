import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { RegisterService } from '../services/register.service'
import { PrismaUsersRepository } from '~/repositories/prisma/prisma-users-repositories'
import { UserAlreadyExistsException } from '../services/errors/user-already-exists'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { name, email, password } = registerBodySchema.parse(request.body)
  
  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerService = new RegisterService(prismaUsersRepository)

    await registerService.execute({ name, email, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistsException) return reply.status(409).send({
      message: err.message
    })

    throw err
  }

  return reply.status(201).send()
}