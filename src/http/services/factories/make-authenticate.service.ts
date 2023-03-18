import { PrismaUsersRepository } from '~/repositories/prisma/prisma-users-repositories'
import { AuthenticateService } from '../authenticate.service'

export function makeAuthenticateService() {
  const repository = new PrismaUsersRepository()
  const service = new AuthenticateService(repository)

  return service
}
