import type { User } from '@prisma/client'

import { UsersRepository } from '~/repositories/interfaces/users-repository'
import { ResourceNotExistsException } from './errors'

interface GetUserProfileServiceRequest {
  userId: string
}

interface GetUserProfileServiceResponse {
  user: User
}

export class GetUserService {
  constructor(private repository: UsersRepository) {}

  async execute({ userId }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
    const user = await this.repository.findById(userId)

    if (!user) throw new ResourceNotExistsException()

    return {
      user
    }
  }
}
