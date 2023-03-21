import { describe, beforeEach, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '~/repositories/in-memory/check-ins-repository'
import { GetUserMetricsService } from '../get-user-metrics.service'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsService

describe('Get user metrics service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsService(checkInsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    await checkInsRepository.create({
      gymId: 'gym-02',
      userId: 'user-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
