import { describe, beforeEach, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '~/repositories/in-memory/check-ins-repository'
import { FetchUserCheckInsHistoryService } from '../fetch-user-check-ins-history.service'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryService

describe('Fetch Check-In history Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryService(checkInsRepository)

    // await gymsRepository.create({
    //   id: 'gym-01',
    //   title: 'Gym Sample Name Example',
    //   description: '',
    //   phone: '',
    //   latitude:  -22.8418808,
    //   longitude: -43.3404514,
    // })
  })

  it('should be able to fetch check-in history', async () => {
    await checkInsRepository.create({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    await checkInsRepository.create({
      gymId: 'gym-02',
      userId: 'user-01',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: 'gym-01' }),
      expect.objectContaining({ gymId: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gymId: `gym-${i}`,
        userId: 'user-01',
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: 'gym-21' }),
      expect.objectContaining({ gymId: 'gym-22' }),
    ])
  })

})
