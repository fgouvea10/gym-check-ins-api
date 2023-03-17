import { hash } from 'bcrypt'

import { prisma } from '~/lib/prisma'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private repository: any) {}

  async execute({ name, email, password }: RegisterServiceRequest) {
    const passwordHash = await hash(password, 6)
  
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email
      }
    })
  
    if (userWithSameEmail) throw new Error('Email already exists')
  
    await this.repository.create({
      name,
      email,
      passwordHash
    })
  }
}

