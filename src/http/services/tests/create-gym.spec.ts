import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '~/repositories/in-memory/in-memory-gyms-repository'

import { CreateGymService } from '../create-gym.service'

let repository: InMemoryGymsRepository
let sut: CreateGymService

describe('Register Service', () => {
  beforeEach(() => {
    repository = new InMemoryGymsRepository()
    sut = new CreateGymService(repository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'Gym Sample Name Example',
      description: null,
      phone: null,
      latitude: -22.8418808,
      longitude: -43.3404514,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
