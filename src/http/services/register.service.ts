import { hash } from 'bcrypt'

import { UsersRepository } from '~/repositories/interfaces/users-repository'
import { UserAlreadyExistsException } from './errors/user-already-exists'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private repository: UsersRepository) {}

  async execute({ name, email, password }: RegisterServiceRequest) {
    const passwordHash = await hash(password, 6)
  
    const userWithSameEmail = await this.repository.findByEmail(email)
  
    if (userWithSameEmail) throw new UserAlreadyExistsException()
  
    await this.repository.create({
      name,
      email,
      passwordHash
    })
  }
}

