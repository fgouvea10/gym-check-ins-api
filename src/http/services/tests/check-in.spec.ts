import { Decimal } from '@prisma/client/runtime/library'
import { describe, beforeEach, expect, it, vi, afterEach } from 'vitest'

import { InMemoryCheckInsRepository } from '~/repositories/in-memory/check-ins-repository'
import { InMemoryGymsRepository } from '~/repositories/in-memory/in-memory-gyms-repository'
import { CheckInService } from '../check-in.service'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInService

describe('Check-in Service', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInService(checkInRepository, gymsRepository)

    gymsRepository.gyms.push({
      id: 'gym-01',
      title: 'Gym Sample Name Example',
      description: '',
      phone: '',
      latitude: new Decimal( -22.8418808),
      longitude: new Decimal(-43.3404514),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.8418808,
      userLongitude: -43.3404514
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.8418808,
      userLongitude: -43.3404514
    })

    await expect(() => sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.8418808,
      userLongitude: -43.3404514
    })).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.8418808,
      userLongitude: -43.3404514
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.8418808,
      userLongitude: -43.3404514
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.gyms.push({
      id: 'gym-02',
      title: 'Gym Sample Name Example',
      description: '',
      phone: '',
      latitude: new Decimal(-22.7939547),
      longitude: new Decimal(-43.2920747),
    })

    await expect(() => sut.execute({
      gymId: 'gym-02',
      userId: 'user-01',
      userLatitude: -22.8418808,
      userLongitude: -43.3404514
    })).rejects.toBeInstanceOf(Error)
  })
})
