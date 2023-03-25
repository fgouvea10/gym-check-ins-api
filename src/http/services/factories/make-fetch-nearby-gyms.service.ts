import { PrismaGymsRepository } from '~/repositories/prisma/prisma-gyms-repository'
import { FetchNearByGymsService } from '../fetch-nearby-gyms.service'

export function makeFetchNearbyGyms() {
  const repository = new PrismaGymsRepository()
  const service = new FetchNearByGymsService(repository)

  return service
}
