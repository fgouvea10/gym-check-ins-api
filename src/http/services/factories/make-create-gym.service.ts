import { PrismaGymsRepository } from '~/repositories/prisma/prisma-gyms-repository'
import { CreateGymService } from '../create-gym.service'

export function makeCreateGymService() {
  const repository = new PrismaGymsRepository()
  const service = new CreateGymService(repository)

  return service
}
