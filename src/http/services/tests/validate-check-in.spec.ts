import { describe, beforeEach, expect, it, afterEach, vi } from 'vitest'

import { InMemoryCheckInsRepository } from '~/repositories/in-memory/check-ins-repository'
import { LateCheckInValidationException, ResourceNotExistsException } from '../errors'
import { ValidateCheckInService } from '../validate-check-in.service'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInService

describe('Validate check-in service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInService(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validatedAt).toEqual(expect.any(Date))
    expect(checkInsRepository.checkIns[0].validatedAt).toEqual(
      expect.any(Date)
    )
  })

  it('should be able to validate a non-existent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'non-existent-check-in-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotExistsException)
  })

  it('should not be able to validate the check-in 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() => sut.execute({
      checkInId: createdCheckIn.id,
    })).rejects.toBeInstanceOf(LateCheckInValidationException)
  })
})
