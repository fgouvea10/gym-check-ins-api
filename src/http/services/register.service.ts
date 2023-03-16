import { hash } from 'bcrypt'

import { prisma } from '~/lib/prisma'
import { PrismaUsersRepository } from '~/repositories/prisma-users-repositories'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

export async function registerService(
  { name, email, password }: RegisterServiceRequest) 
{
  const passwordHash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (userWithSameEmail) throw new Error('Email already exists')

  const prismaUsersRepository = new PrismaUsersRepository()

  await prismaUsersRepository.create({
    name,
    email,
    passwordHash
  })
  
}