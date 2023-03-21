import type { CheckIn } from '@prisma/client'

import { CheckInsRepository } from '~/repositories/interfaces/check-ins-repository'
import { GymsRepository } from '~/repositories/interfaces/gyms-repository'
import { getDistanceBetweenCoordinates } from '~/utils/get-distance-between-coordinates'
import { ResourceNotExistsException } from './errors'
import { MaxDistanceException } from './errors/max-distance-error'
import { MaxNumberOfCheckInsException } from './errors/max-number-of-check-ins-error'

interface CheckInServiceRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInServiceResponse {
  checkIn: CheckIn;
}

export class CheckInService {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) throw new ResourceNotExistsException()

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
    )

    const MAX_DISTANCE_BETWEEN_GYM_AND_USER_IN_KM = 0.1

    if (distance > MAX_DISTANCE_BETWEEN_GYM_AND_USER_IN_KM)
      throw new MaxDistanceException()

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    )

    if (checkInOnSameDay) throw new MaxNumberOfCheckInsException()

    const checkIn = await this.checkInsRepository.create({
      userId,
      gymId,
    })

    return {
      checkIn,
    }
  }
}
