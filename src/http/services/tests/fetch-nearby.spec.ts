import { describe, beforeEach, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '~/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearByGymsService } from '../fetch-nearby-gyms.service'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearByGymsService

describe('Fetch nearby gyms service', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearByGymsService(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near gym',
      description: null,
      phone: null,
      latitude: -22.8418808,
      longitude: -43.3404514,
    })

    await gymsRepository.create({
      title: 'Far gym',
      description: null,
      phone: null,
      latitude: 12.9765381,
      longitude: -38.4815099,
    })

    const { gyms } = await sut.execute({
      userLatitude: -22.8418808,
      userLongitude: -43.3404514
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near gym' }),
    ])
  })
})
