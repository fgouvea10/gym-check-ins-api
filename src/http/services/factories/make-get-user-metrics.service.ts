import { PrismaCheckInsRepository } from '~/repositories/prisma/prisma-check-ins-repository'
import { GetUserMetricsService } from '../get-user-metrics.service'

export function makeGetUserMetricsService() {
  const repository = new PrismaCheckInsRepository()
  const service = new GetUserMetricsService(repository)

  return service
}
