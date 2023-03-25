import { PrismaUsersRepository } from '~/repositories/prisma/prisma-users-repositories'
import { GetUserService } from '../get-user-profile.service'

export function makeGetUserProfileService() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserService(usersRepository)

  return useCase
}
