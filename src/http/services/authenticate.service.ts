import { compare } from 'bcrypt'
import type { User } from '@prisma/client'

import { UsersRepository } from '~/repositories/interfaces/users-repository'
import { InvalidCredentialsException } from './errors'

interface AuthenticateServiceRequest {
  email: string;
  password: string;
}

interface AuthenticateServiceResponse {
  user: User
}

export class AuthenticateService {
  constructor(private repository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.repository.findByEmail(email)

    if (!user) throw new InvalidCredentialsException()

    const doesPasswordMatches = await compare(password, user.passwordHash)

    if (!doesPasswordMatches) throw new InvalidCredentialsException()

    return {
      user
    }
  }
}
