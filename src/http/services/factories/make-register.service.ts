import { PrismaUsersRepository } from '~/repositories/prisma/prisma-users-repositories'
import { RegisterService } from '../register.service'

export function makeRegisterService() {
  const repository = new PrismaUsersRepository()
  const service = new RegisterService(repository)

  return service
}
