import { PrismaGymsRepository } from '~/repositories/prisma/prisma-gyms-repository'
import { SearchGymsService } from '../sarch-gyms.service'

export function makeSearchGymsService() {
  const repository = new PrismaGymsRepository()
  const service = new SearchGymsService(repository)

  return service
}
